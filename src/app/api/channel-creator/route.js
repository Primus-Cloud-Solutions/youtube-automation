'use server';

import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import { generateChannelBranding } from './channel-creator/brand-generator';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const data = await request.json();
    const { action, userId, channelName, channelEmail, channelDescription } = data;
    
    if (!userId) {
      return Response.json({ success: false, error: 'User ID is required' });
    }
    
    // Handle different actions
    switch (action) {
      case 'create-channel':
        return await createChannel(userId, channelName, channelEmail, channelDescription);
      case 'connect-channel':
        return await connectChannel(userId, data.apiKey);
      default:
        return Response.json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Channel creator error:', error);
    return Response.json({ success: false, error: error.message || 'An error occurred' });
  }
}

// Create a new YouTube channel automatically (for premium users)
async function createChannel(userId, channelName, channelEmail, channelDescription) {
  try {
    if (!channelName || !channelEmail) {
      return Response.json({ success: false, error: 'Channel name and email are required' });
    }
    
    // Check if user has premium subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', userId)
      .single();
    
    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return Response.json({ success: false, error: 'Error verifying subscription status' });
    }
    
    // Check if user has premium or enterprise plan
    const isPremium = subscription && 
                     (subscription.plan_id === 'pro' || subscription.plan_id === 'enterprise') && 
                     subscription.status === 'active';
    
    if (!isPremium) {
      return Response.json({ 
        success: false, 
        error: 'Premium subscription required to automatically create YouTube channels' 
      });
    }
    
    // Generate channel branding (logo and banner)
    const branding = await generateChannelBranding(channelName, channelDescription);
    
    // In a real implementation, this would use OAuth2 to create a YouTube channel
    // For demo purposes, we'll simulate channel creation
    
    // Generate a mock API key
    const mockApiKey = 'AIza' + Math.random().toString(36).substring(2, 15);
    
    // Create a record in the database
    const { data: channel, error: channelError } = await supabase
      .from('youtube_channels')
      .insert([
        {
          user_id: userId,
          channel_name: channelName,
          channel_email: channelEmail,
          channel_description: channelDescription || `${channelName} - Created with TubeAutomator`,
          api_key: mockApiKey,
          logo_url: branding.logoUrl,
          banner_url: branding.bannerUrl,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (channelError) {
      console.error('Error creating channel record:', channelError);
      return Response.json({ success: false, error: 'Error saving channel information' });
    }
    
    // Save the API key to the user's API keys
    const { error: apiKeyError } = await supabase
      .from('api_keys')
      .upsert([
        {
          user_id: userId,
          youtube_api_key: mockApiKey,
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (apiKeyError) {
      console.error('Error saving API key:', apiKeyError);
      return Response.json({ success: false, error: 'Error saving API key' });
    }
    
    return Response.json({ 
      success: true, 
      message: 'YouTube channel created successfully',
      channel: {
        id: channel.id,
        name: channel.channel_name,
        description: channel.channel_description,
        logoUrl: channel.logo_url,
        bannerUrl: channel.banner_url
      },
      youtubeApiKey: mockApiKey
    });
  } catch (error) {
    console.error('Error creating YouTube channel:', error);
    return Response.json({ success: false, error: error.message || 'Error creating YouTube channel' });
  }
}

// Connect to an existing YouTube channel using API key
async function connectChannel(userId, apiKey) {
  try {
    if (!apiKey) {
      return Response.json({ success: false, error: 'API key is required' });
    }
    
    // Validate the API key by making a test request to YouTube API
    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
    
    try {
      // Try to get channel info to validate the API key
      const response = await youtube.channels.list({
        part: 'snippet,statistics',
        mine: true
      });
      
      if (!response.data.items || response.data.items.length === 0) {
        return Response.json({ success: false, error: 'No channels found for this API key' });
      }
      
      const channelData = response.data.items[0];
      
      // Save the API key to the database
      const { error: apiKeyError } = await supabase
        .from('api_keys')
        .upsert([
          {
            user_id: userId,
            youtube_api_key: apiKey,
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (apiKeyError) {
        console.error('Error saving API key:', apiKeyError);
        return Response.json({ success: false, error: 'Error saving API key' });
      }
      
      // Save the channel information
      const { error: channelError } = await supabase
        .from('youtube_channels')
        .upsert([
          {
            user_id: userId,
            channel_name: channelData.snippet.title,
            channel_description: channelData.snippet.description,
            channel_id: channelData.id,
            subscriber_count: channelData.statistics.subscriberCount,
            video_count: channelData.statistics.videoCount,
            view_count: channelData.statistics.viewCount,
            api_key: apiKey,
            logo_url: channelData.snippet.thumbnails.high.url,
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (channelError) {
        console.error('Error saving channel information:', channelError);
        return Response.json({ success: false, error: 'Error saving channel information' });
      }
      
      return Response.json({
        success: true,
        message: 'YouTube channel connected successfully',
        channel: {
          id: channelData.id,
          name: channelData.snippet.title,
          description: channelData.snippet.description,
          subscriberCount: channelData.statistics.subscriberCount,
          videoCount: channelData.statistics.videoCount,
          viewCount: channelData.statistics.viewCount,
          thumbnailUrl: channelData.snippet.thumbnails.high.url
        }
      });
    } catch (error) {
      console.error('Error validating YouTube API key:', error);
      return Response.json({ 
        success: false, 
        error: 'Invalid YouTube API key or insufficient permissions. Make sure your API key has access to the YouTube Data API.'
      });
    }
  } catch (error) {
    console.error('Error connecting YouTube channel:', error);
    return Response.json({ success: false, error: error.message || 'Error connecting YouTube channel' });
  }
}
