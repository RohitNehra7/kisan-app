import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export class StorageController {
  /**
   * Get storage locations for a specific district and commodity
   */
  static async getNearbyStorage(req: Request, res: Response) {
    try {
      if (!supabase) throw new Error('DB not initialized');
      const { district, commodity } = req.query;

      if (!district) {
        return res.status(400).json({ error: 'District is required' });
      }

      const { data, error } = await supabase
        .from('storage_locations')
        .select('*')
        .eq('district', district as string)
        .contains('commodities_accepted', [commodity as string])
        .order('cost_per_qtl_month', { ascending: true })
        .limit(3);

      if (error) throw error;
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
