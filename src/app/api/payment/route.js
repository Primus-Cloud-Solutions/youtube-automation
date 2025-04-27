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

// Get user subscription
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

// Update subscription
export const POST = withErrorHandling(async (request) => {
  const { userId, planId } = await request.json();
  
  if (!userId) {
    return createApiError('User ID is required', 400);
  }
  
  if (!planId) {
    return createApiError('Plan ID is required', 400);
  }
  
  // In a real implementation, you would update the user's subscription in a database
  // For now, we'll return a mock response
  
  // Create expiration date 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  const subscription = {
    planName: planId === 'free' ? 'Free' : 
              planId === 'basic' ? 'Basic' : 
              planId === 'pro' ? 'Professional' : 'Enterprise',
    planId: planId,
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
    },
    expiresAt: expiresAt.toISOString()
  };
  
  return createApiResponse({ 
    subscription,
    message: 'Subscription updated successfully'
  });
});
