'use server';

import { google } from 'googleapis';
import { uploadToS3, deleteFromS3 } from '../s3-storage';
import { sendEmail } from '../email/sendgrid';

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

/**
 * Generate a YouTube channel for a user
 * @param {string} email - User's email
 * @param {string} channelName - Desired channel name
 * @param {string} description - Channel description
 * @param {string} logoUrl - URL to logo image
 * @returns {Promise<Object>} - Channel creation result
 */
async function generateYouTubeChannel(email, channelName, description, logoUrl) {
  try {
    // In a production environment, this would use the YouTube API to create a channel
    // For this demo, we'll simulate the process and return mock data
    
    // Generate a mock API key
    const apiKey = `AIza${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Mock channel data
    const channelData = {
      id: `UC${Math.random().toString(36).substring(2, 12)}`,
      title: channelName,
      description: description,
      customUrl: `@${channelName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      thumbnails: {
        default: { url: logoUrl },
        medium: { url: logoUrl },
        high: { url: logoUrl }
      },
      statistics: {
        viewCount: "0",
        subscriberCount: "0",
        videoCount: "0"
      },
      apiKey: apiKey,
      email: email
    };
    
    // Send confirmation email
    await sendEmail({
      to: email,
      subject: 'Your YouTube Channel Has Been Created!',
      text: `Congratulations! Your YouTube channel "${channelName}" has been created. Your API key is: ${apiKey}`,
      html: `
        <h1>Congratulations!</h1>
        <p>Your YouTube channel <strong>${channelName}</strong> has been created successfully.</p>
        <p>Here are your channel details:</p>
        <ul>
          <li><strong>Channel ID:</strong> ${channelData.id}</li>
          <li><strong>Custom URL:</strong> ${channelData.customUrl}</li>
          <li><strong>API Key:</strong> ${apiKey}</li>
        </ul>
        <p>You can now use this API key to manage your YouTube channel through our platform.</p>
        <p>Thank you for choosing our service!</p>
      `
    });
    
    return { success: true, channel: channelData };
  } catch (error) {
    console.error('Error generating YouTube channel:', error);
    return { success: false, error: error.message || 'Failed to generate YouTube channel' };
  }
}

/**
 * Generate a logo for a YouTube channel
 * @param {string} channelName - Channel name
 * @param {string} color - Primary color
 * @returns {Promise<Object>} - Logo generation result
 */
async function generateChannelLogo(channelName, color) {
  try {
    // In a production environment, this would use an image generation API
    // For this demo, we'll use a placeholder image and store it in S3
    
    // Generate a mock logo URL (in production, this would be a real image)
    const logoUrl = `https://via.placeholder.com/800x800/${color.replace('#', '')}/${getContrastYIQ(color.replace('#', ''))}?text=${encodeURIComponent(channelName.substring(0, 2).toUpperCase())}`;
    
    // In a real implementation, we would download the image and upload it to S3
    // For demo purposes, we'll just return the placeholder URL
    return { success: true, logoUrl };
  } catch (error) {
    console.error('Error generating channel logo:', error);
    return { success: false, error: error.message || 'Failed to generate channel logo' };
  }
}

// Helper function to determine text color based on background
function getContrastYIQ(hexcolor) {
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '000000' : 'ffffff';
}

// API route handler
export const POST = withErrorHandling(async (request) => {
  const { action, userId, email, channelName, description, color, plan } = await request.json();
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Check if user has Pro or Enterprise plan
  if (plan !== 'pro' && plan !== 'enterprise') {
    return createApiError('YouTube channel creation is only available for Pro and Enterprise plans', 403);
  }
  
  // Create YouTube channel
  if (action === 'create-channel') {
    if (!userId || !email || !channelName) {
      return createApiError('User ID, email, and channel name are required', 400);
    }
    
    try {
      // Generate logo
      const logoResult = await generateChannelLogo(channelName, color || '#FF0000');
      
      if (!logoResult.success) {
        return createApiError(`Error generating logo: ${logoResult.error}`, 500);
      }
      
      // Generate YouTube channel
      const channelResult = await generateYouTubeChannel(
        email,
        channelName,
        description || `${channelName} - Created with TubeAutomator`,
        logoResult.logoUrl
      );
      
      if (!channelResult.success) {
        return createApiError(`Error creating channel: ${channelResult.error}`, 500);
      }
      
      return createApiResponse({ 
        channel: channelResult.channel,
        message: 'YouTube channel created successfully! Check your email for details.'
      });
    } catch (error) {
      return createApiError(`Error creating YouTube channel: ${error.message}`, 500);
    }
  }
  
  // Get channel details
  if (action === 'get-channel') {
    if (!userId) {
      return createApiError('User ID is required', 400);
    }
    
    try {
      // In a real implementation, you would fetch the channel from a database
      // For demo purposes, we'll return mock data
      
      // Check if the user has a channel (50% chance for demo)
      const hasChannel = Math.random() > 0.5;
      
      if (!hasChannel) {
        return createApiResponse({ hasChannel: false });
      }
      
      const mockChannel = {
        id: `UC${Math.random().toString(36).substring(2, 12)}`,
        title: `${email.split('@')[0]}'s Channel`,
        description: 'This is my awesome YouTube channel created with TubeAutomator!',
        customUrl: `@${email.split('@')[0].toLowerCase()}`,
        thumbnails: {
          default: { url: `https://via.placeholder.com/88/FF0000/FFFFFF?text=${email.substring(0, 2).toUpperCase()}` },
          medium: { url: `https://via.placeholder.com/240/FF0000/FFFFFF?text=${email.substring(0, 2).toUpperCase()}` },
          high: { url: `https://via.placeholder.com/800/FF0000/FFFFFF?text=${email.substring(0, 2).toUpperCase()}` }
        },
        statistics: {
          viewCount: Math.floor(Math.random() * 1000).toString(),
          subscriberCount: Math.floor(Math.random() * 100).toString(),
          videoCount: Math.floor(Math.random() * 10).toString()
        },
        apiKey: `AIza${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        email: email
      };
      
      return createApiResponse({ 
        hasChannel: true,
        channel: mockChannel
      });
    } catch (error) {
      return createApiError(`Error fetching channel: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
