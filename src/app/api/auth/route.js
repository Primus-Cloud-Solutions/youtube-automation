'use server'

import { createClient } from '@supabase/supabase-js'
import { withErrorHandling, validateRequest, createApiResponse, createApiError } from '../utils'

// Initialize Supabase client with fallback values for development and testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eurztwdqjncuypqbrcmw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnp0d2Rxam5jdXlwcWJyY213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1MzQ0MDAsImV4cCI6MTk5ODExMDQwMH0.fallback_demo_key_for_development'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const POST = withErrorHandling(async (request) => {
  const { body, valid, error } = await validateRequest(request, {
    required: ['action']
  });
  
  if (!valid) {
    return createApiError(error, 400);
  }
  
  const { action, email, password, fullName } = body;
  
  if (action === 'signup') {
    if (!email || !password) {
      return createApiError('Email and password are required', 400);
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      return createApiError(error.message, 500);
    }
    
    return createApiResponse({ user: data.user });
  } 
  else if (action === 'signin') {
    if (!email || !password) {
      return createApiError('Email and password are required', 400);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return createApiError(error.message, 500);
    }
    
    return createApiResponse({ user: data.user, session: data.session });
  } 
  else if (action === 'signout') {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return createApiError(error.message, 500);
    }
    
    return createApiResponse({});
  }
  else if (action === 'google') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${request.headers.get('origin')}/auth/callback`,
      },
    });
    
    if (error) {
      return createApiError(error.message, 500);
    }
    
    return createApiResponse({ url: data.url });
  }
  
  return createApiError('Invalid action', 400);
});

export const GET = withErrorHandling(async (request) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (!action) {
    return createApiError('Action parameter is required', 400);
  }
  
  if (action === 'session') {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return createApiError(error.message, 500);
    }
    
    return createApiResponse({ 
      session: data.session,
      user: data.session?.user || null
    });
  }
  
  return createApiError('Invalid action', 400);
});
