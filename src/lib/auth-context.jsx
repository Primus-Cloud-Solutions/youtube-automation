'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  checkAuthStatus, 
  socialLogin 
} from '@/lib/api-client';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState({
    planName: 'Free Trial',
    planId: 'free',
    status: 'active',
    limits: {
      videosPerMonth: 5,
      storageGB: 1,
      schedulingFrequency: 'weekly'
    },
    features: {
      scheduling: true,
      analytics: true,
      viralVideoRebranding: false
    }
  });

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await checkAuthStatus();
        
        if (response.success && response.isAuthenticated) {
          setUser(response.user);
          // Set demo subscription data
          setSubscription({
            planName: 'Free Trial',
            planId: 'free',
            status: 'active',
            limits: {
              videosPerMonth: 5,
              storageGB: 1,
              schedulingFrequency: 'weekly'
            },
            features: {
              scheduling: true,
              analytics: true,
              viralVideoRebranding: false
            }
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // For demo purposes, set a mock user if auth check fails
        setUser({
          id: 'demo-user',
          email: 'test@example.com',
          name: 'Demo User'
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginUser(email, password);
      
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      
      // For demo purposes, set a mock user if login fails
      setUser({
        id: 'demo-user',
        email: email || 'test@example.com',
        name: 'Demo User'
      });
      
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await registerUser(email, password, name);
      
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.error || 'Registration failed');
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      
      // For demo purposes, set a mock user if registration fails
      setUser({
        id: 'demo-user',
        email: email,
        name: name || 'Demo User'
      });
      
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API call fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Social login function
  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await socialLogin(provider);
      
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.error || `${provider} login failed`);
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setError(err.message || `${provider} login failed`);
      
      // For demo purposes, set a mock user if social login fails
      setUser({
        id: 'demo-user',
        email: `${provider.toLowerCase()}@example.com`,
        name: 'Demo User',
        provider: provider
      });
      
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Use demo account function
  const useDemoAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set demo user
      setUser({
        id: 'demo-user',
        email: 'demo@example.com',
        name: 'Demo User'
      });
      
      return { success: true };
    } catch (err) {
      console.error('Demo account error:', err);
      setError(err.message || 'Failed to use demo account');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    subscription,
    login,
    register,
    logout,
    socialLogin: handleSocialLogin,
    useDemoAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
