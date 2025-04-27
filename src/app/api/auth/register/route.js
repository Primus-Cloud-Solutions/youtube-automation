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
      console.error('Auth register API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Register handler
export const POST = withErrorHandling(async (request) => {
  const { name, email, password } = await request.json();
  
  if (!email || !password) {
    return createApiError('Email and password are required', 400);
  }
  
  // Sign up with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || email.split('@')[0]
      }
    }
  });
  
  if (error) {
    return createApiError(error.message, 400);
  }
  
  // Create a demo subscription for the new user
  const userId = data.user.id;
  
  // In a real implementation, you would create a subscription record in your database
  // For now, we'll just return the user data
  
  return createApiResponse({ 
    user: data.user,
    message: 'Registration successful'
  });
});
