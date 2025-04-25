'use server'

import { supabase } from '../../supabase-auth-setup'
import { withErrorHandling, createApiResponse, createApiError } from '../utils'

// Helper function to validate request
async function validateRequest(request, options = {}) {
  try {
    const body = await request.json();
    
    if (options.required) {
      for (const field of options.required) {
        if (body[field] === undefined) {
          return {
            valid: false,
            error: `Missing required field: ${field}`,
            body
          };
        }
      }
    }
    
    return {
      valid: true,
      body
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid JSON body',
      body: {}
    };
  }
}

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
