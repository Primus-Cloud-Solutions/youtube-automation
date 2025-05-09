// This file contains the Netlify Functions handler for API routes
const path = require('path');

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

// Export the handler function for Netlify Functions
exports.handler = async (event, context) => {
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
    // Parse the request body if it exists
    let requestBody = {};
    if (event.body) {
      try {
        requestBody = JSON.parse(event.body);
      } catch (e) {
        console.error('Error parsing request body:', e);
        return createApiError('Invalid request body format');
      }
    }

    // Extract the path from the request body or event
    const apiPath = requestBody.path || '';
    
    // Route the request based on the API path
    if (apiPath.startsWith('/payment')) {
      return handlePaymentRequest(event, requestBody);
    } else if (apiPath.startsWith('/auth')) {
      return handleAuthRequest(event, apiPath);
    } else if (apiPath.startsWith('/storage')) {
      return handleStorageRequest(event, requestBody);
    } else if (apiPath.startsWith('/youtube')) {
      return handleYoutubeRequest(event, requestBody);
    } else if (apiPath.startsWith('/viral-video')) {
      return handleViralVideoRequest(event, requestBody);
    } else if (apiPath.startsWith('/pricing')) {
      return handlePricingRequest(event);
    } else {
      // If no path is specified in the body, try to determine from the URL
      const urlPath = event.path.replace('/.netlify/functions/api', '');
      
      if (urlPath.startsWith('/payment')) {
        return handlePaymentRequest(event, requestBody);
      } else if (urlPath.startsWith('/auth')) {
        return handleAuthRequest(event, urlPath);
      } else if (urlPath.startsWith('/storage')) {
        return handleStorageRequest(event, requestBody);
      } else if (urlPath.startsWith('/youtube')) {
        return handleYoutubeRequest(event, requestBody);
      } else if (urlPath.startsWith('/viral-video')) {
        return handleViralVideoRequest(event, requestBody);
      } else if (urlPath.startsWith('/pricing')) {
        return handlePricingRequest(event);
      } else {
        // Default response for unknown API routes
        return createApiError('API route not found', 404);
      }
    }
  } catch (error) {
    console.error('API route error:', error);
    
    // Return a fallback response for errors
    return createApiError('Internal server error: ' + error.message, 500);
  }
};

// Handle payment-related requests
const handlePaymentRequest = async (event, requestBody) => {
  try {
    // Extract action from request body
    const { action, userId } = requestBody;
    
    // Handle different payment actions
    if (action === 'get-plans') {
      // Return mock pricing plans
      return createApiResponse({
        plans: {
          free: {
            name: 'Free Trial',
            price: 0,
            features: [
              'Limited video generation (5 videos)',
              '1GB storage',
              'Basic analytics',
              'Weekly content scheduling',
              '7-day trial of all features'
            ]
          },
          basic: {
            name: 'Basic',
            price: 1999,
            features: [
              'Unlimited video generation',
              '5GB storage',
              'Basic analytics',
              'Weekly content scheduling',
              'Email support'
            ]
          },
          pro: {
            name: 'Professional',
            price: 4999,
            features: [
              'Unlimited video generation',
              '20GB storage',
              'Advanced analytics',
              'Daily content scheduling',
              'Priority email support',
              'Custom branding options'
            ]
          },
          enterprise: {
            name: 'Enterprise',
            price: 9999,
            features: [
              'Unlimited video generation',
              '50GB storage',
              'Premium analytics',
              'Hourly content scheduling',
              'Dedicated support',
              'Custom branding options',
              'Viral video rebranding',
              'Multi-channel management'
            ]
          }
        }
      });
    } else if (action === 'get-subscription') {
      // Return mock subscription data
      return createApiResponse({
        subscription: {
          planName: 'Free Trial',
          planId: 'free',
          status: 'active',
          currentPeriodStart: Math.floor(Date.now() / 1000) - 86400 * 15,
          currentPeriodEnd: Math.floor(Date.now() / 1000) + 86400 * 15,
          cancelAtPeriodEnd: false,
          limits: {
            videosPerMonth: 5,
            storageGB: 1,
            schedulingFrequency: 'weekly'
          },
          features: {
            scheduling: true,
            analytics: true,
            viralVideoRebranding: false
          }
        }
      });
    } else {
      // Default response for other payment actions
      return createApiResponse({
        message: 'Payment action processed successfully'
      });
    }
  } catch (error) {
    console.error('Payment request error:', error);
    return createApiError('Error processing payment request: ' + error.message);
  }
};

// Handle authentication-related requests
const handleAuthRequest = async (event, apiPath) => {
  // For direct API calls, return mock auth data instead of redirecting
  if (apiPath.includes('/auth/check')) {
    return createApiResponse({
      isAuthenticated: true,
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString()
      }
    });
  } else if (apiPath.includes('/auth/login')) {
    try {
      const body = JSON.parse(event.body || '{}');
      const { email, password } = body;
      
      // Simple validation
      if (!email || !password) {
        return createApiError('Email and password are required');
      }
      
      // Mock successful login
      return createApiResponse({
        token: 'mock-jwt-token',
        user: {
          id: 'user123',
          email: email,
          name: 'Test User',
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      return createApiError('Login failed: ' + error.message);
    }
  } else if (apiPath.includes('/auth/register')) {
    try {
      const body = JSON.parse(event.body || '{}');
      const { email, password, name } = body;
      
      // Simple validation
      if (!email || !password || !name) {
        return createApiError('Email, password, and name are required');
      }
      
      // Mock successful registration
      return createApiResponse({
        token: 'mock-jwt-token',
        user: {
          id: 'user123',
          email: email,
          name: name,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      return createApiError('Registration failed: ' + error.message);
    }
  } else if (apiPath.includes('/auth/logout')) {
    return createApiResponse({
      message: 'Logged out successfully'
    });
  } else if (apiPath.includes('/auth/social-login')) {
    try {
      const body = JSON.parse(event.body || '{}');
      const { provider } = body;
      
      // Simple validation
      if (!provider) {
        return createApiError('Provider is required');
      }
      
      // Mock successful social login
      return createApiResponse({
        token: 'mock-jwt-token',
        user: {
          id: 'user123',
          email: 'social@example.com',
          name: 'Social User',
          provider: provider,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      return createApiError('Social login failed: ' + error.message);
    }
  } else {
    return createApiError('Auth endpoint not found', 404);
  }
};

// Handle storage-related requests
const handleStorageRequest = async (event, requestBody) => {
  // Mock storage response
  return createApiResponse({
    message: 'Storage request processed successfully',
    files: [
      {
        id: 'file1',
        name: 'video1.mp4',
        size: 1024 * 1024 * 5,
        type: 'video/mp4',
        url: 'https://example.com/video1.mp4',
        createdAt: new Date().toISOString()
      },
      {
        id: 'file2',
        name: 'video2.mp4',
        size: 1024 * 1024 * 8,
        type: 'video/mp4',
        url: 'https://example.com/video2.mp4',
        createdAt: new Date().toISOString()
      }
    ]
  });
};

// Handle YouTube-related requests
const handleYoutubeRequest = async (event, requestBody) => {
  // Mock YouTube response
  return createApiResponse({
    message: 'YouTube request processed successfully',
    videos: [
      {
        id: 'video1',
        title: 'Sample Video 1',
        description: 'This is a sample video',
        url: 'https://youtube.com/watch?v=sample1',
        thumbnail: 'https://example.com/thumbnail1.jpg',
        views: 1000,
        likes: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: 'video2',
        title: 'Sample Video 2',
        description: 'This is another sample video',
        url: 'https://youtube.com/watch?v=sample2',
        thumbnail: 'https://example.com/thumbnail2.jpg',
        views: 2000,
        likes: 200,
        createdAt: new Date().toISOString()
      }
    ]
  });
};

// Handle viral video-related requests
const handleViralVideoRequest = async (event, requestBody) => {
  // Mock viral video response
  return createApiResponse({
    message: 'Viral video request processed successfully',
    videos: [
      {
        id: 'viral1',
        title: 'Trending Video 1',
        description: 'This is a trending video',
        url: 'https://youtube.com/watch?v=trending1',
        thumbnail: 'https://example.com/trending1.jpg',
        views: 1000000,
        likes: 50000,
        viralScore: 0.95,
        createdAt: new Date().toISOString()
      },
      {
        id: 'viral2',
        title: 'Trending Video 2',
        description: 'This is another trending video',
        url: 'https://youtube.com/watch?v=trending2',
        thumbnail: 'https://example.com/trending2.jpg',
        views: 2000000,
        likes: 100000,
        viralScore: 0.98,
        createdAt: new Date().toISOString()
      }
    ]
  });
};

// Handle pricing-related requests
const handlePricingRequest = async (event) => {
  // Mock pricing response
  return createApiResponse({
    plans: [
      {
        id: 'free',
        name: 'Free Trial',
        price: 0,
        features: [
          'Limited video generation (5 videos)',
          '1GB storage',
          'Basic analytics',
          'Weekly content scheduling',
          '7-day trial of all features'
        ]
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 1999,
        features: [
          'Unlimited video generation',
          '5GB storage',
          'Basic analytics',
          'Weekly content scheduling',
          'Email support'
        ]
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 4999,
        features: [
          'Unlimited video generation',
          '20GB storage',
          'Advanced analytics',
          'Daily content scheduling',
          'Priority email support',
          'Custom branding options'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 9999,
        features: [
          'Unlimited video generation',
          '50GB storage',
          'Premium analytics',
          'Hourly content scheduling',
          'Dedicated support',
          'Custom branding options',
          'Viral video rebranding',
          'Multi-channel management'
        ]
      }
    ]
  });
};
