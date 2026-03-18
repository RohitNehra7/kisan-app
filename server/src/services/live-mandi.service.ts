import puppeteer from 'puppeteer';
import { MandiRecord } from '../types';

/**
 * LIVE MANDI SERVICE (Puppeteer Ingester)
 * Designed for Agmarknet 2.0 (React SPA)
 * This service launches a headless browser to wait for JS-rendered tables.
 */
export class LiveMandiService {
  /**
   * Fetch live price from the Agmarknet 2.0 Portal
   * Implements Multi-Day Fallback to ensure we catch the latest possible data.
   */
  static async fetchDirectFromPortal(state: string, district: string, market: string, commodity: string): Promise<MandiRecord | null> {
    let browser;
    try {
      console.log(`📡 [Puppeteer] Launching browser for ${market} | ${commodity}...`);
      
      browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Attempt search for today, then yesterday, then day before
      const daysToTry = 3;
      for (let i = 0; i < daysToTry; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        console.log(`   ∟ Trying date: ${dateStr}...`);

        const url = `https://agmarknet.gov.in/SearchCCommodityReport.aspx?Common=Off&SerType=L&State=${state}&Dist=${district}&Market=${market}&Comm=${commodity}&Date=${dateStr}`;

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const tableSelector = '#cphBody_GridSearch';
        try {
          await page.waitForSelector(tableSelector, { timeout: 5000 });
          
          const data = await page.evaluate(() => {
            const rows = document.querySelectorAll('#cphBody_GridSearch tr');
            if (rows.length < 2) return null;
            
            const firstDataRow = rows[1];
            if (!firstDataRow) return null;

            const cols = firstDataRow.querySelectorAll('td');
            if (cols.length < 10) return null;

            const getColText = (idx: number) => {
              const el = cols[idx];
              return el ? (el as HTMLElement).innerText.trim() : "";
            };

            return {
              state: getColText(0),
              district: getColText(1),
              market: getColText(2),
              commodity: getColText(3),
              variety: getColText(4),
              arrivals_in_qtl: parseFloat(getColText(5)) || 0,
              arrival_date: getColText(6),
              min_price: parseFloat(getColText(7)) || 0,
              max_price: parseFloat(getColText(8)) || 0,
              modal_price: parseFloat(getColText(9)) || 0
            };
          });

          if (data && data.modal_price > 0) {
            console.log(`   ✅ Success! Found data for ${dateStr}`);
            return data;
          }
        } catch (e) {
          continue; // Try previous day
        }
      }

      return null;
    } catch (e: any) {
      console.warn(`⚠️ [Puppeteer] Portal fetch failed: ${e.message}`);
      return null;
    } finally {
      if (browser) await browser.close();
    }
  }
}
