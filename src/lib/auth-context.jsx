'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState({
    planName: 'Free Trial',
    planId: 'free',
    limits: {
      videosPerMonth: 5,
      storageGB: 0.1, // 100 MB
      schedulingFrequency: ['weekly']
    },
    features: {
      scheduling: false,
      analytics: false
    },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  });

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setUser(null);
        } else if (data?.session) {
          setUser(data.session.user);
          // Fetch user subscription data
          await fetchUserSubscription(data.session.user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          // Fetch user subscription data
          await fetchUserSubscription(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          // Reset subscription to default
          setSubscription({
            plan: 'Free Trial',
            videoQuota: 5,
            storageQuota: 100,
            schedulingEnabled: false,
            analyticsEnabled: false,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Fetch user subscription data from the database
  const fetchUserSubscription = async (userId) => {
    try {
      // In a real app, this would fetch from your database or payment API
      // For now, we'll use the payment API to get subscription data
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-subscription',
          userId,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.subscription) {
        setSubscription(data.subscription);
      } else {
        // Fallback to default subscription if API call fails
        setSubscription({
          planName: 'Free Trial',
          planId: 'free',
          limits: {
            videosPerMonth: 5,
            storageGB: 0.1, // 100 MB
            schedulingFrequency: ['weekly']
          },
          features: {
            scheduling: false,
            analytics: false
          },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Fallback to Free Trial if there's an error
      setSubscription({
        planName: 'Free Trial',
        planId: 'free',
        limits: {
          videosPerMonth: 5,
          storageGB: 0.1, // 100 MB
          schedulingFrequency: ['weekly']
        },
        features: {
          scheduling: false,
          analytics: false
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    }
  };

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign in with OAuth provider
  const signInWithOAuth = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      setUser({ ...user, ...data.user });
      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  // Update subscription plan
  const updateSubscription = async (newPlan) => {
    try {
      // In a real app, this would update the subscription in your database
      // For now, we'll just update the local state
      let updatedSubscription = { ...subscription, planName: newPlan.planName, planId: newPlan.planId };
      
      // Set appropriate quotas and features based on plan
      if (newPlan.planId === 'pro') {
        updatedSubscription = {
          ...updatedSubscription,
          limits: {
            videosPerMonth: 50,
            storageGB: 1,
            schedulingFrequency: ['daily', 'every3days', 'weekly', 'biweekly', 'monthly']
          },
          features: {
            scheduling: true,
            analytics: true
          },
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        };
      } else if (newPlan.planId === 'business') {
        updatedSubscription = {
          ...updatedSubscription,
          limits: {
            videosPerMonth: 100,
            storageGB: 5,
            schedulingFrequency: ['daily', 'every3days', 'weekly', 'biweekly', 'monthly']
          },
          features: {
            scheduling: true,
            analytics: true
          },
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        };
      } else if (newPlan.planId === 'basic') {
        updatedSubscription = {
          ...updatedSubscription,
          limits: {
            videosPerMonth: 20,
            storageGB: 0.5,
            schedulingFrequency: ['weekly', 'biweekly', 'monthly']
          },
          features: {
            scheduling: true,
            analytics: false
          },
          expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        };
      }
      
      setSubscription(updatedSubscription);
      return { data: updatedSubscription, error: null };
    } catch (error) {
      console.error('Update subscription error:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    subscription,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    updateProfile,
    updateSubscription,
    supabase
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
