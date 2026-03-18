import axios from 'axios';
import * as cheerio from 'cheerio';
import { MandiRecord } from '../types';

/**
 * LIVE MANDI SERVICE (Direct Portal Ingester)
 * Bypasses the delayed OGD API by scraping the official Agmarknet portal directly.
 * This is the 'Secret Sauce' that ensures KisanNiti is always faster than competitors.
 */
export class LiveMandiService {
  /**
   * Fetch live price from the Agmarknet Search Portal
   */
  static async fetchDirectFromPortal(state: string, district: string, market: string, commodity: string): Promise<MandiRecord | null> {
    try {
      console.log(`📡 [LiveSource] Fetching direct from Agmarknet for ${market}...`);
      
      // Agmarknet Search URL (This is the official portal used by Mandi Secretaries)
      const url = `https://agmarknet.gov.in/SearchCCommodityReport.aspx?Common=Off&SerType=L&State=${state}&Dist=${district}&Market=${market}&Comm=${commodity}&Date=${new Date().toLocaleDateString('en-GB')}`;

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Target the first data row in the Agmarknet result table
      // Standard Agmarknet selector: #cphBody_GridSearch
      const tableRow = $('#cphBody_GridSearch tr').eq(1); 
      
      if (!tableRow || tableRow.find('td').length < 5) {
        return null; // No data found for today yet
      }

      const cols = tableRow.find('td');

      return {
        state: $(cols[0]).text().trim(),
        district: $(cols[1]).text().trim(),
        market: $(cols[2]).text().trim(),
        commodity: $(cols[3]).text().trim(),
        variety: $(cols[4]).text().trim(),
        arrival_date: $(cols[6]).text().trim(),
        min_price: parseFloat($(cols[7]).text().trim()) || 0,
        max_price: parseFloat($(cols[8]).text().trim()) || 0,
        modal_price: parseFloat($(cols[9]).text().trim()) || 0,
        arrivals_in_qtl: parseFloat($(cols[5]).text().trim()) || 0
      };
    } catch (e: any) {
      console.warn(`⚠️ [LiveSource] Portal fetch failed: ${e.message}`);
      return null;
    }
  }
}
