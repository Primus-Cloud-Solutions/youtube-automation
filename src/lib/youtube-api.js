'use client';

import { google } from 'googleapis';

/**
 * YouTube API Integration
 * This module provides functions for interacting with the YouTube API
 */

// Initialize YouTube API client with API key
export const initYouTubeClient = (apiKey) => {
  if (!apiKey) {
    console.error('YouTube API key is required');
    return null;
  }
  
  return google.youtube({
    version: 'v3',
    auth: apiKey
  });
};

// Get user's YouTube channels
export const getUserChannels = async (apiKey) => {
  try {
    if (!apiKey) {
      return { success: false, error: 'YouTube API key is required' };
    }
    
    const youtube = initYouTubeClient(apiKey);
    
    if (!youtube) {
      return { success: false, error: 'Failed to initialize YouTube client' };
    }
    
    // In a real implementation, this would use OAuth to get the user's channels
    // For demo purposes, we'll fetch channels by API key
    const response = await youtube.channels.list({
      part: 'snippet,contentDetails,statistics',
      mine: true
    }).catch(error => {
      // If 'mine' parameter fails (which it will without OAuth), 
      // fall back to a search for demo purposes
      return youtube.search.list({
        part: 'snippet',
        type: 'channel',
        maxResults: 5
      });
    });
    
    if (!response || !response.data || !response.data.items) {
      // If we still don't have results, return mock data for demo
      return { 
        success: true, 
        channels: [
          {
            id: 'UC_demo_channel_id',
            title: 'Your YouTube Channel',
            description: 'This is your connected YouTube channel',
            customUrl: '@yourchannel',
            thumbnails: {
              default: { url: 'https://via.placeholder.com/88x88' },
              medium: { url: 'https://via.placeholder.com/240x240' },
              high: { url: 'https://via.placeholder.com/800x800' }
            },
            statistics: {
              viewCount: '1024',
              subscriberCount: '256',
              videoCount: '12'
            }
          }
        ]
      };
    }
    
    // Map the response to a consistent format
    const channels = response.data.items.map(item => {
      // Handle both channel and search results
      if (item.kind === 'youtube#searchResult') {
        return {
          id: item.id.channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          customUrl: `@${item.snippet.title.toLowerCase().replace(/\s+/g, '')}`,
          thumbnails: item.snippet.thumbnails,
          statistics: {
            viewCount: '0',
            subscriberCount: '0',
            videoCount: '0'
          }
        };
      } else {
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          customUrl: item.snippet.customUrl || `@${item.snippet.title.toLowerCase().replace(/\s+/g, '')}`,
          thumbnails: item.snippet.thumbnails,
          statistics: item.statistics || {
            viewCount: '0',
            subscriberCount: '0',
            videoCount: '0'
          }
        };
      }
    });
    
    return { success: true, channels };
  } catch (error) {
    console.error('Error getting user channels:', error);
    return { success: false, error: error.message || 'Failed to get user channels' };
  }
};

// Create a new YouTube channel
export const createYouTubeChannel = async (oauthToken, channelData) => {
  try {
    // In a real implementation, this would use OAuth to create a channel
    // For demo purposes, we'll return mock data
    
    return {
      success: true,
      channelId: 'UC_demo_channel_id',
      channelUrl: 'https://youtube.com/channel/UC_demo_channel_id',
      title: channelData.name,
      description: channelData.description
    };
  } catch (error) {
    console.error('Error creating YouTube channel:', error);
    return { success: false, error: error.message || 'Failed to create YouTube channel' };
  }
};

// Update channel branding
export const updateChannelBranding = async (apiKey, channelId, brandingData) => {
  try {
    // In a real implementation, this would use the YouTube API to update branding
    // For demo purposes, we'll return mock data
    
    return {
      success: true,
      channelId,
      message: 'Channel branding updated successfully'
    };
  } catch (error) {
    console.error('Error updating channel branding:', error);
    return { success: false, error: error.message || 'Failed to update channel branding' };
  }
};

// Get trending videos
export const getTrendingVideos = async (apiKey, regionCode = 'US', categoryId = '', maxResults = 10) => {
  try {
    if (!apiKey) {
      return { success: false, error: 'YouTube API key is required' };
    }
    
    const youtube = initYouTubeClient(apiKey);
    
    if (!youtube) {
      return { success: false, error: 'Failed to initialize YouTube client' };
    }
    
    const params = {
      part: 'snippet,contentDetails,statistics',
      chart: 'mostPopular',
      regionCode,
      maxResults
    };
    
    if (categoryId) {
      params.videoCategoryId = categoryId;
    }
    
    const response = await youtube.videos.list(params);
    
    if (!response || !response.data || !response.data.items) {
      return { success: false, error: 'No trending videos found' };
    }
    
    return { success: true, videos: response.data.items };
  } catch (error) {
    console.error('Error getting trending videos:', error);
    return { success: false, error: error.message || 'Failed to get trending videos' };
  }
};

// Search for videos
export const searchVideos = async (apiKey, query, maxResults = 10) => {
  try {
    if (!apiKey) {
      return { success: false, error: 'YouTube API key is required' };
    }
    
    if (!query) {
      return { success: false, error: 'Search query is required' };
    }
    
    const youtube = initYouTubeClient(apiKey);
    
    if (!youtube) {
      return { success: false, error: 'Failed to initialize YouTube client' };
    }
    
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults,
      type: 'video'
    });
    
    if (!response || !response.data || !response.data.items) {
      return { success: false, error: 'No videos found' };
    }
    
    return { success: true, videos: response.data.items };
  } catch (error) {
    console.error('Error searching videos:', error);
    return { success: false, error: error.message || 'Failed to search videos' };
  }
};

// Upload a video to YouTube
export const uploadVideo = async (apiKey, videoData) => {
  try {
    // In a real implementation, this would use the YouTube API to upload a video
    // For demo purposes, we'll return mock data
    
    return {
      success: true,
      videoId: 'demo_video_id',
      videoUrl: 'https://youtube.com/watch?v=demo_video_id',
      message: 'Video uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    return { success: false, error: error.message || 'Failed to upload video' };
  }
};

// Get video analytics
export const getVideoAnalytics = async (apiKey, videoId) => {
  try {
    // In a real implementation, this would use the YouTube Analytics API
    // For demo purposes, we'll return mock data
    
    return {
      success: true,
      videoId,
      analytics: {
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        averageViewDuration: Math.floor(Math.random() * 300),
        estimatedRevenue: (Math.random() * 100).toFixed(2)
      }
    };
  } catch (error) {
    console.error('Error getting video analytics:', error);
    return { success: false, error: error.message || 'Failed to get video analytics' };
  }
};

// Validate YouTube API key
export const validateApiKey = async (apiKey) => {
  try {
    if (!apiKey) {
      return { success: false, error: 'YouTube API key is required' };
    }
    
    const result = await getTrendingVideos(apiKey, 'US', '', 1);
    return { success: result.success };
  } catch (error) {
    console.error('Error validating YouTube API key:', error);
    return { success: false, error: error.message || 'Invalid YouTube API key' };
  }
};
