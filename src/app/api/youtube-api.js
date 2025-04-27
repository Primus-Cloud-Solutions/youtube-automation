import { google } from 'googleapis';

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
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
      console.error('YouTube API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Search for videos
export const searchVideos = async (query, maxResults = 10) => {
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

// Get video details
export const getVideoDetails = async (videoId) => {
  try {
    const response = await youtube.videos.list({
      part: 'snippet,contentDetails,statistics',
      id: videoId
    });
    
    return response.data.items[0];
  } catch (error) {
    console.error('Error getting video details:', error);
    throw error;
  }
};

// Get channel details
export const getChannelDetails = async (channelId) => {
  try {
    const response = await youtube.channels.list({
      part: 'snippet,contentDetails,statistics',
      id: channelId
    });
    
    return response.data.items[0];
  } catch (error) {
    console.error('Error getting channel details:', error);
    throw error;
  }
};

// Get trending videos
export const getTrendingVideos = async (regionCode = 'US', category = '', maxResults = 10) => {
  try {
    const params = {
      part: 'snippet,contentDetails,statistics',
      chart: 'mostPopular',
      regionCode,
      maxResults
    };
    
    if (category) {
      params.videoCategoryId = category;
    }
    
    const response = await youtube.videos.list(params);
    
    return response.data.items;
  } catch (error) {
    console.error('Error getting trending videos:', error);
    throw error;
  }
};

// API route handler
export const POST = withErrorHandling(async (request) => {
  const { action, query, videoId, channelId, regionCode, category, maxResults } = await request.json();
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  // Search videos
  if (action === 'search-videos') {
    if (!query) {
      return createApiError('Query is required', 400);
    }
    
    try {
      const videos = await searchVideos(query, maxResults);
      return createApiResponse({ videos });
    } catch (error) {
      return createApiError(`Error searching videos: ${error.message}`, 500);
    }
  }
  
  // Get video details
  if (action === 'get-video-details') {
    if (!videoId) {
      return createApiError('Video ID is required', 400);
    }
    
    try {
      const video = await getVideoDetails(videoId);
      return createApiResponse({ video });
    } catch (error) {
      return createApiError(`Error getting video details: ${error.message}`, 500);
    }
  }
  
  // Get channel details
  if (action === 'get-channel-details') {
    if (!channelId) {
      return createApiError('Channel ID is required', 400);
    }
    
    try {
      const channel = await getChannelDetails(channelId);
      return createApiResponse({ channel });
    } catch (error) {
      return createApiError(`Error getting channel details: ${error.message}`, 500);
    }
  }
  
  // Get trending videos
  if (action === 'get-trending-videos') {
    try {
      const videos = await getTrendingVideos(regionCode, category, maxResults);
      return createApiResponse({ videos });
    } catch (error) {
      return createApiError(`Error getting trending videos: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
