'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key from environment variables with fallback for build time
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51O4TvqLkdIwU5PVRJOBEeVlmASdLFDKkXBJRYbGzsSXUkRKI3VGdJUQhvIJVs8mOky7QECnPXdtpKrcUZlTHyJKX00vWrWnDDN';
let stripePromise;

// Create payment context with default values
const PaymentContext = createContext({
  loading: false,
  error: null,
  createCheckoutSession: async (planId, userId, email, successUrl, cancelUrl) => ({ success: false, error: 'PaymentProvider not initialized' }),
  getSubscription: async (userId) => ({ success: false, error: 'PaymentProvider not initialized', subscription: null }),
  cancelSubscription: async (userId) => ({ success: false, error: 'PaymentProvider not initialized' }),
});

// Payment provider component
export function PaymentProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Stripe on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      stripePromise = loadStripe(stripePublishableKey);
      setIsInitialized(true);
    }
  }, []);

  // Function to create a checkout session and redirect to Stripe
  const createCheckoutSession = async (planId, userId, email, successUrl, cancelUrl) => {
    try {
      if (!isInitialized && typeof window !== 'undefined') {
        stripePromise = loadStripe(stripePublishableKey);
        setIsInitialized(true);
      }
      
      setLoading(true);
      setError(null);

      // Use provided URLs or generate defaults
      const origin = window.location.origin;
      const defaultSuccessUrl = `${origin}/dashboard?payment=success`;
      const defaultCancelUrl = `${origin}/pricing?payment=canceled`;
      
      // Create checkout session
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-checkout',
          planId,
          userId,
          email,
          successUrl: successUrl || defaultSuccessUrl,
          cancelUrl: cancelUrl || defaultCancelUrl,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
        return { success: true };
      } else if (stripePromise) {
        // If using Stripe.js directly
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to initialize');
        }
        
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        console.warn('Stripe not initialized, would redirect to checkout');
        return { success: true, mock: true };
      }

      return { success: true };
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to get user's subscription details
  const getSubscription = async (userId) => {
    try {
      setLoading(true);
      setError(null);

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

      if (!data.success) {
        throw new Error(data.error || 'Failed to get subscription');
      }

      return { success: true, subscription: data.subscription };
    } catch (err) {
      console.error('Get subscription error:', err);
      setError(err.message);
      return { success: false, error: err.message, subscription: null };
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel subscription
  const cancelSubscription = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel-subscription',
          userId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      return { success: true, subscription: data.subscription };
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    error,
    createCheckoutSession,
    getSubscription,
    cancelSubscription,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

// Custom hook to use payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    console.warn('usePayment must be used within a PaymentProvider');
    return {
      loading: false,
      error: 'PaymentProvider not found',
      createCheckoutSession: async () => ({ success: false, error: 'PaymentProvider not found' }),
      getSubscription: async () => ({ success: false, error: 'PaymentProvider not found', subscription: null }),
      cancelSubscription: async () => ({ success: false, error: 'PaymentProvider not found' }),
    };
  }
  return context;
};
