import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      console.error('Payment API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// POST handler for payment operations
export const POST = withErrorHandling(async (request) => {
  const body = await request.json();
  const { action, userId, planId, email, successUrl, cancelUrl, trialDays } = body;
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Get plans
  if (action === 'get-plans') {
    // In a real implementation, you would fetch pricing plans from a database
    // For now, we'll return mock pricing plans
    
    const plans = {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        billingPeriod: 'month',
        description: 'Get started with basic YouTube automation',
        features: [
          'Up to 5 videos per month',
          '1GB storage',
          'Weekly content scheduling',
          'Basic analytics'
        ],
        limits: {
          videosPerMonth: 5,
          storageGB: 1,
          schedulingFrequency: 'weekly'
        },
        popular: false,
        buttonText: 'Start Free'
      },
      basic: {
        id: 'basic',
        name: 'Basic',
        price: 1999, // in cents
        billingPeriod: 'month',
        description: 'Perfect for content creators just starting out',
        features: [
          'Up to 20 videos per month',
          '10GB storage',
          'Daily content scheduling',
          'Basic analytics',
          'Email support'
        ],
        limits: {
          videosPerMonth: 20,
          storageGB: 10,
          schedulingFrequency: 'daily'
        },
        popular: false,
        buttonText: 'Get Started'
      },
      pro: {
        id: 'pro',
        name: 'Professional',
        price: 4999, // in cents
        billingPeriod: 'month',
        description: 'For serious content creators and small teams',
        features: [
          'Up to 50 videos per month',
          '50GB storage',
          'Hourly content scheduling',
          'Advanced analytics',
          'Priority support',
          'Custom thumbnails'
        ],
        limits: {
          videosPerMonth: 50,
          storageGB: 50,
          schedulingFrequency: 'hourly'
        },
        popular: true,
        buttonText: 'Go Pro'
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 9999, // in cents
        billingPeriod: 'month',
        description: 'For businesses and professional content teams',
        features: [
          'Unlimited videos',
          '500GB storage',
          'Real-time content scheduling',
          'Premium analytics',
          'Dedicated support',
          'Custom thumbnails',
          'Viral video rebranding',
          'Multi-channel management'
        ],
        limits: {
          videosPerMonth: 100,
          storageGB: 500,
          schedulingFrequency: 'hourly'
        },
        popular: false,
        buttonText: 'Contact Sales'
      }
    };
    
    return createApiResponse({ plans });
  }
  
  // Get subscription
  if (action === 'get-subscription') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    // In a real implementation, you would fetch the user's subscription from a database
    // For now, we'll return a mock subscription based on the user ID
    
    // Generate a random plan for demo purposes
    const plans = ['free', 'basic', 'pro', 'enterprise'];
    const randomPlan = plans[Math.floor(Math.random() * plans.length)];
    
    // Create expiration date 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const subscription = {
      planName: randomPlan === 'free' ? 'Free' : 
                randomPlan === 'basic' ? 'Basic' : 
                randomPlan === 'pro' ? 'Professional' : 'Enterprise',
      planId: randomPlan,
      status: Math.random() > 0.3 ? 'active' : 'trialing',
      trialDaysRemaining: Math.floor(Math.random() * 7) + 1,
      currentPeriodEnd: Math.floor(expiresAt.getTime() / 1000),
      cancelAtPeriodEnd: Math.random() > 0.8,
      limits: {
        videosPerMonth: randomPlan === 'free' ? 5 : 
                        randomPlan === 'basic' ? 20 : 
                        randomPlan === 'pro' ? 50 : 100,
        storageGB: randomPlan === 'free' ? 1 : 
                  randomPlan === 'basic' ? 10 : 
                  randomPlan === 'pro' ? 50 : 500,
        schedulingFrequency: randomPlan === 'free' ? 'weekly' : 
                            randomPlan === 'basic' ? 'daily' : 'hourly'
      },
      features: {
        scheduling: randomPlan !== 'free',
        analytics: randomPlan !== 'basic',
        viralVideoRebranding: randomPlan === 'enterprise'
      }
    };
    
    return createApiResponse({ subscription });
  }
  
  // Create checkout session
  if (action === 'create-checkout') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    if (!planId) {
      return createApiError('Plan ID is required', 400);
    }
    
    if (!email) {
      return createApiError('Email is required', 400);
    }
    
    if (!successUrl || !cancelUrl) {
      return createApiError('Success and cancel URLs are required', 400);
    }
    
    // In a real implementation, you would create a checkout session with Stripe
    // For now, we'll return a mock checkout URL
    
    const checkoutUrl = `${successUrl}&demo=true`;
    
    return createApiResponse({ 
      checkoutUrl,
      message: 'Checkout session created successfully'
    });
  }
  
  // Start trial
  if (action === 'start-trial') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    if (!email) {
      return createApiError('Email is required', 400);
    }
    
    // In a real implementation, you would create a trial subscription in your database
    // For now, we'll return a mock response
    
    return createApiResponse({ 
      subscription: {
        planName: 'Free Trial',
        planId: 'free',
        status: 'trialing',
        trialDaysRemaining: trialDays || 7,
        currentPeriodEnd: Math.floor((new Date().getTime() + (trialDays || 7) * 24 * 60 * 60 * 1000) / 1000),
        cancelAtPeriodEnd: false,
        limits: {
          videosPerMonth: 20,
          storageGB: 10,
          schedulingFrequency: 'daily'
        },
        features: {
          scheduling: true,
          analytics: true,
          viralVideoRebranding: false
        }
      },
      message: 'Trial started successfully'
    });
  }
  
  // Update subscription
  if (action === 'update-subscription') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    if (!planId) {
      return createApiError('Plan ID is required', 400);
    }
    
    // In a real implementation, you would update the user's subscription in your database
    // For now, we'll return a mock response
    
    // Create expiration date 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const subscription = {
      planName: planId === 'free' ? 'Free' : 
                planId === 'basic' ? 'Basic' : 
                planId === 'pro' ? 'Professional' : 'Enterprise',
      planId: planId,
      status: 'active',
      currentPeriodEnd: Math.floor(expiresAt.getTime() / 1000),
      cancelAtPeriodEnd: false,
      limits: {
        videosPerMonth: planId === 'free' ? 5 : 
                        planId === 'basic' ? 20 : 
                        planId === 'pro' ? 50 : 100,
        storageGB: planId === 'free' ? 1 : 
                  planId === 'basic' ? 10 : 
                  planId === 'pro' ? 50 : 500,
        schedulingFrequency: planId === 'free' ? 'weekly' : 
                            planId === 'basic' ? 'daily' : 'hourly'
      },
      features: {
        scheduling: planId !== 'free',
        analytics: planId !== 'basic',
        viralVideoRebranding: planId === 'enterprise'
      }
    };
    
    return createApiResponse({ 
      subscription,
      message: 'Subscription updated successfully'
    });
  }
  
  return createApiError('Invalid action', 400);
});

// GET handler for retrieving user subscription
export const GET = withErrorHandling(async (request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return createApiResponse({ 
      subscription: {
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
      }
    });
  }
  
  // In a real implementation, you would fetch the user's subscription from a database
  // For now, we'll return a mock subscription based on the user ID
  
  // Generate a random plan for demo purposes
  const plans = ['free', 'basic', 'pro', 'enterprise'];
  const randomPlan = plans[Math.floor(Math.random() * plans.length)];
  
  // Create expiration date 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  const subscription = {
    planName: randomPlan === 'free' ? 'Free' : 
              randomPlan === 'basic' ? 'Basic' : 
              randomPlan === 'pro' ? 'Professional' : 'Enterprise',
    planId: randomPlan,
    limits: {
      videosPerMonth: randomPlan === 'free' ? 5 : 
                      randomPlan === 'basic' ? 20 : 
                      randomPlan === 'pro' ? 50 : 100,
      storageGB: randomPlan === 'free' ? 1 : 
                randomPlan === 'basic' ? 10 : 
                randomPlan === 'pro' ? 50 : 500,
      schedulingFrequency: randomPlan === 'free' ? 'weekly' : 
                          randomPlan === 'basic' ? 'daily' : 'hourly'
    },
    features: {
      scheduling: randomPlan !== 'free',
      analytics: randomPlan !== 'basic',
      viralVideoRebranding: randomPlan === 'enterprise'
    },
    expiresAt: expiresAt.toISOString()
  };
  
  return createApiResponse({ subscription });
});
