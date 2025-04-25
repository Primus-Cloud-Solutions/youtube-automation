'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with mock values for development/demo
// In production, these would be real environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaHl6Y29tcGFueSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjgyNDQyMzQyLCJleHAiOjE5OTgwMTgzNDJ9.mocked';

// Create a Supabase client for authentication
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create auth context with default values
const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  signIn: async (email, password) => ({ success: false }),
  signUp: async (email, password, fullName) => ({ success: false }),
  signOut: async () => ({ success: false }),
  error: null,
});

// Mock user database for demo purposes
const MOCK_USERS = [
  {
    id: 'test-user-id-1',
    email: 'test@example.com',
    password: 'Password123!',
    fullName: 'Test User',
    role: 'user',
    createdAt: '2025-01-01T00:00:00.000Z',
  }
];

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for stored session in localStorage
    const storedSession = localStorage.getItem('tubeautomator_session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch (e) {
        console.error('Error parsing stored session:', e);
        localStorage.removeItem('tubeautomator_session');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For demo purposes, use mock authentication
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        // Create a mock session
        const mockSession = {
          access_token: 'mock-jwt-token',
          refresh_token: 'mock-refresh-token',
          expires_at: Date.now() + 3600 * 1000, // 1 hour from now
          user: {
            id: mockUser.id,
            email: mockUser.email,
            user_metadata: {
              full_name: mockUser.fullName,
            }
          }
        };
        
        // Store session in localStorage
        localStorage.setItem('tubeautomator_session', JSON.stringify(mockSession));
        
        // Update state
        setUser(mockSession.user);
        setSession(mockSession);
        
        return { success: true, user: mockSession.user };
      }
      
      // If no mock user matches, try Supabase (will likely fail in demo)
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
      
      // For demo purposes, create a mock user
      const newMockUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        fullName,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      // Add to mock database
      MOCK_USERS.push(newMockUser);
      
      // Create a mock session
      const mockSession = {
        access_token: 'mock-jwt-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600 * 1000, // 1 hour from now
        user: {
          id: newMockUser.id,
          email: newMockUser.email,
          user_metadata: {
            full_name: newMockUser.fullName,
          }
        }
      };
      
      // Store session in localStorage
      localStorage.setItem('tubeautomator_session', JSON.stringify(mockSession));
      
      // Update state
      setUser(mockSession.user);
      setSession(mockSession);
      
      return { success: true, user: mockSession.user };
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message || 'Failed to create account');
      return { success: false, error: error.message || 'Failed to create account' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Remove session from localStorage
      localStorage.removeItem('tubeautomator_session');
      
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Instead of throwing an error, return the default context during SSR
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider, returning default context');
    return AuthContext._currentValue || {
      user: null,
      session: null,
      isLoading: false,
      error: null,
      signIn: async () => ({ success: false }),
      signUp: async () => ({ success: false }),
      signOut: async () => ({ success: false }),
    };
  }
  
  return context;
};
