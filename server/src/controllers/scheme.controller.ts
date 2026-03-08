import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export class SchemeController {
  static async getSchemes(req: Request, res: Response) {
    try {
      if (!supabase) throw new Error('DB not initialized');
      const { data, error } = await supabase
        .from('scheme_rules')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
