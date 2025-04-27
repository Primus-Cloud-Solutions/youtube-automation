import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Specify API version
  appInfo: {
    name: 'TubeAutomator',
    version: '1.0.0',
  },
});

// Define the pricing plans
const PLANS = {
  basic: {
    id: 'price_basic',
    name: 'Basic',
    price: 1900, // $19.00
    interval: 'month',
    currency: 'usd',
    features: [
      '10 AI-generated videos per month',
      'Basic voice synthesis',
      'Standard scheduling',
      'Basic analytics',
      'Email support',
      '5GB storage'
    ],
    limits: {
      videosPerMonth: 10,
      storageGB: 5,
      schedulingFrequency: ['weekly', 'monthly'],
      voiceOptions: 3,
      analyticsRetention: 30, // days
    }
  },
  pro: {
    id: 'price_pro',
    name: 'Pro',
    price: 4900, // $49.00
    interval: 'month',
    currency: 'usd',
    features: [
      '30 AI-generated videos per month',
      'Advanced voice synthesis',
      'Smart scheduling',
      'Comprehensive analytics',
      'Priority support',
      'Trend analysis',
      '15GB storage'
    ],
    limits: {
      videosPerMonth: 30,
      storageGB: 15,
      schedulingFrequency: ['daily', 'every3days', 'weekly', 'biweekly', 'monthly'],
      voiceOptions: 10,
      analyticsRetention: 90, // days
    }
  },
  enterprise: {
    id: 'price_enterprise',
    name: 'Enterprise',
    price: 9900, // $99.00
    interval: 'month',
    currency: 'usd',
    features: [
      'Unlimited AI-generated videos',
      'Premium voice synthesis',
      'Advanced scheduling',
      'Advanced analytics & reporting',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'Viral video rebranding',
      '50GB storage'
    ],
    limits: {
      videosPerMonth: 999999, // Unlimited
      storageGB: 50,
      schedulingFrequency: ['daily', 'every3days', 'weekly', 'biweekly', 'monthly'],
      voiceOptions: 30,
      analyticsRetention: 365, // days
    }
  },
  free: {
    id: 'price_free',
    name: 'Free Trial',
    price: 0, // Free
    interval: 'once',
    currency: 'usd',
    features: [
      '3 AI-generated videos',
      'Basic voice synthesis',
      'Standard scheduling',
      'Basic analytics',
      'Email support',
      '1GB storage',
      '7-day trial'
    ],
    limits: {
      videosPerMonth: 3,
      storageGB: 1,
      schedulingFrequency: ['weekly'],
      voiceOptions: 2,
      analyticsRetention: 7, // days
      trialDays: 7
    }
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
  // Check if we're in a build/SSG environment
  if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
    console.warn('Stripe API key not available during build, returning mock data');
    return createApiResponse({
      sessionId: 'mock_session_id',
      url: 'https://example.com/checkout',
      subscription: {
        id: 'sub_mock',
        status: 'active',
        currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        planId: 'pro',
        planName: 'Pro',
        limits: PLANS.pro.limits,
        features: {
          scheduling: true,
          analytics: true
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }

  const { action, planId, userId, successUrl, cancelUrl, email, trialDays } = await request.json();
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Get available plans
  if (action === 'get-plans') {
    return createApiResponse({ plans: PLANS });
  }
  
  // Start free trial
  if (action === 'start-trial') {
    if (!userId || !email) {
      return createApiError('User ID and email are required', 400);
    }
    
    try {
      // In a real implementation, you would create a customer in Stripe
      // and set up a subscription with a trial period
      
      // Create a customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId
        }
      });
      
      // Store the trial information
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + (trialDays || 7));
      
      return createApiResponse({
        trialStarted: true,
        customerId: customer.id,
        trialEndDate: trialEndDate.toISOString(),
        plan: PLANS.free
      });
    } catch (error) {
      console.error('Stripe error:', error);
      return createApiError(`Error starting trial: ${error.message}`, 500);
    }
  }
  
  // Create a checkout session for subscription
  if (action === 'create-checkout') {
    if (!planId || !successUrl || !cancelUrl || !userId || !email) {
      return createApiError('Plan ID, success URL, cancel URL, user ID, and email are required', 400);
    }
    
    const plan = PLANS[planId];
    if (!plan) {
      return createApiError('Invalid plan ID', 400);
    }
    
    try {
      // Create or retrieve customer
      let customer;
      
      // Check if customer already exists
      const customers = await stripe.customers.list({
        email,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        // Create a new customer
        customer = await stripe.customers.create({
          email,
          metadata: {
            userId
          }
        });
      }
      
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer: customer.id,
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
                interval: plan.interval === 'once' ? 'month' : plan.interval,
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
      // In a real implementation, you would fetch the subscription from Stripe
      // For now, we'll return a mock subscription
      
      // Determine if the user is in a trial period
      const isInTrial = Math.random() > 0.7; // 30% chance of being in trial for demo
      
      if (isInTrial) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days remaining
        
        return createApiResponse({
          subscription: {
            id: 'sub_trial',
            status: 'trialing',
            currentPeriodEnd: Math.floor(trialEndDate.getTime() / 1000),
            planId: 'free',
            planName: 'Free Trial',
            trialEnd: Math.floor(trialEndDate.getTime() / 1000),
            trialDaysRemaining: Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            limits: PLANS.free.limits,
            features: {
              scheduling: PLANS.free.limits.schedulingFrequency.length > 0,
              analytics: false
            },
            expiresAt: new Date(trialEndDate).toISOString()
          }
        });
      }
      
      // Random plan for demo purposes
      const planKeys = ['basic', 'pro', 'enterprise'];
      const randomPlan = planKeys[Math.floor(Math.random() * planKeys.length)];
      const plan = PLANS[randomPlan];
      
      return createApiResponse({
        subscription: {
          id: `sub_mock_${randomPlan}`,
          status: 'active',
          currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          planId: randomPlan,
          planName: plan.name,
          limits: plan.limits,
          features: {
            scheduling: plan.limits.schedulingFrequency.length > 0,
            analytics: randomPlan !== 'basic',
            viralVideoRebranding: randomPlan === 'enterprise'
          },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
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
      // In a real implementation, you would cancel the subscription in Stripe
      // For now, we'll return a mock canceled subscription
      
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
  
  // Change subscription plan
  if (action === 'change-plan') {
    if (!userId || !planId) {
      return createApiError('User ID and plan ID are required', 400);
    }
    
    const plan = PLANS[planId];
    if (!plan) {
      return createApiError('Invalid plan ID', 400);
    }
    
    try {
      // In a real implementation, you would update the subscription in Stripe
      // For now, we'll return a mock updated subscription
      
      return createApiResponse({
        subscription: {
          id: 'sub_mock',
          status: 'active',
          currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          planId,
          planName: plan.name,
          limits: plan.limits
        }
      });
    } catch (error) {
      console.error('Stripe error:', error);
      return createApiError(`Error changing plan: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
