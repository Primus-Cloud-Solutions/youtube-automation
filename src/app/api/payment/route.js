'use server'

import Stripe from 'stripe';
import { withErrorHandling, createApiResponse, createApiError } from '../utils';
import { supabase } from '../../supabase-auth-setup';

// Initialize Stripe with the secret key from environment variables only
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define the pricing plans
const PLANS = {
  starter: {
    id: 'price_starter',
    name: 'Starter',
    price: 1900, // $19.00
    interval: 'month',
    currency: 'usd',
    features: ['5 AI-generated videos per month', 'Basic voice synthesis', 'Standard scheduling', 'Basic analytics', 'Email support']
  },
  professional: {
    id: 'price_professional',
    name: 'Professional',
    price: 4900, // $49.00
    interval: 'month',
    currency: 'usd',
    features: ['20 AI-generated videos per month', 'Advanced voice synthesis', 'Smart scheduling', 'Comprehensive analytics', 'Priority support', 'Trend analysis']
  },
  enterprise: {
    id: 'price_enterprise',
    name: 'Enterprise',
    price: 9900, // $99.00
    interval: 'month',
    currency: 'usd',
    features: ['Unlimited AI-generated videos', 'Premium voice synthesis', 'Advanced scheduling', 'Advanced analytics & reporting', 'Dedicated account manager', 'API access', 'Custom integrations']
  }
};

export const POST = withErrorHandling(async (request) => {
  const { body } = await request.json();
  const { action, planId, userId, successUrl, cancelUrl } = body;
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Create a checkout session for subscription
  if (action === 'create-checkout') {
    if (!planId || !successUrl || !cancelUrl) {
      return createApiError('Plan ID, success URL, and cancel URL are required', 400);
    }
    
    const plan = PLANS[planId];
    if (!plan) {
      return createApiError('Invalid plan ID', 400);
    }
    
    try {
      // Get user data if userId is provided
      let customerEmail = '';
      let customerId = '';
      
      if (userId) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, stripe_customer_id')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else if (userData) {
          customerEmail = userData.email;
          customerId = userData.stripe_customer_id;
        }
      }
      
      // Create or retrieve Stripe customer
      let customer;
      if (customerId) {
        customer = await stripe.customers.retrieve(customerId);
      } else if (customerEmail) {
        // Look up customer by email
        const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
        
        if (customers.data.length > 0) {
          customer = customers.data[0];
        } else {
          // Create new customer
          customer = await stripe.customers.create({
            email: customerEmail,
            metadata: { userId }
          });
          
          // Update user with Stripe customer ID
          if (userId) {
            await supabase
              .from('users')
              .update({ stripe_customer_id: customer.id })
              .eq('id', userId);
          }
        }
      }
      
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: plan.currency,
              product_data: {
                name: `${plan.name} Plan`,
                description: `TubeAutomator ${plan.name} Subscription`,
              },
              unit_amount: plan.price,
              recurring: {
                interval: plan.interval,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer: customer?.id,
        client_reference_id: userId,
        metadata: {
          planId,
          userId
        }
      });
      
      return createApiResponse({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Stripe error:', error);
      return createApiError(`Payment processing error: ${error.message}`, 500);
    }
  }
  
  // Get subscription details
  if (action === 'get-subscription') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    try {
      // Get user's Stripe customer ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();
        
      if (userError || !userData?.stripe_customer_id) {
        return createApiResponse({ subscription: null });
      }
      
      // Get customer's subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: userData.stripe_customer_id,
        status: 'active',
        limit: 1
      });
      
      if (subscriptions.data.length === 0) {
        return createApiResponse({ subscription: null });
      }
      
      const subscription = subscriptions.data[0];
      
      // Get the plan details
      const planId = Object.keys(PLANS).find(key => 
        PLANS[key].id === subscription.items.data[0].price.id
      );
      
      return createApiResponse({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          planId,
          planName: planId ? PLANS[planId].name : 'Unknown'
        }
      });
    } catch (error) {
      console.error('Stripe error:', error);
      return createApiError(`Error fetching subscription: ${error.message}`, 500);
    }
  }
  
  // Cancel subscription
  if (action === 'cancel-subscription') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    try {
      // Get user's Stripe customer ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();
        
      if (userError || !userData?.stripe_customer_id) {
        return createApiError('No subscription found', 404);
      }
      
      // Get customer's subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: userData.stripe_customer_id,
        status: 'active',
        limit: 1
      });
      
      if (subscriptions.data.length === 0) {
        return createApiError('No active subscription found', 404);
      }
      
      // Cancel the subscription at period end
      const subscription = await stripe.subscriptions.update(
        subscriptions.data[0].id,
        { cancel_at_period_end: true }
      );
      
      return createApiResponse({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: subscription.current_period_end
        }
      });
    } catch (error) {
      console.error('Stripe error:', error);
      return createApiError(`Error canceling subscription: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
