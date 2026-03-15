import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export class NotificationController {
  static async registerToken(req: Request, res: Response) {
    try {
      if (!supabase) throw new Error('DB not initialized');
      const { fcm_token, session_id, district, crop, is_arhtiya } = req.body;

      if (!fcm_token || !session_id) {
        return res.status(400).json({ error: 'FCM Token and Session ID are required' });
      }

      const { data, error } = await supabase
        .from('notification_tokens')
        .upsert({
          fcm_token,
          session_id,
          district,
          crop,
          is_arhtiya: !!is_arhtiya,
          updated_at: new Date()
        }, { onConflict: 'session_id' })
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async sendPriceAlert(session_id: string, title: string, body: string) {
    // FCM implementation placeholder - requires server key from console
    console.log(`[Push Notification] To ${session_id}: ${title} - ${body}`);
  }
}
