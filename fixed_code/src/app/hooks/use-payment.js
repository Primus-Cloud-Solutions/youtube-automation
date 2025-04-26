'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key from environment variables with fallback for build time
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy_key_for_build';
const stripePromise = typeof window !== 'undefined' ? loadStripe(stripePublishableKey) : null;

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to create a checkout session and redirect to Stripe
  const createCheckoutSession = async (planId, userId) => {
    try {
      setLoading(true);
      setError(null);

      // Get the current URL for success and cancel redirects
      const origin = window.location.origin;
      const successUrl = `${origin}/dashboard?payment=success`;
      const cancelUrl = `${origin}/pricing?payment=canceled`;

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
          successUrl,
          cancelUrl,
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

  return {
    loading,
    error,
    createCheckoutSession,
    getSubscription,
    cancelSubscription,
  };
}
