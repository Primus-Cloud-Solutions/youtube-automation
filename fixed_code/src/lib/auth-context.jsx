'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
// These will be properly set in the deployed environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaHl6Y29tcGFueSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjgyNDQyMzQyLCJleHAiOjE5OTgwMTgzNDJ9.mocked';

// Get the current site URL for redirects
const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser context, use the current origin
    return window.location.origin;
  }
  // In server context, use environment variable or fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://youtube-platform.netlify.app';
};

// Create a Supabase client for authentication with redirect URLs
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    redirectTo: `${getSiteUrl()}/auth/callback`
  }
});

// Create auth context with default values
const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  signIn: async (email, password) => ({ success: false }),
  signUp: async (email, password, fullName) => ({ success: false }),
  signOut: async () => ({ success: false }),
  updateUserProfile: async (userData) => ({ success: false }),
  error: null,
});

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          throw error;
        }
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Session check error:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Clean up subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to sign in with:', email);
      
      // Use Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('Sign in successful:', data);
      setSession(data.session);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError(error.message || 'Failed to sign in');
      return { success: false, error: error.message || 'Invalid email or password' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email, password, fullName) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to sign up with:', email, fullName);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Check for at least one number and one special character
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasNumber || !hasSpecial) {
        throw new Error('Password must contain at least one number and one special character');
      }
      
      // Get the current site URL for redirects
      const redirectTo = `${getSiteUrl()}/auth/callback`;
      
      // Use Supabase auth to create user with redirect URL
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            preferences: {
              contentNiche: 'General',
              uploadFrequency: 'weekly',
              notificationsEnabled: true
            }
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('Sign up successful:', data);
      
      // If email confirmation is required
      if (data.user && !data.session) {
        return { 
          success: true, 
          user: data.user,
          message: 'Please check your email for a confirmation link'
        };
      }
      
      // If auto-confirmed
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message || 'Failed to create account');
      return { success: false, error: error.message || 'Failed to create account' };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      console.log('Updating user profile:', userData);
      
      // Update user metadata in Supabase
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) {
        console.error('Update profile error:', error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('Profile updated successfully:', data);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      setError(error.message || 'Failed to update profile');
      return { success: false, error: error.message || 'Failed to update profile' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Signing out user');
      
      // Use Supabase auth to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Reset state
      setUser(null);
      setSession(null);
      
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error.message);
      setError(error.message || 'Failed to sign out');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Instead of throwing an error, return the default context during SSR
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider, returning default context');
    return {
      user: null,
      session: null,
      isLoading: false,
      error: null,
      signIn: async () => ({ success: false }),
      signUp: async () => ({ success: false }),
      signOut: async () => ({ success: false }),
      updateUserProfile: async () => ({ success: false }),
    };
  }
  
  return context;
};
