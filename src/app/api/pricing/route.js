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
      console.error('Pricing API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Get pricing plans
export const GET = withErrorHandling(async () => {
  // In a real implementation, you would fetch pricing plans from a database
  // For now, we'll return mock pricing plans
  
  const plans = [
    {
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
    {
      id: 'basic',
      name: 'Basic',
      price: 19.99,
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
      popular: true,
      buttonText: 'Get Started'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 49.99,
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
      popular: false,
      buttonText: 'Go Pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
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
  ];
  
  return createApiResponse({ plans });
});
