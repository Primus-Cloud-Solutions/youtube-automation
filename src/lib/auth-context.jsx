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
  updateUserProfile: async (userData) => ({ success: false }),
  error: null,
});

// Mock user database for demo purposes - using an array that persists during the session
// In a real app, this would be stored in a database
const MOCK_USERS = [
  {
    id: 'test-user-id-1',
    email: 'test@example.com',
    password: 'Password123!',
    fullName: 'Test User',
    role: 'user',
    createdAt: '2025-01-01T00:00:00.000Z',
    preferences: {
      contentNiche: 'Technology',
      uploadFrequency: 'weekly',
      notificationsEnabled: true
    }
  }
];

// Try to load any previously registered users from localStorage
if (typeof window !== 'undefined') {
  try {
    const storedUsers = localStorage.getItem('tubeautomator_users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      // Only use stored users if they're in the expected format
      if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
        // Merge with default users, avoiding duplicates by email
        const existingEmails = new Set(MOCK_USERS.map(u => u.email));
        parsedUsers.forEach(user => {
          if (!existingEmails.has(user.email)) {
            MOCK_USERS.push(user);
            existingEmails.add(user.email);
          }
        });
        console.log('Loaded registered users from localStorage');
      }
    }
  } catch (e) {
    console.error('Error loading stored users:', e);
  }
}

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save MOCK_USERS to localStorage whenever it changes
  const saveUsersToStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tubeautomator_users', JSON.stringify(MOCK_USERS));
        console.log('Saved users to localStorage');
      } catch (e) {
        console.error('Error saving users to localStorage:', e);
      }
    }
  };

  useEffect(() => {
    // Check for stored session in localStorage
    const checkSession = () => {
      if (typeof window !== 'undefined') {
        try {
          const storedSession = localStorage.getItem('tubeautomator_session');
          if (storedSession) {
            const parsedSession = JSON.parse(storedSession);
            
            // Check if session is expired
            if (parsedSession.expires_at && parsedSession.expires_at > Date.now()) {
              setSession(parsedSession);
              setUser(parsedSession.user);
              console.log('Valid session restored from localStorage:', parsedSession);
            } else {
              console.log('Stored session expired, removing');
              localStorage.removeItem('tubeautomator_session');
            }
          }
        } catch (e) {
          console.error('Error parsing stored session:', e);
          localStorage.removeItem('tubeautomator_session');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    // Run immediately and set up interval to check session periodically
    checkSession();
    
    // Clean up interval on unmount
    return () => {
      // No interval to clean up in this implementation
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to sign in with:', email, password);
      
      // For demo purposes, use mock authentication
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        console.log('Mock user found:', mockUser);
        
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
              preferences: mockUser.preferences || {}
            }
          }
        };
        
        // Store session in localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('tubeautomator_session', JSON.stringify(mockSession));
            console.log('Session stored in localStorage');
          } catch (e) {
            console.error('Error storing session in localStorage:', e);
          }
        }
        
        // Update state
        setUser(mockSession.user);
        setSession(mockSession);
        
        return { success: true, user: mockSession.user };
      } else {
        console.log('No matching mock user found');
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
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
      
      console.log('Attempting to sign up with:', email, password, fullName);
      
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
      
      // Check if email already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // For demo purposes, create a mock user
      const newMockUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        fullName,
        role: 'user',
        createdAt: new Date().toISOString(),
        preferences: {
          contentNiche: 'General',
          uploadFrequency: 'weekly',
          notificationsEnabled: true
        }
      };
      
      // Add to mock database
      MOCK_USERS.push(newMockUser);
      console.log('New user added to mock database:', newMockUser);
      
      // Save updated users to localStorage
      saveUsersToStorage();
      
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
            preferences: newMockUser.preferences
          }
        }
      };
      
      // Store session in localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tubeautomator_session', JSON.stringify(mockSession));
          console.log('Session stored in localStorage');
        } catch (e) {
          console.error('Error storing session in localStorage:', e);
        }
      }
      
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

  // Update user profile function
  const updateUserProfile = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      console.log('Updating user profile:', userData);
      
      // Find the user in the mock database
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found in database');
      }
      
      // Update the user in the mock database
      const updatedUser = {
        ...MOCK_USERS[userIndex],
        ...userData,
      };
      
      MOCK_USERS[userIndex] = updatedUser;
      console.log('User updated in mock database:', updatedUser);
      
      // Save updated users to localStorage
      saveUsersToStorage();
      
      // Update the session with the new user data
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          user_metadata: {
            ...session.user.user_metadata,
            ...userData,
          }
        }
      };
      
      // Store updated session in localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tubeautomator_session', JSON.stringify(updatedSession));
          console.log('Updated session stored in localStorage');
        } catch (e) {
          console.error('Error storing updated session in localStorage:', e);
        }
      }
      
      // Update state
      setUser(updatedSession.user);
      setSession(updatedSession);
      
      return { success: true, user: updatedSession.user };
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
      
      // Remove session from localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('tubeautomator_session');
          console.log('Session removed from localStorage');
        } catch (e) {
          console.error('Error removing session from localStorage:', e);
        }
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
