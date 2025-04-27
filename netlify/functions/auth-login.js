// This file contains Netlify Functions handler for auth login
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
      'Set-Cookie': `auth_user=${Buffer.from(JSON.stringify(data.user)).toString('base64')}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
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

// Auth login handler
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createApiError('Method not allowed', 405);
  }
  
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;
    
    if (!email || !password) {
      return createApiError('Email and password are required', 400);
    }
    
    // For demo purposes, check if it's the test account
    if (email === 'test@example.com' && password === 'Password123!') {
      const user = {
        id: 'test_user_id',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'email',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=random',
      };
      
      return createApiResponse({ user });
    }
    
    // In a real implementation, you would authenticate with Supabase
    // For demo purposes, we'll create a mock user for any valid-looking email/password
    if (email.includes('@') && email.includes('.') && password.length >= 6) {
      const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      const user = {
        id: `user_${Math.random().toString(36).substring(2, 15)}`,
        name: formattedName,
        email,
        provider: 'email',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=random`,
      };
      
      return createApiResponse({ user });
    }
    
    return createApiError('Invalid email or password', 401);
  } catch (error) {
    console.error('Auth login error:', error);
    return createApiError('Internal server error', 500);
  }
};
