import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl: string = process.env.SUPABASE_URL || '';
const supabaseKey: string = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL ERROR: Supabase credentials missing (SUPABASE_URL/SUPABASE_KEY).');
  console.error('Please ensure these environment variables are set in your deployment dashboard.');
}

// Initialize only if URL is present to prevent internal library crash
export const supabase: SupabaseClient = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : (null as unknown as SupabaseClient); 

