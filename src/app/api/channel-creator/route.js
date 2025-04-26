'use server';

import * as youtubeApi from '../../../lib/youtube-api';
import { createApiResponse, createApiError } from '../../../lib/api-helpers';
import { generateLogo, generateBanner } from './brand-generator';

/**
 * Channel Creator API
 * This API handles automated YouTube channel creation for premium users
 */

// API route handler
export async function POST(request) {
  try {
    const { 
      action, 
      userId,
      channelName,
      channelDescription,
      niche,
      oauthToken,
      logoPrompt,
      bannerPrompt,
      colorScheme,
      apiKey
    } = await request.json();
    
    if (!action) {
      return createApiError('Action is required', 400);
    }
    
    // Create a new YouTube channel
    if (action === 'create-channel') {
      if (!userId || !channelName || !niche) {
        return createApiError('User ID, channel name, and niche are required', 400);
      }
      
      try {
        // In a production environment, we would use the OAuth token
        // For development, we'll use a mock implementation
        
        // Create the channel
        const channelResult = await youtubeApi.createYouTubeChannel(
          oauthToken || 'mock-oauth-token', 
          {
            name: channelName,
            description: channelDescription || `${channelName} - ${niche} content`,
            keywords: [niche, 'YouTube', 'content creator'],
            country: 'US',
            defaultLanguage: 'en'
          }
        );
        
        if (!channelResult.success) {
          return createApiError(channelResult.error || 'Failed to create YouTube channel', 500);
        }
        
        // Generate branding assets
        const logoResult = await generateLogo(
          logoPrompt || `Logo for ${channelName}, a ${niche} YouTube channel`,
          colorScheme || 'vibrant'
        );
        
        const bannerResult = await generateBanner(
          bannerPrompt || `YouTube banner for ${channelName}, featuring ${niche} content`,
          colorScheme || 'vibrant',
          channelName
        );
        
        // In a production environment, we would upload these to the channel
        // For now, we'll return the URLs
        
        return createApiResponse({
          channelId: channelResult.channelId,
          channelUrl: channelResult.channelUrl,
          channelName: channelResult.title || channelName,
          logoUrl: logoResult.url,
          bannerUrl: bannerResult.url,
          apiKey: apiKey || 'AIza-mock-api-key-for-development',
          status: 'created'
        });
      } catch (error) {
        console.error('Error creating YouTube channel:', error);
        return createApiError(`Error creating YouTube channel: ${error.message}`, 500);
      }
    }
    
    // Update channel branding
    if (action === 'update-branding') {
      if (!userId || !apiKey || !channelName) {
        return createApiError('User ID, API key, and channel name are required', 400);
      }
      
      try {
        // Generate branding assets
        const logoResult = await generateLogo(
          logoPrompt || `Logo for ${channelName}, a ${niche} YouTube channel`,
          colorScheme || 'vibrant'
        );
        
        const bannerResult = await generateBanner(
          bannerPrompt || `YouTube banner for ${channelName}, featuring ${niche} content`,
          colorScheme || 'vibrant',
          channelName
        );
        
        // Get channel ID
        const channelsResult = await youtubeApi.getUserChannels(apiKey);
        
        if (!channelsResult.success) {
          return createApiError(channelsResult.error || 'Failed to get user channels', 500);
        }
        
        const channel = channelsResult.channels.find(c => c.title === channelName);
        
        if (!channel) {
          return createApiError(`Channel "${channelName}" not found`, 404);
        }
        
        // Update channel branding
        const brandingResult = await youtubeApi.updateChannelBranding(
          apiKey,
          channel.id,
          {
            profileImage: logoResult.buffer,
            bannerImage: bannerResult.buffer,
            watermark: logoResult.buffer
          }
        );
        
        if (!brandingResult.success) {
          return createApiError(brandingResult.error || 'Failed to update channel branding', 500);
        }
        
        return createApiResponse({
          channelId: channel.id,
          logoUrl: logoResult.url,
          bannerUrl: bannerResult.url,
          status: 'updated'
        });
      } catch (error) {
        console.error('Error updating channel branding:', error);
        return createApiError(`Error updating channel branding: ${error.message}`, 500);
      }
    }
    
    // Get user channels
    if (action === 'get-user-channels') {
      if (!userId || !apiKey) {
        return createApiError('User ID and API key are required', 400);
      }
      
      try {
        const result = await youtubeApi.getUserChannels(apiKey);
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to get user channels', 500);
        }
        
        return createApiResponse({
          channels: result.channels
        });
      } catch (error) {
        console.error('Error getting user channels:', error);
        return createApiError(`Error getting user channels: ${error.message}`, 500);
      }
    }
    
    return createApiError('Invalid action', 400);
  } catch (error) {
    console.error('Channel Creator API error:', error);
    return createApiError('Internal server error', 500);
  }
}
