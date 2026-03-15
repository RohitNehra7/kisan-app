import axios from 'axios';
import { supabase } from '../config/supabase';
import { GeoService } from './geo.service';
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

    console.log('🚀 Starting Autonomous Metadata Discovery (Paginated)...');
    
    try {
      // 1. Get Total Count
      const metaResp = await axios.get(DATA_GOV_API_URL, { params: { 'api-key': apiKey, format: 'json', limit: 0 } });
      const total = metaResp.data.total || 0;
      console.log(`📊 API contains ${total} total records. Syncing in chunks...`);

      const chunkSize = 1000;
      let offset = 0;

      while (offset < total) {
        console.log(`🔄 [Discovery] Processing offset ${offset}/${total}...`);
        
        try {
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
          const { error: mErr } = await supabase.from('mandi_directory').upsert(uniqueMandis, { onConflict: 'state,market' });
          if (mErr) console.warn('⚠️ [Discovery] Mandi Upsert Warn:', mErr.message);

          // Batch Upsert Crops
          const { error: cErr } = await supabase.from('commodity_directory').upsert(crops, { onConflict: 'commodity' });
          if (cErr) console.warn('⚠️ [Discovery] Crop Upsert Warn:', cErr.message);

          offset += chunkSize;
        } catch (apiErr: any) {
          if (apiErr.response?.status === 429) {
            console.warn('⚠️ [Discovery] Rate limited. Waiting 10s...');
            await new Promise(res => setTimeout(res, 10000));
            continue; // Retry same offset
          } else {
            console.error('❌ [Discovery] Chunk failed:', apiErr.message);
            break; 
          }
        }
        
        // Prevent API throttling
        await new Promise(res => setTimeout(res, 2000));
      }

      console.log('✅ Metadata Discovery Complete!');
    } catch (e: any) {
      console.error('❌ Metadata Discovery Failed:', e.message);
    }
  }

  /**
   * Fetch current prices from OGD API and sync to Supabase
   * (Self-Healing Fallback)
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
        return response.data.records || [];
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
   * DATA WAREHOUSE SYNC (Background Only)
   * Fetches latest prices for all active states and updates the local DB
   */
  static async syncAllMarketPrices(): Promise<void> {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) return;

    console.log('🔄 [Warehouse] Starting Global Price Sync (Safe Mode)...');
    let totalSynced = 0;
    
    try {
      // 1. DYNAMIC STATE DISCOVERY: Fetch all states from our directory
      const allDiscoveredStates = await this.getStates();
      
      // 2. BUSINESS PRIORITY: Ensure our Tier 1 states are processed first
      const priorityStates = PROJECT_CONFIG.PRIORITY_STATES;
      const sortedStates = [
        ...priorityStates.filter(s => allDiscoveredStates.includes(s)),
        ...allDiscoveredStates.filter(s => !priorityStates.includes(s))
      ];
      
      const datesToSync: string[] = [];
      for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        datesToSync.push(ds);
      }

      for (const state of sortedStates) {
        let stateFreshestDate = "None";
        for (const dateStr of datesToSync) {
          console.log(`📡 [Warehouse] Fetching ${state} | ${dateStr}...`);
          
          try {
            const response = await axios.get(DATA_GOV_API_URL, {
              params: { 
                'api-key': apiKey, 
                'format': 'json', 
                'limit': 500, // Reduced limit for faster day-by-day sync
                'filters[state]': state,
                'filters[arrival_date]': dateStr,
                'fields': 'state,district,market,commodity,variety,arrival_date,min_price,max_price,modal_price,arrivals_in_qtl'
              },
              timeout: 15000
            });

            const records = response.data.records || [];
            if (records.length > 0) {
              stateFreshestDate = dateStr;
              console.log(`   ∟ Success: Found ${records.length} records for ${dateStr}`);
              
              const cleanedData: MandiRecord[] = records.map((r: any) => ({
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

              const uniqueBatch = Array.from(new Map(
                cleanedData.map(item => [`${item.market}-${item.commodity}-${item.variety}-${item.arrival_date}`, item])
              ).values());

              if (supabase) {
                const { error } = await supabase.from('prices').upsert(uniqueBatch, { onConflict: 'market,commodity,variety,arrival_date' });
                if (error) console.warn(`⚠️ [Warehouse] DB Error:`, error.message);
                else totalSynced += uniqueBatch.length;
              }
            } else {
              console.log(`   ∟ Info: No records reported for ${dateStr}`);
            }
          } catch (apiErr: any) {
            if (apiErr.response?.status === 429) {
              console.warn('⚠️ [Warehouse] Rate limit hit. Cooling down for 10 seconds...');
              await new Promise(res => setTimeout(res, 10000));
            } else {
              console.error(`❌ [Warehouse] API Error for ${state}:`, apiErr.message);
            }
          }

          // Intentional delay to respect OGD rate limits
          await new Promise(res => setTimeout(res, 2000));
        }
        console.log(`✅ [Warehouse] Finished ${state}. Latest Date: ${stateFreshestDate}`);
      }

      // Log success heartbeat
      if (supabase) {
        await supabase.from('sync_logs').insert({ 
          worker_name: 'price_sync', 
          status: 'success', 
          records_synced: totalSynced 
        });
      }
      console.log('✅ [Warehouse] Global Price Sync Complete!');
    } catch (e: any) {
      console.error('❌ [Warehouse] Sync loop failed:', e.message);
      if (supabase) {
        await supabase.from('sync_logs').insert({ 
          worker_name: 'price_sync', 
          status: 'error', 
          error_message: e.message 
        });
      }
    }
  }

  /**
   * Triple-Lock Reliability: Automated Heartbeat Recovery
   * Checks if the last sync was more than 12 hours ago and triggers a refresh if needed.
   */
  static async checkSyncHealthAndRecover(): Promise<void> {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('sync_logs')
        .select('created_at')
        .eq('worker_name', 'price_sync')
        .eq('status', 'success')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const lastSync = data && data[0] ? new Date(data[0].created_at).getTime() : 0;
      const now = Date.now();
      const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

      if (now - lastSync > TWELVE_HOURS_MS) {
        console.warn('🚨 [Heartbeat] Last sync is stale (>12h). Triggering recovery sync...');
        // Run in background, don't await to keep user response fast
        this.syncAllMarketPrices();
      }
    } catch (e) {
      console.error('⚠️ [Heartbeat] Health check failed:', e);
    }
  }

  /**
   * Serve Prices (From local DB only)
   * This is what makes the app BLAZING FAST
   */
  static async getPricesFromDB(state: string, commodity?: string, market?: string): Promise<MandiRecord[]> {
    try {
      if (!supabase) return [];

      let query = supabase
        .from('prices')
        .select('*')
        .eq('state', state);

      if (commodity && commodity !== 'all') query = query.eq('commodity', commodity);
      if (market && market !== 'all') query = query.eq('market', market);

      const { data, error } = await query.order('arrival_date', { ascending: false });
      if (error) throw error;

      // 3. ENTEPRISE SORT & DEDUPLICATION:
      const parseDate = (d: string) => {
        const parts = d.split('/');
        const day = parseInt(parts[0] || '1') || 1;
        const month = parseInt(parts[1] || '1') || 1;
        const year = parseInt(parts[2] || '2026') || 2026;
        return new Date(year, month - 1, day).getTime();
      };

      const sorted = (data as MandiRecord[]).sort((a, b) => parseDate(b.arrival_date) - parseDate(a.arrival_date));

      return Array.from(new Map(
        sorted.map(item => [`${item.market}-${item.commodity}-${item.variety}`, item])
      ).values());

    } catch (e) {
      console.error('DB Fetch Error:', e);
      return [];
    }
  }

  /**
   * Get all supported states from Directory
   * Returns all states that we have discovered mandis for.
   */
  static async getStates(): Promise<string[]> {
    try {
      if (!supabase) return ["Haryana", "Punjab"];
      
      const { data, error } = await supabase
        .from('mandi_directory')
        .select('state');
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return ["Haryana", "Punjab"];
      }
      
      // Return every state present in our Mandi Directory
      const states = Array.from(new Set(data.map(d => d.state))).sort();
      return states;
    } catch (e) {
      console.error('⚠️ [MandiService] Failed to fetch states from Directory:', e);
      return ["Haryana", "Punjab"];
    }
  }

  /**
   * Get all mandis for a state (Exhaustive from Directory)
   */
  static async getMarkets(state: string): Promise<string[]> {
    try {
      if (!supabase) return [];
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
      if (!supabase) return [];
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
      if (!supabase) return [];
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

  /**
   * Get 7-day average arrivals for a district and crop
   */
  static async getAvg7dArrivals(district: string, crop: string): Promise<number> {
    try {
      if (!supabase) return 0;
      const { data, error } = await supabase
        .from('prices')
        .select('arrivals_in_qtl')
        .eq('district', district)
        .eq('commodity', crop)
        .order('arrival_date', { ascending: false })
        .limit(7);

      if (error || !data || data.length === 0) return 0;
      const sum = data.reduce((acc: number, r: any) => acc + (r.arrivals_in_qtl || 0), 0);
      return Math.round(sum / data.length);
    } catch (e) {
      return 0;
    }
  }
}
