'use client';

import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaHl6Y29tcGFueSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjgyNDQyMzQyLCJleHAiOjE5OTgwMTgzNDJ9.mocked';
  
  return createClient(supabaseUrl, supabaseAnonKey);
};
