'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Create auth context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth?action=session');
        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError('Failed to check authentication status');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Sign up function
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup',
          email,
          password,
          fullName
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign up');
      }
      
      setUser(data.user);
      router.push('/dashboard');
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signin',
          email,
          password
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign in');
      }
      
      setUser(data.user);
      router.push('/dashboard');
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'google'
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign in with Google');
      }
      
      // Redirect to Google OAuth URL
      window.location.href = data.url;
      return { success: true };
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with GitHub
  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'github'
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign in with GitHub');
      }
      
      // Redirect to GitHub OAuth URL
      window.location.href = data.url;
      return { success: true };
    } catch (err) {
      console.error('GitHub sign in error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with demo account
  const signInWithDemo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'demo'
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign in with demo account');
      }
      
      setUser(data.user);
      router.push('/dashboard');
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Demo sign in error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signout'
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign out');
      }
      
      setUser(null);
      router.push('/login');
      return { success: true };
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // State for subscription information
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  // Fetch subscription information when user is logged in
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user || !user.id) return;
      
      try {
        setLoadingSubscription(true);
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get-subscription',
            userId: user.id
          }),
        });
        
        const data = await response.json();
        
        if (data.success && data.subscription) {
          setSubscription(data.subscription);
        } else {
          // If no subscription found, set to free plan
          setSubscription({
            id: null,
            status: 'inactive',
            planId: 'free',
            planName: 'Free Trial',
            limits: {
              videosPerMonth: 3,
              storageGB: 1,
              schedulingFrequency: ['weekly'],
              voiceOptions: 2,
              analyticsRetention: 7
            }
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };
    
    fetchSubscription();
  }, [user]);

  // Auth context value
  const value = {
    user,
    loading,
    error,
    subscription,
    loadingSubscription,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signInWithDemo,
    signOut
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
