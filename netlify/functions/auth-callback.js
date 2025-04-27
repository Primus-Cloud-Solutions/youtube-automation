// This file contains Netlify Functions handler for social login
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

// Social login callback handler
exports.handler = async (event) => {
  // Only allow GET requests for OAuth callbacks
  if (event.httpMethod !== 'GET') {
    return createApiError('Method not allowed', 405);
  }
  
  try {
    const { code, state, provider } = event.queryStringParameters;
    
    if (!code || !provider) {
      return createApiError('Missing required parameters', 400);
    }
    
    // In a real implementation, you would exchange the code for a token
    // and then use the token to get the user's profile
    // For demo purposes, we'll create a mock user
    
    const mockUser = {
      id: `user_${Math.random().toString(36).substring(2, 15)}`,
      name: provider === 'google' ? 'Google User' : 'GitHub User',
      email: `${provider}_user@example.com`,
      provider,
      avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=random`,
    };
    
    // Set a cookie with the user information
    const userCookie = Buffer.from(JSON.stringify(mockUser)).toString('base64');
    
    // Redirect to the dashboard or the URL specified in the state parameter
    const redirectUrl = state ? decodeURIComponent(state) : '/dashboard';
    
    return {
      statusCode: 302,
      headers: {
        'Location': redirectUrl,
        'Set-Cookie': `auth_user=${userCookie}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
      },
      body: '',
    };
  } catch (error) {
    console.error('Social login callback error:', error);
    return createApiError('Internal server error', 500);
  }
};
