'use client';

/**
 * Mock YouTube API Integration
 * This module provides mock functions for interacting with the YouTube API
 * to avoid Node.js module import issues during build
 */

// Initialize YouTube API client with API key
export const initYouTubeClient = (apiKey) => {
  if (!apiKey) {
    console.error('YouTube API key is required');
    return null;
  }
  
  return {
    channels: {
      list: async (params) => mockChannelsList(params)
    },
    search: {
      list: async (params) => mockSearchList(params)
    },
    videos: {
      list: async (params) => mockVideosList(params)
    }
  };
};

// Mock channels.list response
const mockChannelsList = async (params) => {
  return {
    data: {
      items: [
        {
          kind: 'youtube#channel',
          id: 'UC_demo_channel_id',
          snippet: {
            title: 'Your YouTube Channel',
            description: 'This is your connected YouTube channel',
            customUrl: '@yourchannel',
            thumbnails: {
              default: { url: 'https://via.placeholder.com/88x88' },
              medium: { url: 'https://via.placeholder.com/240x240' },
              high: { url: 'https://via.placeholder.com/800x800' }
            }
          },
          statistics: {
            viewCount: '1024',
            subscriberCount: '256',
            videoCount: '12'
          }
        }
      ]
    }
  };
};

// Mock search.list response
const mockSearchList = async (params) => {
  return {
    data: {
      items: Array(params.maxResults || 5).fill(0).map((_, i) => ({
        kind: 'youtube#searchResult',
        id: {
          kind: 'youtube#video',
          videoId: `demo_video_id_${i}`
        },
        snippet: {
          publishedAt: new Date().toISOString(),
          channelId: 'UC_demo_channel_id',
          title: `${params.q || 'Trending'} Video ${i + 1}`,
          description: `This is a mock video about ${params.q || 'trending topics'}`,
          thumbnails: {
            default: { url: 'https://via.placeholder.com/120x90' },
            medium: { url: 'https://via.placeholder.com/320x180' },
            high: { url: 'https://via.placeholder.com/480x360' }
          },
          channelTitle: 'Demo Channel',
          publishTime: new Date().toISOString()
        }
      }))
    }
  };
};

// Mock videos.list response
const mockVideosList = async (params) => {
  return {
    data: {
      items: Array(params.maxResults || 5).fill(0).map((_, i) => ({
        kind: 'youtube#video',
        id: `demo_video_id_${i}`,
        snippet: {
          publishedAt: new Date().toISOString(),
          channelId: 'UC_demo_channel_id',
          title: `Trending Video ${i + 1}`,
          description: 'This is a mock trending video',
          thumbnails: {
            default: { url: 'https://via.placeholder.com/120x90' },
            medium: { url: 'https://via.placeholder.com/320x180' },
            high: { url: 'https://via.placeholder.com/480x360' }
          },
          channelTitle: 'Demo Channel',
          tags: ['trending', 'viral', 'popular'],
          categoryId: params.videoCategoryId || '22'
        },
        contentDetails: {
          duration: 'PT5M30S',
          dimension: '2d',
          definition: 'hd',
          caption: 'false',
          licensedContent: true
        },
        statistics: {
          viewCount: String(Math.floor(Math.random() * 1000000)),
          likeCount: String(Math.floor(Math.random() * 50000)),
          favoriteCount: '0',
          commentCount: String(Math.floor(Math.random() * 5000))
        }
      }))
    }
  };
};

// Get user's YouTube channels
export const getUserChannels = async (apiKey) => {
  try {
    if (!apiKey) {
      return { success: false, error: 'YouTube API key is required' };
    }
    
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
  } catch (error) {
    console.error('Error getting user channels:', error);
    return { success: false, error: error.message || 'Failed to get user channels' };
  }
};

// Create a new YouTube channel
export const createYouTubeChannel = async (oauthToken, channelData) => {
  try {
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
    
    return { 
      success: true, 
      videos: Array(maxResults).fill(0).map((_, i) => ({
        id: `demo_video_id_${i}`,
        snippet: {
          publishedAt: new Date().toISOString(),
          channelId: 'UC_demo_channel_id',
          title: `Trending Video ${i + 1}`,
          description: 'This is a mock trending video',
          thumbnails: {
            default: { url: 'https://via.placeholder.com/120x90' },
            medium: { url: 'https://via.placeholder.com/320x180' },
            high: { url: 'https://via.placeholder.com/480x360' }
          },
          channelTitle: 'Demo Channel',
          tags: ['trending', 'viral', 'popular'],
          categoryId: categoryId || '22'
        },
        contentDetails: {
          duration: 'PT5M30S',
          dimension: '2d',
          definition: 'hd',
          caption: 'false',
          licensedContent: true
        },
        statistics: {
          viewCount: String(Math.floor(Math.random() * 1000000)),
          likeCount: String(Math.floor(Math.random() * 50000)),
          favoriteCount: '0',
          commentCount: String(Math.floor(Math.random() * 5000))
        }
      }))
    };
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
    
    return { 
      success: true, 
      videos: Array(maxResults).fill(0).map((_, i) => ({
        kind: 'youtube#searchResult',
        id: {
          kind: 'youtube#video',
          videoId: `demo_video_id_${i}`
        },
        snippet: {
          publishedAt: new Date().toISOString(),
          channelId: 'UC_demo_channel_id',
          title: `${query} Video ${i + 1}`,
          description: `This is a mock video about ${query}`,
          thumbnails: {
            default: { url: 'https://via.placeholder.com/120x90' },
            medium: { url: 'https://via.placeholder.com/320x180' },
            high: { url: 'https://via.placeholder.com/480x360' }
          },
          channelTitle: 'Demo Channel',
          publishTime: new Date().toISOString()
        }
      }))
    };
  } catch (error) {
    console.error('Error searching videos:', error);
    return { success: false, error: error.message || 'Failed to search videos' };
  }
};

// Upload a video to YouTube
export const uploadVideo = async (apiKey, videoData) => {
  try {
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
    
    return { success: true };
  } catch (error) {
    console.error('Error validating YouTube API key:', error);
    return { success: false, error: error.message || 'Invalid YouTube API key' };
  }
};
