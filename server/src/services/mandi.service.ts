import axios from 'axios';
import { supabase } from '../config/supabase';
import { GeoService } from './geo.service';
import { LiveMandiService } from './live-mandi.service';
import { PROJECT_CONFIG } from '../config/project.config';
import { ArbitrageResult, MandiRecord } from '../types';

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

export class MandiService {
  /**
   * Calculate Arbitrage (Net Profit) for a crop across major mandis
   */
  static async calculateArbitrage(crop: string, quantity: number, userDistrict: string, transportRate: number): Promise<ArbitrageResult[]> {
    try {
      const targetDistricts = PROJECT_CONFIG.ARBITRAGE_TARGET_DISTRICTS;
      const basePrices: Record<string, number> = PROJECT_CONFIG.FALLBACK_MODAL_PRICES;

      // Use the Warehouse DB for speed and consistency
      const liveRecords = await this.getPricesFromDB('Haryana', crop);
      
      const results: ArbitrageResult[] = targetDistricts.map((mandi: string) => {
        const distance = GeoService.calculateDistance(userDistrict, mandi);
        
        // Find price: Live Match -> State Avg -> Mock Fallback
        let marketPrice = 0;
        const exactMatch = liveRecords.find((r: MandiRecord) => r.district.toLowerCase() === mandi.toLowerCase());
        
        if (exactMatch) {
          marketPrice = exactMatch.modal_price;
        } else if (liveRecords.length > 0) {
          const sum = liveRecords.reduce((acc: number, r: MandiRecord) => acc + r.modal_price, 0);
          marketPrice = (sum / liveRecords.length) + (Math.random() * 40 - 20); 
        } else {
          marketPrice = (basePrices[crop] || basePrices["Default"] || 2100) + (Math.random() * 60 - 30);
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
   * Mandi Navigator: Find 3 best mandis based on transport-adjusted price
   */
  static async getNearlyBestDeals(userDistrict: string, crop: string): Promise<any[]> {
    try {
      const prices = await this.getPricesFromDB('Haryana', crop);
      if (prices.length === 0) return [];

      const userCoords = PROJECT_CONFIG.DISTRICT_COORDS[userDistrict] || PROJECT_CONFIG.DISTRICT_COORDS['Karnal'];
      const transportRate = 3; 

      const calculated = prices.map(record => {
        const distance = GeoService.calculateDistance(userDistrict, record.district);
        const transportCost = (distance / 10) * transportRate;
        const netPrice = record.modal_price - transportCost;

        return {
          ...record,
          distance: Math.round(distance),
          transport_cost: Math.round(transportCost),
          net_price: Math.round(netPrice)
        };
      });

      return calculated.sort((a, b) => b.net_price - a.net_price).slice(0, 3);
    } catch (e) {
      console.error('Navigator Error:', e);
      return [];
    }
  }

  /**
   * Recursive Metadata Discovery
   * Scans 100% of the API data to build an exhaustive directory
   */
  static async discoverAllMetadata(): Promise<void> {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey || !supabase) return;

    console.log('🚀 [Discovery] Starting Exhaustive Metadata Scan...');
    
    try {
      const metaResp = await axios.get(DATA_GOV_API_URL, { params: { 'api-key': apiKey, format: 'json', limit: 0 } });
      const total = metaResp.data.total || 0;
      
      let offset = 0;
      const chunkSize = 1000;

      while (offset < total) {
        console.log(`🔄 [Discovery] Scanning offset ${offset}/${total}...`);
        const resp = await axios.get(DATA_GOV_API_URL, {
          params: { 'api-key': apiKey, format: 'json', limit: chunkSize, offset }
        });
        
        const records = resp.data.records || [];
        if (records.length === 0) break;

        const mandis = records.map((r: any) => ({
          state: r.state,
          market: r.market.replace(/ APMC$/i, '').trim(),
          district: r.district
        }));

        const crops = Array.from(new Set(records.map((r: any) => r.commodity))).map(c => ({ commodity: c }));

        const uniqueMandis = Array.from(new Map(mandis.map((m: any) => [`${m.state}-${m.market}`, m])).values());
        await supabase.from('mandi_directory').upsert(uniqueMandis, { onConflict: 'state,market' });
        await supabase.from('commodity_directory').upsert(crops, { onConflict: 'commodity' });

        offset += chunkSize;
        await new Promise(res => setTimeout(res, 1000));
      }
      console.log('✅ [Discovery] Global Directory Sync Complete!');
    } catch (e: any) {
      console.error('❌ [Discovery] Failed:', e.message);
    }
  }

  /**
   * DATA WAREHOUSE SYNC: The "Engine Room"
   * Exhaustively scans the OGD API to capture every record for target states.
   */
  static async syncAllMarketPrices(): Promise<void> {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey || !supabase) return;

    console.log('🔄 [Warehouse] Starting Deep-Scan Price Sync...');
    let totalSynced = 0;
    
    try {
      const allDiscoveredStates = await this.getStates();
      const priorityStates = PROJECT_CONFIG.PRIORITY_STATES;
      
      const sortedStates = [
        ...priorityStates.filter(s => allDiscoveredStates.includes(s)),
        ...allDiscoveredStates.filter(s => !priorityStates.includes(s))
      ];

      // 15-day window for trends
      const datesToSync: string[] = [];
      for (let i = 0; i < 15; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        datesToSync.push(`${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`);
      }

      for (const state of sortedStates) {
        const activeWindow = priorityStates.includes(state) ? datesToSync : datesToSync.slice(0, 3);
        
        for (const dateStr of activeWindow) {
          console.log(`📡 [Warehouse] Deep Fetch: ${state} | ${dateStr}`);
          
          try {
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
              const response = await axios.get(DATA_GOV_API_URL, {
                params: { 
                  'api-key': apiKey, 
                  'format': 'json', 
                  'limit': 1000,
                  'offset': offset,
                  'filters[state]': state,
                  'filters[arrival_date]': dateStr,
                  'fields': 'state,district,market,commodity,variety,arrival_date,min_price,max_price,modal_price,arrivals_in_qtl'
                },
                timeout: 20000
              });

              const rawRecords = response.data.records || [];
              if (rawRecords.length === 0) { hasMore = false; break; }

              const cleanedData: MandiRecord[] = rawRecords.map((r: any) => ({
                state: r.state || "N/A",
                district: r.district || "N/A",
                market: r.market.replace(/ APMC$/i, '').trim(),
                commodity: r.commodity === 'Rapeseed and Mustard' ? 'Mustard' : r.commodity, 
                variety: r.variety || "N/A",
                arrival_date: r.arrival_date || "N/A",
                min_price: parseFloat(r.min_price) || 0,
                max_price: parseFloat(r.max_price) || 0,
                modal_price: parseFloat(r.modal_price) || 0,
                arrivals_in_qtl: r.arrivals_in_qtl === 'NA' ? 0 : (parseFloat(r.arrivals_in_qtl) || 0)
              }));

              const uniqueBatch = Array.from(new Map(
                cleanedData.map(item => [`${item.market}-${item.commodity}-${item.variety}-${item.arrival_date}`, item])
              ).values());

              // 1. Update current prices (Overwrite with latest)
              await supabase.from('prices').upsert(uniqueBatch, { onConflict: 'state,market,commodity,variety' });
              
              // 2. Archive to price_history (Log everything)
              const historyData = uniqueBatch.map(item => {
                const [d, m, y] = item.arrival_date.split('/');
                return { 
                  ...item, 
                  arrival_date: `${y}-${m}-${d}`,
                  district: item.district
                };
              });
              await supabase.from('price_history').upsert(historyData, { onConflict: 'market,commodity,variety,arrival_date' });

              totalSynced += uniqueBatch.length;
              if (rawRecords.length < 1000) hasMore = false;
              else offset += 1000;

              await new Promise(res => setTimeout(res, 1500)); 
            }
          } catch (apiErr: any) {
            console.error(`❌ [Warehouse] API Error for ${state}:`, apiErr.message);
            if (apiErr.response?.status === 429) await new Promise(res => setTimeout(res, 10000));
          }
        }
      }

      await supabase.from('sync_logs').insert({ worker_name: 'price_sync', status: 'success', records_synced: totalSynced });
      console.log('✅ [Warehouse] Deep Sync Complete!');
    } catch (e: any) {
      console.error('❌ [Warehouse] Sync loop failed:', e.message);
      await supabase.from('sync_logs').insert({ worker_name: 'price_sync', status: 'error', error_message: e.message });
    }
  }

  /**
   * Self-Healing Live Fetch
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
        if (comm) params['filters[commodity]'] = (comm === 'Mustard' ? 'Rapeseed and Mustard' : comm);
        if (market) params['filters[market]'] = market;
        if (dateStr) params['filters[arrival_date]'] = dateStr;
        
        let response = await axios.get(DATA_GOV_API_URL, { params });
        return response.data.records || [];
      } catch (e) { return []; }
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
        commodity: r.commodity === 'Rapeseed and Mustard' ? 'Mustard' : r.commodity,
        variety: r.variety || "N/A",
        arrival_date: r.arrival_date || "N/A",
        min_price: parseFloat(r.min_price) || 0,
        max_price: parseFloat(r.max_price) || 0,
        modal_price: parseFloat(r.modal_price) || 0,
        arrivals_in_qtl: r.arrivals_in_qtl === 'NA' ? 0 : (parseFloat(r.arrivals_in_qtl) || 0)
      }));

      if (cleanedData.length > 0 && supabase) {
        // 1. Latest Cache
        await supabase.from('prices').upsert(cleanedData, { onConflict: 'state,market,commodity,variety' });
        
        // 2. Full Warehouse
        const historyData = cleanedData.map(item => {
          const [d, m, y] = item.arrival_date.split('/');
          return { 
            ...item, 
            arrival_date: `${y}-${m}-${d}`,
            district: item.district
          };
        });
        await supabase.from('price_history').upsert(historyData, { onConflict: 'market,commodity,variety,arrival_date' });
      }

      return cleanedData;
    } catch (error) {
      console.error('Mandi Service Fetch Error:', error);
      return [];
    }
  }

  static async getPricesFromDB(state: string, commodity?: string, market?: string): Promise<MandiRecord[]> {
    try {
      if (!supabase) return [];
      let query = supabase.from('prices').select('*').eq('state', state);
      if (commodity && commodity !== 'all') query = query.eq('commodity', commodity);
      if (market && market !== 'all') query = query.eq('market', market);

      const { data, error } = await query.order('arrival_date', { ascending: false });
      if (error) throw error;

      const parseDate = (d: string) => {
        const parts = d.split('/');
        const day = parseInt(parts[0] || '1');
        const month = parseInt(parts[1] || '1');
        const year = parseInt(parts[2] || '2026');
        return new Date(year, month - 1, day).getTime();
      };

      const sorted = (data as MandiRecord[]).sort((a, b) => parseDate(b.arrival_date) - parseDate(a.arrival_date));
      return Array.from(new Map(sorted.map(item => [`${item.market}-${item.commodity}-${item.variety}`, item])).values());
    } catch (e) { return []; }
  }

  /**
   * Get all supported states from Directory
   */
  static async getStates(): Promise<string[]> {
    try {
      if (!supabase) return ["Haryana", "Punjab"];
      const { data, error } = await supabase.from('mandi_directory').select('state');
      if (error || !data || data.length === 0) return ["Haryana", "Punjab"];
      return Array.from(new Set(data.map(d => d.state))).sort();
    } catch (e) { return ["Haryana", "Punjab"]; }
  }

  static async getMarkets(state: string): Promise<string[]> {
    try {
      if (!supabase) return [];
      const { data, error } = await supabase.from('mandi_directory').select('market').eq('state', state);
      if (error) throw error;
      return Array.from(new Set(data.map(d => d.market))).sort();
    } catch (e) { return []; }
  }

  static async getCommodities(state: string, market?: string): Promise<string[]> {
    try {
      if (!supabase) return [];
      const { data, error } = await supabase.from('commodity_directory').select('commodity');
      if (error) throw error;
      return data.map(d => d.commodity).sort();
    } catch (e) { return []; }
  }

  static async getHistory(market: string, commodity: string): Promise<any[]> {
    try {
      if (!supabase) return [];
      
      const cleanMarket = market.trim();
      const cleanComm = commodity.trim();

      console.log(`📈 [Warehouse] Fetching history for ${cleanMarket} | ${cleanComm}`);

      let { data, error } = await supabase
        .from('price_history')
        .select('arrival_date, modal_price, arrivals_in_qtl')
        .ilike('market', cleanMarket)
        .ilike('commodity', cleanComm)
        .order('arrival_date', { ascending: true })
        .limit(30);

      if (error) throw error;

      // SMART BACKFILL: If DB is empty or has only 1 point, trigger the Aggregator Scraper
      if (!data || data.length < 2) {
        console.log(`🔄 [Warehouse] History thin (<2 pts). Triggering Live Scraper for ${cleanMarket}...`);
        await LiveMandiService.fetchDirectFromPortal('Haryana', '', cleanMarket, cleanComm);
        
        // Re-query once after scraping
        const { data: newData } = await supabase
          .from('price_history')
          .select('arrival_date, modal_price, arrivals_in_qtl')
          .ilike('market', cleanMarket)
          .ilike('commodity', cleanComm)
          .order('arrival_date', { ascending: true })
          .limit(30);
        data = newData;
      }
      
      return (data || []).map(row => {
        const d = new Date(row.arrival_date);
        return {
          ...row,
          arrival_date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
        };
      });
    } catch (err) { 
      console.error('History API Failure:', err);
      return []; 
    }
  }

  /**
   * Get 3-year seasonal averages (Monthly)
   */
  static async getSeasonalTrends(district: string, commodity: string): Promise<any[]> {
    try {
      if (!supabase) return [];

      // Query last 3 years of history for this district/crop
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
      const isoDate = threeYearsAgo.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('price_history')
        .select('modal_price, arrival_date')
        .eq('district', district)
        .eq('commodity', commodity)
        .gte('arrival_date', isoDate);

      if (error || !data || data.length === 0) return [];

      // Group by month and calculate average
      const monthGroups: Record<number, { sum: number, count: number }> = {};
      
      data.forEach(row => {
        const month = new Date(row.arrival_date).getMonth() + 1; // 1-12
        if (!monthGroups[month]) monthGroups[month] = { sum: 0, count: 0 };
        monthGroups[month].sum += parseFloat(row.modal_price as any);
        monthGroups[month].count += 1;
      });

      return Object.entries(monthGroups).map(([month, stats]) => ({
        month: parseInt(month),
        avg_price: Math.round(stats.sum / stats.count)
      })).sort((a, b) => a.month - b.month);

    } catch (e) {
      console.error('Seasonal Aggregation Error:', e);
      return [];
    }
  }

  static async getAvg7dArrivals(district: string, crop: string): Promise<number> {
    try {
      if (!supabase) return 0;
      const { data } = await supabase.from('prices').select('arrivals_in_qtl')
        .eq('district', district).eq('commodity', crop).order('arrival_date', { ascending: false }).limit(7);
      if (!data || data.length === 0) return 0;
      return Math.round(data.reduce((acc: number, r: any) => acc + (r.arrivals_in_qtl || 0), 0) / data.length);
    } catch (e) { return 0; }
  }

  static async checkSyncHealthAndRecover(): Promise<void> {
    try {
      if (!supabase) return;
      const { data } = await supabase.from('sync_logs').select('created_at').eq('worker_name', 'price_sync').eq('status', 'success').order('created_at', { ascending: false }).limit(1);
      const lastSync = data && data[0] ? new Date(data[0].created_at).getTime() : 0;
      if (Date.now() - lastSync > 12 * 60 * 60 * 1000) this.syncAllMarketPrices();
    } catch (e) {}
  }
}
