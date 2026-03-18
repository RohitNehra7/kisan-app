import puppeteer from 'puppeteer';
import { MandiRecord } from '../types';
import { supabase } from '../config/supabase';

/**
 * LIVE MANDI SERVICE (Puppeteer Aggregator Ingester)
 * "The Night Shift Refactor - V2"
 * 
 * Bypasses the 403 Forbidden blocks on aggregators by using a real headless browser.
 * This guarantees we get the 18/03 data that OGD API is missing.
 */
export class LiveMandiService {
  
  static formatUrlParam(param: string): string {
    return param.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  /**
   * Fetch live price from Aggregator via Puppeteer
   */
  static async fetchDirectFromPortal(state: string, district: string, market: string, commodity: string): Promise<MandiRecord[]> {
    let browser;
    try {
      const commParam = this.formatUrlParam(commodity);
      const stateParam = this.formatUrlParam(state);
      const marketParam = this.formatUrlParam(market.replace(/\(.*\)/, '')); 
      
      const url = `https://www.commodityonline.com/mandiprices/${commParam}/${stateParam}/${marketParam}`;
      console.log(`📡 [Puppeteer] Navigating to: ${url}`);

      browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Spoof user agent to be safe
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
      
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Extract data directly from the DOM
      const records = await page.evaluate((state, district, market, commodity) => {
        const results: any[] = [];
        const rows = document.querySelectorAll('table tbody tr');
        
        rows.forEach(row => {
          const cols = row.querySelectorAll('td');
          if (cols.length >= 9) {
            const getText = (idx: number) => {
              const el = cols[idx];
              return el ? (el as HTMLElement).innerText.trim() : "";
            };

            const dateStr = getText(1);
            const modalStr = getText(8).replace(/[^0-9.]/g, '');
            const minStr = getText(6).replace(/[^0-9.]/g, '');
            const maxStr = getText(7).replace(/[^0-9.]/g, '');
            
            const modalPrice = parseFloat(modalStr);
            if (!isNaN(modalPrice) && modalPrice > 0 && dateStr.length >= 8) {
              results.push({
                state: getText(3) || state,
                district: getText(4) || district,
                market: getText(5) || market,
                commodity: getText(0) || commodity,
                variety: getText(2) || "Other",
                arrival_date: dateStr,
                min_price: parseFloat(minStr) || modalPrice,
                max_price: parseFloat(maxStr) || modalPrice,
                modal_price: modalPrice,
                arrivals_in_qtl: 0 
              });
            }
          }
        });
        return results;
      }, state, district, market, commodity);

      if (records && records.length > 0) {
        console.log(`   ✅ Success! Found ${records.length} records. Archiving to Warehouse...`);
        
        // DUAL-WRITE
        if (supabase) {
          await supabase.from('prices').upsert(records, { onConflict: 'market,commodity,variety,arrival_date' });
          
          const historyData = records.map(item => {
            const parts = item.arrival_date.split('/');
            const isoDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : null;
            return { ...item, arrival_date: isoDate };
          }).filter(item => item.arrival_date !== null);
          
          if (historyData.length > 0) {
             await supabase.from('price_history').upsert(historyData, { onConflict: 'market,commodity,variety,arrival_date' });
          }
        }
      } else {
        console.warn(`⚠️ [Puppeteer] No data found for ${market} on the aggregator.`);
      }

      return records || [];
    } catch (e: any) {
      console.warn(`❌ [Puppeteer] Fetch failed: ${e.message}`);
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }
}
