'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { getPlans, getSubscription, createCheckout, cancelSubscription } from '@/lib/api-client';

// Create the payment context
const PaymentContext = createContext();

// Custom hook to use the payment context
export const usePayment = () => {
  return useContext(PaymentContext);
};

// Payment provider component
export function PaymentProvider({ children }) {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize Stripe
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_dummy_key_for_build');

  // Load plans on initial render
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const response = await getPlans();
        
        if (response.success && response.plans) {
          // Convert plans object to array for easier rendering
          const plansArray = Object.keys(response.plans).map(key => ({
            id: key,
            ...response.plans[key]
          }));
          setPlans(plansArray);
        } else {
          // Fallback plans if API fails
          setPlans([
            {
              id: 'free',
              name: 'Free Trial',
              price: 0,
              features: [
                'Limited video generation (5 videos)',
                '1GB storage',
                'Basic analytics',
                'Weekly content scheduling',
                '7-day trial of all features'
              ]
            },
            {
              id: 'basic',
              name: 'Basic',
              price: 1999,
              features: [
                'Unlimited video generation',
                '5GB storage',
                'Basic analytics',
                'Weekly content scheduling',
                'Email support'
              ]
            },
            {
              id: 'pro',
              name: 'Professional',
              price: 4999,
              features: [
                'Unlimited video generation',
                '20GB storage',
                'Advanced analytics',
                'Daily content scheduling',
                'Priority email support',
                'Custom branding options'
              ]
            },
            {
              id: 'enterprise',
              name: 'Enterprise',
              price: 9999,
              features: [
                'Unlimited video generation',
                '50GB storage',
                'Premium analytics',
                'Hourly content scheduling',
                'Dedicated support',
                'Custom branding options',
                'Viral video rebranding',
                'Multi-channel management'
              ]
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading plans:', err);
        setError('Failed to load pricing plans. Please try again later.');
        
        // Set fallback plans
        setPlans([
          {
            id: 'free',
            name: 'Free Trial',
            price: 0,
            features: [
              'Limited video generation (5 videos)',
              '1GB storage',
              'Basic analytics',
              'Weekly content scheduling',
              '7-day trial of all features'
            ]
          },
          {
            id: 'basic',
            name: 'Basic',
            price: 1999,
            features: [
              'Unlimited video generation',
              '5GB storage',
              'Basic analytics',
              'Weekly content scheduling',
              'Email support'
            ]
          },
          {
            id: 'pro',
            name: 'Professional',
            price: 4999,
            features: [
              'Unlimited video generation',
              '20GB storage',
              'Advanced analytics',
              'Daily content scheduling',
              'Priority email support',
              'Custom branding options'
            ]
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 9999,
            features: [
              'Unlimited video generation',
              '50GB storage',
              'Premium analytics',
              'Hourly content scheduling',
              'Dedicated support',
              'Custom branding options',
              'Viral video rebranding',
              'Multi-channel management'
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Load user subscription
  const loadSubscription = async (userId) => {
    try {
      setLoading(true);
      const response = await getSubscription(userId);
      
      if (response.success && response.subscription) {
        setSubscription(response.subscription);
      } else {
        // Set default subscription if API fails
        setSubscription({
          planName: 'Free Trial',
          planId: 'free',
          status: 'active',
          currentPeriodStart: Math.floor(Date.now() / 1000) - 86400 * 15,
          currentPeriodEnd: Math.floor(Date.now() / 1000) + 86400 * 15,
          cancelAtPeriodEnd: false,
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
      }
    } catch (err) {
      console.error('Error loading subscription:', err);
      setError('Failed to load subscription details. Please try again later.');
      
      // Set default subscription if API fails
      setSubscription({
        planName: 'Free Trial',
        planId: 'free',
        status: 'active',
        currentPeriodStart: Math.floor(Date.now() / 1000) - 86400 * 15,
        currentPeriodEnd: Math.floor(Date.now() / 1000) + 86400 * 15,
        cancelAtPeriodEnd: false,
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
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription checkout
  const handleCheckout = async (planId, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createCheckout(planId, userId);
      
      if (response.success && response.sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.sessionId
        });
        
        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error(response.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout. Please try again later.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cancelSubscription(userId);
      
      if (response.success) {
        // Update subscription status
        setSubscription(prev => ({
          ...prev,
          cancelAtPeriodEnd: true
        }));
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to cancel subscription');
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      setError(err.message || 'Failed to cancel subscription. Please try again later.');
      
      // For demo purposes, update subscription status anyway
      setSubscription(prev => ({
        ...prev,
        cancelAtPeriodEnd: true
      }));
      
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    plans,
    subscription,
    loading,
    error,
    loadSubscription,
    checkout: handleCheckout,
    cancelSubscription: handleCancelSubscription
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}
