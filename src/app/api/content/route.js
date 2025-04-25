'use server';

import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import { openaiApi } from '../openai-api';
import { elevenlabsApi } from '../elevenlabs-api';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize YouTube client
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY || ''
});

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
      console.error('Content API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// YouTube functions
const searchVideos = async (query, maxResults = 10) => {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults,
      type: 'video'
    });
    
    return response.data.items;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

// API route handler
export const POST = withErrorHandling(async (request) => {
  const { action, topic, text, voiceId, query, length, tone } = await request.json();
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Generate script
  if (action === 'generate-script') {
    if (!topic) {
      return createApiError('Topic is required', 400);
    }
    
    try {
      const scriptContent = await openaiApi.generateScript(topic, length, tone);
      return createApiResponse({ script: scriptContent });
    } catch (error) {
      return createApiError(`Error generating script: ${error.message}`, 500);
    }
  }
  
  // Generate speech
  if (action === 'generate-speech') {
    if (!text || !voiceId) {
      return createApiError('Text and voice ID are required', 400);
    }
    
    try {
      const audioBuffer = await elevenlabsApi.generateSpeech(text, voiceId);
      
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
  
  // Search videos
  if (action === 'search-videos') {
    if (!query) {
      return createApiError('Query is required', 400);
    }
    
    try {
      const videos = await searchVideos(query);
      return createApiResponse({ videos });
    } catch (error) {
      return createApiError(`Error searching videos: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
