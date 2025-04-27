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
      console.error('Auth logout API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Logout handler
export const POST = withErrorHandling(async () => {
  // Sign out with Supabase
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return createApiError(error.message, 400);
  }
  
  return createApiResponse({ 
    message: 'Logged out successfully'
  });
});
