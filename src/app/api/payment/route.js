'use server';

import Stripe from 'stripe';

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

// Helper functions for API responses
const createApiResponse = (data) => {
  return Response.json({ success: true, ...data });
};

const createApiError = (message, status = 400) => {
  return Response.json({ success: false, error: message }, { status });
};

// Error handling wrapper
const withErrorHandling = (handler) => {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

export const POST = withErrorHandling(async (request) => {
  const { action, planId, userId, successUrl, cancelUrl } = await request.json();
  
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
      // For demo purposes, return a mock subscription
      return createApiResponse({
        subscription: {
          id: 'sub_mock',
          status: 'active',
          currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          planId: 'professional',
          planName: 'Professional'
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
      // For demo purposes, return a mock canceled subscription
      return createApiResponse({
        subscription: {
          id: 'sub_mock',
          status: 'active',
          cancelAtPeriodEnd: true,
          currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days from now
        }
      });
    } catch (error) {
      console.error('Stripe error:', error);
      return createApiError(`Error canceling subscription: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
