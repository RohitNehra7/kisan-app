import { Request, Response } from 'express';
import { MandiService } from '../services/mandi.service';

export class MandiController {
  static async getPrices(req: Request, res: Response) {
    try {
      const { state, commodity, market, limit } = req.query;
      const data = await MandiService.fetchAndSyncPrices(
        state as string, 
        commodity as string, 
        market as string,
        limit ? parseInt(limit as string) : 1000
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
      if (!state || !market) return res.status(400).json({ error: 'State and Market are required' });
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
}
