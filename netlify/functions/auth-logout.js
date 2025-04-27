// This file contains Netlify Functions handler for auth logout
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
      'Set-Cookie': 'auth_user=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
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

// Auth logout handler
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createApiError('Method not allowed', 405);
  }
  
  try {
    // In a real implementation, you would sign out with Supabase
    // For demo purposes, we'll just clear the cookie
    
    return createApiResponse({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Auth logout error:', error);
    return createApiError('Internal server error', 500);
  }
};
