'use server';

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
      console.error('Auth API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Sign up handler
export const POST = withErrorHandling(async (request) => {
  const { action, email, password } = await request.json();
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Sign up
  if (action === 'signup') {
    if (!email || !password) {
      return createApiError('Email and password are required', 400);
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return createApiError(error.message, 400);
    }
    
    return createApiResponse({ user: data.user });
  }
  
  // Sign in
  if (action === 'signin') {
    if (!email || !password) {
      return createApiError('Email and password are required', 400);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return createApiError(error.message, 400);
    }
    
    return createApiResponse({ user: data.user, session: data.session });
  }
  
  // Sign out
  if (action === 'signout') {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return createApiError(error.message, 400);
    }
    
    return createApiResponse({ message: 'Signed out successfully' });
  }
  
  return createApiError('Invalid action', 400);
});

// Get session handler
export const GET = withErrorHandling(async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    return createApiError(error.message, 400);
  }
  
  return createApiResponse({ session: data.session });
});
