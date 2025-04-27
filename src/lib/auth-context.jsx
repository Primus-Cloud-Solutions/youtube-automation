'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState({
    planName: 'Free',
    planId: 'free',
    limits: {
      videosPerMonth: 5,
      storageGB: 1,
      schedulingFrequency: 'weekly'
    },
    features: {
      scheduling: false,
      analytics: false,
      viralVideoRebranding: false
    },
    expiresAt: null
  });

  // Initialize auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
          fetchUserSubscription(data.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fetch user subscription data
  const fetchUserSubscription = async (userId) => {
    try {
      const response = await fetch(`/api/payment?userId=${userId}`);
      const data = await response.json();
      
      if (data.success && data.subscription) {
        // Update subscription with proper structure
        const subData = data.subscription;
        
        // Create structured subscription object
        const structuredSubscription = {
          planName: subData.planName || 'Free',
          planId: subData.planId || 'free',
          limits: {
            videosPerMonth: subData.limits?.videosPerMonth || 5,
            storageGB: subData.limits?.storageGB || 1,
            schedulingFrequency: subData.limits?.schedulingFrequency || 'weekly'
          },
          features: {
            scheduling: subData.features?.scheduling || false,
            analytics: subData.features?.analytics || false,
            viralVideoRebranding: subData.planName === 'Enterprise' || false
          },
          expiresAt: subData.expiresAt || null
        };
        
        setSubscription(structuredSubscription);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setLoading(false);
    }
  };

  // Update subscription plan
  const updateSubscription = (newSubscription) => {
    // Ensure the subscription has the correct structure
    const updatedSubscription = {
      planName: newSubscription.planName || subscription.planName,
      planId: newSubscription.planId || subscription.planId,
      limits: {
        videosPerMonth: newSubscription.limits?.videosPerMonth || subscription.limits.videosPerMonth,
        storageGB: newSubscription.limits?.storageGB || subscription.limits.storageGB,
        schedulingFrequency: newSubscription.limits?.schedulingFrequency || subscription.limits.schedulingFrequency
      },
      features: {
        scheduling: newSubscription.features?.scheduling !== undefined ? newSubscription.features.scheduling : subscription.features.scheduling,
        analytics: newSubscription.features?.analytics !== undefined ? newSubscription.features.analytics : subscription.features.analytics,
        viralVideoRebranding: newSubscription.planName === 'Enterprise' || false
      },
      expiresAt: newSubscription.expiresAt || subscription.expiresAt
    };
    
    setSubscription(updatedSubscription);
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        fetchUserSubscription(data.user.id);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        fetchUserSubscription(data.user.id);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setSubscription({
        planName: 'Free',
        planId: 'free',
        limits: {
          videosPerMonth: 5,
          storageGB: 1,
          schedulingFrequency: 'weekly'
        },
        features: {
          scheduling: false,
          analytics: false,
          viralVideoRebranding: false
        },
        expiresAt: null
      });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  };

  const value = {
    user,
    loading,
    subscription,
    login,
    register,
    logout,
    updateSubscription
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
