// This file contains mock implementations for social login providers
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for API responses
const createApiResponse = (data) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, ...data }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

const createApiError = (message, status = 400) => {
  return {
    statusCode: status,
    body: JSON.stringify({ success: false, error: message }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

// Social login handler
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createApiError('Method not allowed', 405);
  }
  
  try {
    const body = JSON.parse(event.body);
    const { provider, redirectTo } = body;
    
    if (!provider) {
      return createApiError('Provider is required', 400);
    }
    
    // Validate provider
    if (!['google', 'github'].includes(provider)) {
      return createApiError('Invalid provider', 400);
    }
    
    // In a real implementation, you would use Supabase's signInWithOAuth method
    // For demo purposes, we'll return a mock URL
    
    // Create a mock auth URL
    const authUrl = `https://example.com/auth/${provider}?redirect=${encodeURIComponent(redirectTo || '/')}`;
    
    return createApiResponse({
      url: authUrl,
      provider,
      message: `Redirecting to ${provider} login...`
    });
  } catch (error) {
    console.error('Social login error:', error);
    return createApiError('Internal server error', 500);
  }
};
