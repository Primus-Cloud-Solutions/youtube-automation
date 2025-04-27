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

// Auth check handler
exports.handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return createApiError('Method not allowed', 405);
  }
  
  try {
    // In a real implementation, you would check the session cookie
    // For demo purposes, we'll create a mock user
    
    // Check if there's a cookie with user information
    const cookies = event.headers.cookie || '';
    const authUserCookie = cookies.split(';').find(c => c.trim().startsWith('auth_user='));
    
    if (authUserCookie) {
      // Parse the user information from the cookie
      const userCookie = authUserCookie.split('=')[1].trim();
      const user = JSON.parse(Buffer.from(userCookie, 'base64').toString());
      
      return createApiResponse({ user });
    }
    
    // For demo purposes, always return a test user
    const testUser = {
      id: 'test_user_id',
      name: 'Test User',
      email: 'test@example.com',
      provider: 'email',
      avatar: 'https://ui-avatars.com/api/?name=Test+User&background=random',
    };
    
    return createApiResponse({ user: testUser });
  } catch (error) {
    console.error('Auth check error:', error);
    return createApiError('Internal server error', 500);
  }
};
