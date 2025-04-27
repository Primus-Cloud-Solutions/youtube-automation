'use server';

import { generateScript } from '../openai-api';
import { getVoices, generateSpeech } from '../elevenlabs-api';
import { searchVideos, getTrendingVideos } from '../youtube-api';

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
      console.error('API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// API route handler
export const POST = withErrorHandling(async (request) => {
  const data = await request.json();
  const { action, apiKey, service, userId } = data;
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Test YouTube API key
  if (action === 'test-youtube') {
    if (!apiKey) {
      return createApiError('API key is required', 400);
    }
    
    try {
      // For demo purposes, we'll just check if the key has a valid format
      // In production, you would make an actual API call to YouTube
      const isValid = apiKey.length > 20;
      
      return createApiResponse({ success: true, isValid });
    } catch (error) {
      return createApiError(`Error validating YouTube API key: ${error.message}`, 500);
    }
  }
  
  // Test OpenAI API key
  if (action === 'test-openai') {
    if (!apiKey) {
      return createApiError('API key is required', 400);
    }
    
    try {
      // For demo purposes, we'll just check if the key has a valid format
      const isValid = apiKey.startsWith('sk-') && apiKey.length > 20;
      
      return createApiResponse({ success: true, isValid });
    } catch (error) {
      return createApiError(`Error validating OpenAI API key: ${error.message}`, 500);
    }
  }
  
  // Test ElevenLabs API key
  if (action === 'test-elevenlabs') {
    if (!apiKey) {
      return createApiError('API key is required', 400);
    }
    
    try {
      // For demo purposes, we'll just check if the key has a valid format
      const isValid = apiKey.length > 20;
      
      return createApiResponse({ success: true, isValid });
    } catch (error) {
      return createApiError(`Error validating ElevenLabs API key: ${error.message}`, 500);
    }
  }
  
  // Save API keys
  if (action === 'save') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    try {
      // In a real implementation, you would save these to a database
      // For demo purposes, we'll just return success
      return createApiResponse({ 
        success: true,
        message: 'API keys saved successfully' 
      });
    } catch (error) {
      return createApiError(`Error saving API keys: ${error.message}`, 500);
    }
  }
  
  // Validate API key (legacy endpoint)
  if (action === 'validate-key') {
    if (!apiKey || !service) {
      return createApiError('API key and service are required', 400);
    }
    
    try {
      let isValid = false;
      
      // Validate based on service
      switch (service) {
        case 'openai':
          // For demo purposes, we'll just check if the key has a valid format
          isValid = apiKey.startsWith('sk-') && apiKey.length > 20;
          break;
        case 'elevenlabs':
          // Try to get voices to validate the key
          try {
            await getVoices();
            isValid = true;
          } catch (error) {
            isValid = false;
          }
          break;
        case 'youtube':
          // Try to get trending videos to validate the key
          try {
            await getTrendingVideos('US', '', 1);
            isValid = true;
          } catch (error) {
            isValid = false;
          }
          break;
        default:
          return createApiError('Invalid service', 400);
      }
      
      return createApiResponse({ isValid });
    } catch (error) {
      return createApiError(`Error validating API key: ${error.message}`, 500);
    }
  }
  
  // Get API key status
  if (action === 'get-key-status') {
    if (!service) {
      return createApiError('Service is required', 400);
    }
    
    try {
      // For demo purposes, we'll return mock data
      const keyStatus = {
        openai: {
          isConfigured: !!process.env.OPENAI_API_KEY,
          status: 'active'
        },
        elevenlabs: {
          isConfigured: !!process.env.ELEVENLABS_API_KEY,
          status: 'active'
        },
        youtube: {
          isConfigured: !!process.env.YOUTUBE_API_KEY,
          status: 'active'
        }
      };
      
      if (!keyStatus[service]) {
        return createApiError('Invalid service', 400);
      }
      
      return createApiResponse({ keyStatus: keyStatus[service] });
    } catch (error) {
      return createApiError(`Error getting API key status: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
