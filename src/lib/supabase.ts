import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase client — works when configured, gracefully no-ops when not
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Check if Supabase is actually configured
export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseAnonKey && !supabaseUrl.includes('placeholder');
