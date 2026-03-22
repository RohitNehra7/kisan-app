import { createClient } from '@supabase/supabase-js';

const getApiBase = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return '';
};

export const API_BASE = getApiBase();

// Initialize Supabase Client (Defensive Pattern)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create a dummy client if keys are missing to prevent runtime crash
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : ({ auth: { getUser: () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) } } as any);

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
};
