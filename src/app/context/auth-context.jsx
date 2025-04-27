'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Create auth context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
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
          // Fetch subscription data after user is authenticated
          fetchSubscription(data.user.id);
        } else {
          setUser(null);
          setSubscription(null);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError('Failed to check authentication status');
        setUser(null);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Fetch subscription data
  const fetchSubscription = async (userId) => {
    if (!userId) return;
    
    try {
      setSubscriptionLoading(true);
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-subscription',
          userId
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.subscription) {
        setSubscription(data.subscription);
      } else {
        // If no subscription is found, set to free trial by default
        setSubscription({
          id: 'free_trial',
          status: 'active',
          planId: 'free',
          planName: 'Free Trial',
          limits: {
            videosPerMonth: 3,
            storageGB: 1,
            schedulingFrequency: ['weekly'],
            voiceOptions: 2,
            analyticsRetention: 7,
            trialDays: 7
          }
        });
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
      // Set default free trial on error
      setSubscription({
        id: 'free_trial',
        status: 'active',
        planId: 'free',
        planName: 'Free Trial',
        limits: {
          videosPerMonth: 3,
          storageGB: 1,
          schedulingFrequency: ['weekly'],
          voiceOptions: 2,
          analyticsRetention: 7,
          trialDays: 7
        }
      });
    } finally {
      setSubscriptionLoading(false);
    }
  };
  
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
      
      // Start free trial for new users
      if (data.user && data.user.id) {
        await startFreeTrial(data.user.id, email);
      }
      
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
  
  // Start free trial
  const startFreeTrial = async (userId, email) => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start-trial',
          userId,
          email,
          trialDays: 7
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.plan) {
        setSubscription({
          id: 'free_trial',
          status: 'trialing',
          planId: 'free',
          planName: 'Free Trial',
          trialEndDate: data.trialEndDate,
          limits: data.plan.limits
        });
        return { success: true };
      } else {
        throw new Error(data.error || 'Failed to start free trial');
      }
    } catch (err) {
      console.error('Free trial error:', err);
      return { success: false, error: err.message };
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
      
      // Fetch subscription after login
      if (data.user && data.user.id) {
        fetchSubscription(data.user.id);
      }
      
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
      setSubscription(null);
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
  
  // Update subscription (after payment or plan change)
  const updateSubscription = async () => {
    if (!user || !user.id) return { success: false, error: 'User not authenticated' };
    
    try {
      await fetchSubscription(user.id);
      return { success: true };
    } catch (err) {
      console.error('Update subscription error:', err);
      return { success: false, error: err.message };
    }
  };
  
  // Change subscription plan
  const changePlan = async (planId) => {
    if (!user || !user.id) return { success: false, error: 'User not authenticated' };
    
    try {
      setSubscriptionLoading(true);
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'change-plan',
          userId: user.id,
          planId
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to change plan');
      }
      
      setSubscription(data.subscription);
      return { success: true, subscription: data.subscription };
    } catch (err) {
      console.error('Change plan error:', err);
      return { success: false, error: err.message };
    } finally {
      setSubscriptionLoading(false);
    }
  };
  
  // Auth context value
  const value = {
    user,
    loading,
    error,
    subscription,
    subscriptionLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateSubscription,
    changePlan
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
