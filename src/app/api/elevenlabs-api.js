'use server';

import axios from 'axios';

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

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
      console.error('ElevenLabs API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Get available voices
export const getVoices = async () => {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
};

// Generate speech from text
export const generateSpeech = async (text, voiceId) => {
  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
};

// API route handler
export const POST = withErrorHandling(async (request) => {
  const { action, text, voiceId } = await request.json();
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Get available voices
  if (action === 'get-voices') {
    try {
      const voices = await getVoices();
      return createApiResponse({ voices });
    } catch (error) {
      return createApiError(`Error fetching voices: ${error.message}`, 500);
    }
  }
  
  // Generate speech from text
  if (action === 'generate-speech') {
    if (!text || !voiceId) {
      return createApiError('Text and voice ID are required', 400);
    }
    
    try {
      const audioBuffer = await generateSpeech(text, voiceId);
      
      // In a real implementation, you would save this to a file or return it directly
      // For demo purposes, we'll just return a success message
      return createApiResponse({ 
        message: 'Speech generated successfully',
        audioUrl: '/api/audio/demo.mp3' // This would be a real URL in production
      });
    } catch (error) {
      return createApiError(`Error generating speech: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
