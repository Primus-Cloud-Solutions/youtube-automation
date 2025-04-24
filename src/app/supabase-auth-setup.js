'use client';

import { createClient } from '@supabase/supabase-js';

// Create a Supabase client
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Get the Supabase client
export const getSupabaseClient = () => {
  return createSupabaseClient();
};

// Handle user authentication
export const handleAuth = async (supabase) => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Get the current user
export const getCurrentUser = async (supabase) => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Sign in with email and password
export const signInWithEmail = async (supabase, email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

// Sign up with email and password
export const signUpWithEmail = async (supabase, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

// Sign in with Google OAuth
export const signInWithGoogle = async (supabase) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  return { data, error };
};

// Sign out
export const signOut = async (supabase) => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Reset password
export const resetPassword = async (supabase, email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  return { data, error };
};

// Update user profile
export const updateUserProfile = async (supabase, userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId);
  
  return { data, error };
};

// Get user profile
export const getUserProfile = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};
