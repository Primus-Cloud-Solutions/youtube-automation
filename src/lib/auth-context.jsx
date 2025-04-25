'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create auth context with default values
const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  signIn: async (email, password) => ({ success: false }),
  signUp: async (email, password) => ({ success: false }),
  signOut: async () => ({ success: false }),
});

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, allow a test login
      if (email === 'test@example.com' && password === 'password123') {
        // Simulate successful login
        return { success: true, user: { email, id: 'test-user-id' } };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error signing in:', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email, password) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error signing up:', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Instead of throwing an error, return the default context during SSR
    console.warn('useAuth must be used within an AuthProvider, returning default context');
    return AuthContext._currentValue;
  }
  return context;
};
