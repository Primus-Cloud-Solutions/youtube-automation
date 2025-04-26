'use client';

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables or fallback values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eurztwdqjncuypqbrcmw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnp0d2Rxam5jdXlwcWJyY213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1MzQ0MDAsImV4cCI6MTk5ODExMDQwMH0.fallback_demo_key_for_development';

// Create a singleton instance of the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export { supabase };
