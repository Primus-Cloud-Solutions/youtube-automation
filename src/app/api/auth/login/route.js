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
      console.error('Auth login API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Login handler
export const POST = withErrorHandling(async (request) => {
  const { email, password } = await request.json();
  
  if (!email || !password) {
    return createApiError('Email and password are required', 400);
  }
  
  // Sign in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    return createApiError(error.message, 400);
  }
  
  // For demo purposes, if using test@example.com, always succeed
  if (email === 'test@example.com') {
    return createApiResponse({ 
      user: {
        id: 'demo-user-id',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User'
        }
      },
      session: {
        access_token: 'demo-token'
      }
    });
  }
  
  return createApiResponse({ 
    user: data.user,
    session: data.session
  });
});
