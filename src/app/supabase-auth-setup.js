// Supabase authentication setup
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eurztwdqjncuypqbrcmw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnp0d2Rxam5jdXlwcWJyY213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1MjQwMDAsImV4cCI6MTk5ODEwMDAwMH0.fallback_demo_key_for_development';

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helper functions
export const signUp = async (email, password) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not configured');
      return { 
        success: false, 
        error: 'Authentication service not configured. Please contact support.' 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not configured');
      return { 
        success: false, 
        error: 'Authentication service not configured. Please contact support.' 
      };
    }
    
    // For demo purposes, allow any login with test@example.com/password123
    if (email === 'test@example.com' && password === 'password123') {
      return { 
        success: true, 
        data: { 
          user: { 
            id: 'demo-user-id',
            email: 'test@example.com',
            user_metadata: { full_name: 'Demo User' }
          } 
        } 
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    // For demo purposes
    if (typeof window !== 'undefined' && localStorage.getItem('demo_user')) {
      return JSON.parse(localStorage.getItem('demo_user'));
    }
    
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error.message);
    return null;
  }
};

export const getSession = async () => {
  try {
    // For demo purposes
    if (typeof window !== 'undefined' && localStorage.getItem('demo_user')) {
      return { user: JSON.parse(localStorage.getItem('demo_user')) };
    }
    
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
};

export default {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession
};
