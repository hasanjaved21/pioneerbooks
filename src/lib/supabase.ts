import { createClient, SupabaseClient } from '@supabase/supabase-js';

const NEW_PROJECT_URL = 'https://shwhosddafpwsmplctng.supabase.co';
const NEW_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod2hvc2RkYWZwd3NtcGxjdG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MDE5MjAsImV4cCI6MjEwNzI3NzkyMH0.yosWlrozLdpx0EqwiC-yvpTCTIbW9E2-6Y2seEa4PR4';

const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// If environment variable is missing or still points to the old inactive project, automatically use the new project
const isOldInactiveProject = typeof envUrl === 'string' && envUrl.includes('mrwjjdywjwvzrdkgwbtm');

const supabaseUrl = !envUrl || isOldInactiveProject ? NEW_PROJECT_URL : envUrl;
const supabaseAnonKey = !envKey || isOldInactiveProject ? NEW_ANON_KEY : envKey;

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

// Proxy to provide a helpful error message if Supabase is used before configuration
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!supabaseInstance) {
      throw new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
      );
    }
    return (supabaseInstance as any)[prop];
  },
});

export const isSupabaseConfigured = !!supabaseInstance;
