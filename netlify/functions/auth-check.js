// This file contains Netlify Functions handler for auth check
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
  };
};

const createApiError = (message, status = 400) => {
  return {
    statusCode: status,
    body: JSON.stringify({ success: false, error: message }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
  };
};

// Auth check handler
exports.handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }
  
  try {
    // Get the auth cookie
    const cookies = event.headers.cookie || '';
    const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth_user='));
    
    if (!authCookie) {
      return createApiResponse({ 
        authenticated: false,
        user: null
      });
    }
    
    // Parse the auth cookie
    const authUserBase64 = authCookie.split('=')[1];
    const authUserJson = Buffer.from(authUserBase64, 'base64').toString();
    const user = JSON.parse(authUserJson);
    
    if (!user || !user.id) {
      return createApiResponse({ 
        authenticated: false,
        user: null
      });
    }
    
    // For demo purposes, always return the user from the cookie
    // In a real implementation, you would verify with Supabase
    return createApiResponse({
      authenticated: true,
      user
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return createApiError('Internal server error', 500);
  }
};
