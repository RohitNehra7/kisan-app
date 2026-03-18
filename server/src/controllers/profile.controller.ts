import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export class ProfileController {
  static async updateProfile(req: Request, res: Response) {
    try {
      if (!supabase) throw new Error('DB not initialized');
      const profile = req.body;
      
      // Upsert based on phone (primary key for farmers)
      const { data, error } = await supabase
        .from('farmer_profiles')
        .upsert({
          ...profile,
          updated_at: new Date()
        }, { onConflict: 'phone' })
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      if (!supabase) throw new Error('DB not initialized');
      const { phone } = req.params;
      
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore 'not found'
      res.json({ success: true, data: data || null });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
