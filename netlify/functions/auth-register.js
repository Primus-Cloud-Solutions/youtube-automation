// This file contains Netlify Functions handler for auth register
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
  };
};

// Auth register handler
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
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createApiError('Method not allowed', 405);
  }
  
  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return createApiError('Name, email, and password are required', 400);
    }
    
    // In a real implementation, you would register with Supabase
    // For demo purposes, we'll create a mock user for any valid-looking registration
    if (email.includes('@') && email.includes('.') && password.length >= 6) {
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
    
    return createApiError('Invalid registration data', 400);
  } catch (error) {
    console.error('Auth register error:', error);
    return createApiError('Internal server error', 500);
  }
};
