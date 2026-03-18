import { Request, Response } from 'express';
import { MandiService } from '../services/mandi.service';
import { EnamService } from '../services/enam.service';
import { LiveMandiService } from '../services/live-mandi.service';
import { supabase } from '../config/supabase';
import { MandiRecord, ArbitrageResult } from '../types';

export class MandiController {
  static async getPrices(req: Request, res: Response) {
    try {
      const { state, commodity, market } = req.query;
      if (!state) return res.status(400).json({ error: 'State is required' });

      // 1. Check for Live eNAM Auction (Phase 2 Premium)
      if (market && market !== 'all' && commodity && commodity !== 'all') {
        const liveDeal = await EnamService.fetchLiveAuction(market as string, commodity as string);
        if (liveDeal) {
          return res.json({ success: true, count: 1, data: [liveDeal], source: 'eNAM' });
        }
      }

      // 2. HYPER-FRESH FALLBACK: If specific mandi selected, try direct portal fetch
      // This bypasses the 12-hour OGD API lag
      if (market && market !== 'all' && commodity && commodity !== 'all') {
        const directRecord = await LiveMandiService.fetchDirectFromPortal(
          state as string,
          '', // District auto-detected by portal
          market as string,
          commodity as string
        );
        
        if (directRecord) {
          return res.json({ success: true, count: 1, data: [directRecord], source: 'DirectPortal' });
        }
      }

      // 3. Warehouse Recovery (Standard)
      MandiService.checkSyncHealthAndRecover();

      let data = await MandiService.getPricesFromDB(
        state as string, 
        commodity as string, 
        market as string
      );

      // Self-Healing Fallback: If DB is empty/unreachable, fetch live
      if (!data || data.length === 0) {
        console.warn(`⚠️ [Self-Healing] DB empty for ${state}. Fetching live...`);
        data = await MandiService.fetchAndSyncPrices(
          state as string, 
          commodity as string, 
          market as string,
          1000
        );
      }

      res.json({ success: true, count: data.length, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getStates(req: Request, res: Response) {
    try {
      const data = await MandiService.getStates();
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getMarkets(req: Request, res: Response) {
    try {
      const { state } = req.query;
      if (!state) return res.status(400).json({ error: 'State is required' });
      const data = await MandiService.getMarkets(state as string);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getCommodities(req: Request, res: Response) {
    try {
      const { state, market } = req.query;
      if (!state) return res.status(400).json({ error: 'State is required' });
      const data = await MandiService.getCommodities(state as string, market as string);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const { market, commodity } = req.query;
      if (!market || !commodity) return res.status(400).json({ error: 'Market and Commodity are required' });
      const data = await MandiService.getHistory(market as string, commodity as string);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getMSP(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('msp_values')
        .select('commodity, msp_per_quintal, season, year')
        .order('year', { ascending: false });

      if (error) throw error;

      const latest: Record<string, any> = {};
      for (const row of data) {
        if (!latest[row.commodity]) latest[row.commodity] = row;
      }

      res.json({ success: true, msp: Object.values(latest) });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getArbitrage(req: Request, res: Response) {
    try {
      const { crop, quantity, district, transport_rate } = req.query;
      if (!crop || !district) return res.status(400).json({ error: 'Crop and District are required' });

      const data = await MandiService.calculateArbitrage(
        crop as string, 
        Number(quantity) || 50, 
        district as string, 
        Number(transport_rate) || 2.5
      );
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getNavigatorDeals(req: Request, res: Response) {
    try {
      const { district, crop } = req.query;
      if (!district || !crop) return res.status(400).json({ error: 'District and Crop are required' });

      const data = await MandiService.getNearlyBestDeals(district as string, crop as string);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  }

