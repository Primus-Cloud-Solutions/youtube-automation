'use server';

import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../email/sendgrid';

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
  const { action, email, password, fullName } = await request.json();
  
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
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
        }
      }
    });
    
    if (error) {
      return createApiError(error.message, 400);
    }
    
    // Send confirmation email
    await sendEmail({
      to: email,
      subject: 'Welcome to TubeAutomator - Confirm Your Email',
      text: `Welcome to TubeAutomator! Please confirm your email by clicking this link: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/confirm-email?token=${data.user.confirmation_token}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF0000;">Welcome to TubeAutomator!</h1>
          <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/confirm-email?token=${data.user.confirmation_token}" 
               style="background-color: #FF0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Confirm Email
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/confirm-email?token=${data.user.confirmation_token}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    });
    
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
  
  // Demo account sign in
  if (action === 'demo') {
    // Use demo credentials
    const demoEmail = 'test@example.com';
    const demoPassword = 'Password123!';
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (error) {
        // If demo account doesn't exist, create it
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              data: {
                full_name: 'Demo User',
                is_demo: true
              }
            }
          });
          
          if (signUpError) {
            return createApiError(signUpError.message, 400);
          }
          
          // Try signing in again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
          });
          
          if (retryError) {
            return createApiError(retryError.message, 400);
          }
          
          return createApiResponse({ user: retryData.user, session: retryData.session });
        }
        
        return createApiError(error.message, 400);
      }
      
      return createApiResponse({ user: data.user, session: data.session });
    } catch (error) {
      console.error('Demo sign in error:', error);
      return createApiError('Failed to sign in with demo account', 500);
    }
  }
  
  // Google sign in
  if (action === 'google') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/callback`
      }
    });
    
    if (error) {
      return createApiError(error.message, 400);
    }
    
    return createApiResponse({ url: data.url });
  }
  
  // GitHub sign in
  if (action === 'github') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/callback`
      }
    });
    
    if (error) {
      return createApiError(error.message, 400);
    }
    
    return createApiResponse({ url: data.url });
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
export const GET = withErrorHandling(async (request) => {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  if (action === 'session') {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return createApiError(error.message, 400);
    }
    
    if (!data.session) {
      return createApiResponse({ user: null });
    }
    
    // Get user data
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return createApiError(userError.message, 400);
    }
    
    return createApiResponse({ 
      session: data.session,
      user: userData.user
    });
  }
  
  return createApiError('Invalid action', 400);
});
