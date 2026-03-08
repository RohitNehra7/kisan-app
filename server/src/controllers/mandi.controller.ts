import { Request, Response } from 'express';
import { MandiService } from '../services/mandi.service';
import { supabase } from '../config/supabase';
import { MandiRecord, ArbitrageResult } from '../types';

export class MandiController {
  static async getPrices(req: Request, res: Response) {
    try {
      const { state, commodity, market } = req.query;
      if (!state) return res.status(400).json({ error: 'State is required' });

      const data = await MandiService.getPricesFromDB(
        state as string, 
        commodity as string, 
        market as string
      );
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

  static async calculateArbitrage(req: Request, res: Response) {
    try {
      const { crop, quantity, district, transport_rate } = req.body;
      if (!crop || !district) return res.status(400).json({ error: 'Crop and District are required' });
      
      const data = await MandiService.calculateArbitrage(
        crop, 
        quantity || 50, 
        district, 
        transport_rate || 2.5
      );
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}

