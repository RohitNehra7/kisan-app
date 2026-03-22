import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export class ProfileController {
  /**
   * Upsert profile based on Auth ID (SSE3 Identity Pattern)
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      if (!supabase) throw new Error('DB not initialized');
      const { auth_id, ...profile } = req.body;

      if (!auth_id) {
        return res.status(400).json({ error: 'Identity (auth_id) is required' });
      }
      
      const { data, error } = await supabase
        .from('farmer_profiles')
        .upsert({
          auth_id,
          ...profile,
          updated_at: new Date()
        }, { onConflict: 'auth_id' })
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  /**
   * Get profile by Auth ID
   */
  static async getProfile(req: Request, res: Response) {
    try {
      if (!supabase) throw new Error('DB not initialized');
      const { auth_id } = req.params;
      
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('auth_id', auth_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; 
      res.json({ success: true, data: data || null });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
