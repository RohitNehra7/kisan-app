import axios from 'axios';
import { MandiRecord } from '../types';

export class EnamService {
  /**
   * Fetch Live Auction data from eNAM SFAC API
   * Currently implements the handshake pattern and fallback logic.
   */
  static async fetchLiveAuction(mandiName: string, commodity: string): Promise<MandiRecord | null> {
    const ENAM_API_URL = 'https://enam.gov.in/API/v1/getLiveAuction'; // Example URL
    const apiKey = process.env.ENAM_API_KEY;

    if (!apiKey) {
      // Logic for developers: If no key, eNAM is 'inactive'
      return null;
    }

    try {
      const response = await axios.get(ENAM_API_URL, {
        params: { 
          'api_key': apiKey,
          'mandi': mandiName,
          'crop': commodity
        },
        timeout: 5000
      });

      if (response.data && response.data.success) {
        const r = response.data.data;
        return {
          state: r.state,
          district: r.district,
          market: r.mandi + " (eNAM)",
          commodity: r.commodity,
          variety: r.variety,
          arrival_date: new Date().toLocaleDateString('en-GB'),
          min_price: r.min_price,
          max_price: r.max_price,
          modal_price: r.modal_price,
          arrivals_in_qtl: r.arrivals
        };
      }
      return null;
    } catch (e) {
      console.warn(`[eNAM] Live fetch failed for ${mandiName}, falling back to Warehouse.`);
      return null;
    }
  }
}
