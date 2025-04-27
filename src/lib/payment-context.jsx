'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckout, getSubscription as fetchSubscription, cancelSubscription as cancelUserSubscription } from '../lib/api-client';

// Initialize Stripe with the publishable key from environment variables with fallback for build time
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy_key_for_build';
const stripePromise = typeof window !== 'undefined' ? loadStripe(stripePublishableKey) : null;

// Create payment context with default values
const PaymentContext = createContext({
  loading: false,
  error: null,
  createCheckoutSession: async (planId, userId) => ({ success: false, error: 'PaymentProvider not initialized' }),
  getSubscription: async (userId) => ({ success: false, error: 'PaymentProvider not initialized', subscription: null }),
  cancelSubscription: async (userId) => ({ success: false, error: 'PaymentProvider not initialized' }),
});

// Payment provider component
export function PaymentProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to create a checkout session and redirect to Stripe
  const createCheckoutSession = async (planId, userId, userEmail, successUrl, cancelUrl) => {
    try {
      setLoading(true);
      setError(null);

      // Use the api-client function instead of direct fetch
      const data = await createCheckout(planId, userId);

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

      // Use the api-client function instead of direct fetch
      const data = await fetchSubscription(userId);

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

      // Use the api-client function instead of direct fetch
      const data = await cancelUserSubscription(userId);

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
  return useContext(PaymentContext);
};
