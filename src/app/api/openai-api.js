'use server';

import { OpenAI } from 'openai';

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
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
      console.error('OpenAI API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// OpenAI API functions object - export this for importing in other files
export const openaiApi = {
  // Generate video script
  generateScript: async (topic, length = 'medium', tone = 'informative') => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional YouTube script writer. Create a ${length} length script in a ${tone} tone.`
          },
          {
            role: "user",
            content: `Write a YouTube script about: ${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating script:', error);
      throw error;
    }
  },

  // Generate video title and description
  generateMetadata: async (script) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a YouTube SEO expert. Create an engaging title and description based on the provided script."
          },
          {
            role: "user",
            content: `Generate a catchy title (max 60 chars) and description (max 200 chars) for this script: ${script.substring(0, 1000)}...`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });
      
      const content = response.choices[0].message.content;
      const titleMatch = content.match(/Title:(.*?)(?=Description:|$)/s);
      const descriptionMatch = content.match(/Description:(.*?)(?=$)/s);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : "Generated Video Title",
        description: descriptionMatch ? descriptionMatch[1].trim() : "Generated video description with key information about the content."
      };
    } catch (error) {
      console.error('Error generating metadata:', error);
      throw error;
    }
  }
};

// Also export individual functions for backward compatibility
export const generateScript = openaiApi.generateScript;
export const generateMetadata = openaiApi.generateMetadata;

// API route handler
export const POST = withErrorHandling(async (request) => {
  const { action, topic, script, length, tone } = await request.json();
  
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
  
  // Generate metadata
  if (action === 'generate-metadata') {
    if (!script) {
      return createApiError('Script is required', 400);
    }
    
    try {
      const metadata = await openaiApi.generateMetadata(script);
      return createApiResponse({ metadata });
    } catch (error) {
      return createApiError(`Error generating metadata: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
