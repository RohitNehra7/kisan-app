import axios from 'axios';
import { MandiRecord } from '../types/db.types';
import { supabase } from '../config/supabase';

import { GeoService } from './geo.service';
import { ArbitrageResult, MandiRecord } from '../types/db.types';

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

export class MandiService {
  /**
   * Calculate Arbitrage (Net Profit) for a crop across major mandis
   */
  static async calculateArbitrage(crop: string, quantity: number, userDistrict: string, transportRate: number): Promise<ArbitrageResult[]> {
    try {
      const targetDistricts = ["Karnal", "Hisar", "Rohtak", "Sirsa", "Ambala", "Kaithal", "Panipat", "Rewari"];
      const basePrices: Record<string, number> = {
        "Wheat": 2350, "Paddy": 2300, "Mustard": 5950, "Bajra": 2600, "Cotton": 7100
      };

      // 1. Fetch live prices for this crop in Haryana
      const liveRecords = await this.fetchAndSyncPrices('Haryana', crop, undefined, 500);
      
      const results: ArbitrageResult[] = targetDistricts.map(mandi => {
        const distance = GeoService.calculateDistance(userDistrict, mandi);
        
        // Find price: Live Match -> State Avg -> Mock Fallback
        let marketPrice = 0;
        const exactMatch = liveRecords.find(r => r.district.toLowerCase() === mandi.toLowerCase());
        
        if (exactMatch) {
          marketPrice = exactMatch.modal_price;
        } else if (liveRecords.length > 0) {
          const avg = liveRecords.reduce((acc, r) => acc + r.modal_price, 0) / liveRecords.length;
          marketPrice = avg + (Math.random() * 40 - 20); 
        } else {
          marketPrice = (basePrices[crop] || 2100) + (Math.random() * 60 - 30);
        }

        const grossTotal = marketPrice * quantity;
        const transportCost = distance * transportRate * quantity;
        const netEarnings = grossTotal - transportCost;
        
        return {
          mandi,
          distance,
          gross_price: Math.round(grossTotal),
          transport_cost: Math.round(transportCost),
          net_earnings: Math.round(netEarnings),
          market_price: Math.round(marketPrice),
          is_best: false
        };
      });
      
      results.sort((a, b) => b.net_earnings - a.net_earnings);
      if (results[0]) results[0].is_best = true;
      
      return results.slice(0, 6);
    } catch (err) {
      console.error('Arbitrage Calculation Error:', err);
      return [];
    }
  }

  /**
   * Recursive Metadata Discovery
   * Scans 100% of the API data to build an exhaustive directory
   */
  static async discoverAllMetadata(): Promise<void> {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) return;
    if (!supabase) {
      console.warn('⚠️ Skipping Metadata Discovery: Supabase client not initialized.');
      return;
    }

    console.log('🚀 Starting Autonomous Metadata Discovery...');
    
    try {
      // 1. Get Total Count
      const metaResp = await axios.get(DATA_GOV_API_URL, { params: { 'api-key': apiKey, format: 'json', limit: 0 } });
      const total = metaResp.data.total || 0;
      console.log(`📊 API contains ${total} total records. Syncing in chunks...`);

      const chunkSize = 1000;
      let offset = 0;

      while (offset < total) {
        console.log(`🔄 Syncing offset ${offset}/${total}...`);
        const resp = await axios.get(DATA_GOV_API_URL, {
          params: { 'api-key': apiKey, format: 'json', limit: chunkSize, offset }
        });
        
        const records = resp.data.records || [];
        if (records.length === 0) break;

        // Extract and Clean
        const mandis = records.map((r: any) => ({
          state: r.state,
          market: r.market.replace(/ APMC$/i, '').trim(),
          district: r.district
        }));

        const crops = Array.from(new Set(records.map((r: any) => r.commodity))).map(c => ({ commodity: c }));

        // Batch Upsert Mandis
        const uniqueMandis = Array.from(new Map(mandis.map((m: any) => [`${m.state}-${m.market}`, m])).values());
        await supabase.from('mandi_directory').upsert(uniqueMandis, { onConflict: 'state,market' });

        // Batch Upsert Crops
        await supabase.from('commodity_directory').upsert(crops, { onConflict: 'commodity' });

        offset += chunkSize;
        // Small delay to prevent API throttling
        await new Promise(res => setTimeout(res, 500));
      }

      console.log('✅ Metadata Discovery Complete!');
    } catch (e: any) {
      console.error('❌ Metadata Discovery Failed:', e.message);
    }
  }

  /**
   * Fetch current prices from OGD API and sync to Supabase
   */
  static async fetchAndSyncPrices(state?: string, commodity?: string, market?: string, limit: number = 1000): Promise<MandiRecord[]> {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) throw new Error('DATA_GOV_API_KEY is not configured');

    const fetchFromGov = async (comm?: string, dateStr?: string): Promise<any[]> => {
      try {
        const params: any = { 
          'api-key': apiKey, 
          'format': 'json', 
          'limit': limit,
          'fields': 'state,district,market,commodity,variety,arrival_date,min_price,max_price,modal_price,arrivals_in_qtl'
        };
        if (state) params['filters[state]'] = state;
        if (comm) params['filters[commodity]'] = comm;
        if (market) params['filters[market]'] = market;
        if (dateStr) params['filters[arrival_date]'] = dateStr;
        
        let response = await axios.get(DATA_GOV_API_URL, { params });
        let records = response.data.records || [];

        if (records.length === 0 && market && !market.toUpperCase().endsWith('APMC')) {
          params['filters[market]'] = `${market} APMC`;
          response = await axios.get(DATA_GOV_API_URL, { params });
          records = response.data.records || [];
        }

        return records;
      } catch (e) {
        console.error('Data.gov.in fetch error', e);
        return [];
      }
    };

    try {
      let rawRecords = await fetchFromGov(commodity);

      if (rawRecords.length === 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = `${String(yesterday.getDate()).padStart(2, '0')}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${yesterday.getFullYear()}`;
        rawRecords = await fetchFromGov(commodity, yestStr);
      }

      const cleanedData: MandiRecord[] = rawRecords.map((r: any) => ({
        state: r.state || "N/A",
        district: r.district || "N/A",
        market: r.market.replace(/ APMC$/i, '').trim(),
        commodity: r.commodity || "N/A",
        variety: r.variety || "N/A",
        arrival_date: r.arrival_date || "N/A",
        min_price: parseFloat(r.min_price) || 0,
        max_price: parseFloat(r.max_price) || 0,
        modal_price: parseFloat(r.modal_price) || 0,
        arrivals_in_qtl: r.arrivals_in_qtl === 'NA' ? 0 : (parseFloat(r.arrivals_in_qtl) || 0)
      }));

      if (cleanedData.length > 0 && supabase) {
        supabase.from('prices').upsert(cleanedData, { onConflict: 'market,commodity,variety,arrival_date' })
          .then(({ error }) => { if (error) console.warn('Supabase sync error', error.message); });
      }

      return cleanedData;
    } catch (error) {
      console.error('Mandi Service Fetch Error:', error);
      return [];
    }
  }

  /**
   * Get all supported states from Directory
   */
  static async getStates(): Promise<string[]> {
    try {
      if (!supabase) throw new Error('No DB');
      const { data, error } = await supabase.from('mandi_directory').select('state');
      if (error) throw error;
      return Array.from(new Set(data.map(d => d.state))).sort();
    } catch (e) {
      return ["Haryana", "Punjab", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Maharashtra"].sort();
    }
  }

  /**
   * Get all mandis for a state (Exhaustive from Directory)
   */
  static async getMarkets(state: string): Promise<string[]> {
    try {
      if (!supabase) throw new Error('No DB');
      const { data, error } = await supabase
        .from('mandi_directory')
        .select('market')
        .eq('state', state);
      if (error) throw error;
      return Array.from(new Set(data.map(d => d.market))).sort();
    } catch (e) {
      return [];
    }
  }

  /**
   * Get all commodities for a state/market (Exhaustive)
   */
  static async getCommodities(state: string, market?: string): Promise<string[]> {
    try {
      if (!supabase) throw new Error('No DB');
      if (market && market !== 'all') {
        // Find crops seen in this specific market from history
        const { data, error } = await supabase.rpc('get_unique_crops', { p_state: state, p_market: market });
        if (!error && data) return data.map((d: any) => d.commodity).sort();
      }
      
      const { data, error } = await supabase.from('commodity_directory').select('commodity');
      if (error) throw error;
      return data.map(d => d.commodity).sort();
    } catch (e) {
      return [];
    }
  }

  /**
   * Get historical trends
   */
  static async getHistory(market: string, commodity: string): Promise<any[]> {
    try {
      if (!supabase) throw new Error('No DB');
      const { data, error } = await supabase
        .from('prices')
        .select('arrival_date, modal_price, arrivals_in_qtl')
        .eq('market', market)
        .eq('commodity', commodity)
        .order('arrival_date', { ascending: true })
        .limit(30);

      if (error) throw error;
      return data || [];
    } catch (err) {
      return [];
    }
  }
}
