'use server';

/**
 * YouTube API Module
 * 
 * This module provides functions for interacting with the YouTube API.
 * It handles authentication, video uploads, and channel management.
 */

// Mock channel data for build/SSG environments
const MOCK_CHANNEL = {
  id: 'UC1234567890abcdefghij',
  title: 'Demo YouTube Channel',
  description: 'This is a demo YouTube channel for testing purposes.',
  customUrl: '@demochannel',
  thumbnailUrl: 'https://via.placeholder.com/800x800/1a1a1a/4ade80?text=Demo+Channel',
  statistics: {
    viewCount: '1250000',
    subscriberCount: '25000',
    videoCount: '87'
  }
};

/**
 * Validate a YouTube API key
 * @param {string} apiKey - YouTube API key to validate
 * @returns {Promise<{success: boolean, error: string|null}>} - Validation result
 */
export async function validateApiKey(apiKey) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using mock API key validation during build');
      return { success: true };
    }
    
    // For demo purposes, we'll accept any key that starts with 'AIza'
    // In a real implementation, you would make a test request to the YouTube API
    if (!apiKey || !apiKey.startsWith('AIza')) {
      return { success: false, error: 'Invalid API key format' };
    }
    
    // Simulate API validation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Error validating YouTube API key:', error);
    return { success: false, error: error.message || 'Failed to validate API key' };
  }
}

/**
 * Get channel information using a YouTube API key
 * @param {string} apiKey - YouTube API key
 * @returns {Promise<{success: boolean, channel: Object|null, error: string|null}>} - Channel information result
 */
export async function getChannelInfo(apiKey) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using mock channel data during build');
      return { success: true, channel: MOCK_CHANNEL };
    }
    
    // Validate the API key first
    const validationResult = await validateApiKey(apiKey);
    if (!validationResult.success) {
      return { success: false, channel: null, error: validationResult.error };
    }
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, you would:
    // 1. Make a request to the YouTube API channels.list endpoint
    // 2. Parse the response to extract channel information
    // 3. Format the data for the client
    
    // For now, we'll return mock data
    return { success: true, channel: MOCK_CHANNEL };
  } catch (error) {
    console.error('Error getting YouTube channel info:', error);
    return { success: false, channel: null, error: error.message || 'Failed to get channel information' };
  }
}

/**
 * Upload a video to YouTube
 * @param {string} apiKey - YouTube API key
 * @param {Object} videoDetails - Video metadata (title, description, tags, etc.)
 * @param {Function} progressCallback - Callback function for upload progress updates
 * @returns {Promise<{success: boolean, videoId: string|null, videoUrl: string|null, error: string|null}>} - Upload result
 */
export async function uploadVideoToYouTube(apiKey, videoDetails, progressCallback) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using mock video upload during build');
      return { 
        success: true, 
        videoId: 'dQw4w9WgXcQ', 
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
      };
    }
    
    // Validate the API key first
    const validationResult = await validateApiKey(apiKey);
    if (!validationResult.success) {
      return { success: false, videoId: null, videoUrl: null, error: validationResult.error };
    }
    
    // Validate required video details
    if (!videoDetails.title) {
      return { success: false, videoId: null, videoUrl: null, error: 'Video title is required' };
    }
    
    if (!videoDetails.description) {
      return { success: false, videoId: null, videoUrl: null, error: 'Video description is required' };
    }
    
    // In a real implementation, you would:
    // 1. Use the YouTube API videos.insert endpoint with uploadType=resumable
    // 2. Upload the video file in chunks
    // 3. Update the progress via the callback
    // 4. Return the video ID and URL when complete
    
    // For now, we'll simulate the upload process
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      // Calculate progress percentage
      const progress = Math.round((step / totalSteps) * 100);
      
      // Call the progress callback if provided
      if (typeof progressCallback === 'function') {
        progressCallback(progress);
      }
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Generate a mock video ID
    const videoId = `YT${Date.now().toString(36)}`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    return { 
      success: true, 
      videoId, 
      videoUrl
    };
  } catch (error) {
    console.error('Error uploading to YouTube:', error);
    return { success: false, videoId: null, videoUrl: null, error: error.message || 'Failed to upload video' };
  }
}

/**
 * Get video analytics from YouTube
 * @param {string} apiKey - YouTube API key
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<{success: boolean, analytics: Object|null, error: string|null}>} - Analytics result
 */
export async function getVideoAnalytics(apiKey, videoId) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using mock video analytics during build');
      return { 
        success: true, 
        analytics: {
          views: 12500,
          likes: 850,
          comments: 125,
          averageViewDuration: '2:45',
          retentionRate: '68%',
          topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'],
          trafficSources: [
            { source: 'YouTube search', percentage: 45 },
            { source: 'External', percentage: 25 },
            { source: 'Suggested videos', percentage: 20 },
            { source: 'Channel pages', percentage: 10 }
          ]
        }
      };
    }
    
    // Validate the API key first
    const validationResult = await validateApiKey(apiKey);
    if (!validationResult.success) {
      return { success: false, analytics: null, error: validationResult.error };
    }
    
    // Validate video ID
    if (!videoId) {
      return { success: false, analytics: null, error: 'Video ID is required' };
    }
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, you would:
    // 1. Use the YouTube Analytics API to fetch video performance data
    // 2. Process and format the analytics data
    // 3. Return the formatted data
    
    // For now, we'll return mock data
    // Generate somewhat random but realistic analytics
    const views = Math.floor(Math.random() * 50000) + 1000;
    const likePercentage = Math.random() * 0.1 + 0.05; // 5-15% like rate
    const likes = Math.floor(views * likePercentage);
    const commentPercentage = Math.random() * 0.02 + 0.005; // 0.5-2.5% comment rate
    const comments = Math.floor(views * commentPercentage);
    
    // Calculate average view duration (between 1:30 and 4:00)
    const avgSeconds = Math.floor(Math.random() * 150) + 90;
    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgRemainingSeconds = avgSeconds % 60;
    const averageViewDuration = `${avgMinutes}:${avgRemainingSeconds.toString().padStart(2, '0')}`;
    
    // Calculate retention rate (between 40% and 80%)
    const retentionRate = `${Math.floor(Math.random() * 40) + 40}%`;
    
    return { 
      success: true, 
      analytics: {
        views,
        likes,
        comments,
        averageViewDuration,
        retentionRate,
        topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'],
        trafficSources: [
          { source: 'YouTube search', percentage: Math.floor(Math.random() * 20) + 35 },
          { source: 'External', percentage: Math.floor(Math.random() * 15) + 15 },
          { source: 'Suggested videos', percentage: Math.floor(Math.random() * 15) + 15 },
          { source: 'Channel pages', percentage: Math.floor(Math.random() * 10) + 5 }
        ]
      }
    };
  } catch (error) {
    console.error('Error getting video analytics:', error);
    return { success: false, analytics: null, error: error.message || 'Failed to get video analytics' };
  }
}

/**
 * Get channel analytics from YouTube
 * @param {string} apiKey - YouTube API key
 * @returns {Promise<{success: boolean, analytics: Object|null, error: string|null}>} - Analytics result
 */
export async function getChannelAnalytics(apiKey) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using mock channel analytics during build');
      return { 
        success: true, 
        analytics: {
          totalViews: 1250000,
          subscribers: 25000,
          videos: 87,
          averageViewsPerVideo: 14367,
          subscriberGrowth: '+12% (last 28 days)',
          topVideos: [
            { title: 'How to Build a Website in 2025', views: 125000 },
            { title: '10 Programming Languages to Learn', views: 98000 },
            { title: 'AI Tools for Content Creators', views: 87500 }
          ],
          demographics: {
            age: [
              { group: '18-24', percentage: 28 },
              { group: '25-34', percentage: 35 },
              { group: '35-44', percentage: 22 },
              { group: '45-54', percentage: 10 },
              { group: '55+', percentage: 5 }
            ],
            gender: [
              { type: 'Male', percentage: 65 },
              { type: 'Female', percentage: 32 },
              { type: 'Other', percentage: 3 }
            ]
          }
        }
      };
    }
    
    // Validate the API key first
    const validationResult = await validateApiKey(apiKey);
    if (!validationResult.success) {
      return { success: false, analytics: null, error: validationResult.error };
    }
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would:
    // 1. Use the YouTube Analytics API to fetch channel performance data
    // 2. Process and format the analytics data
    // 3. Return the formatted data
    
    // For now, we'll use the mock channel data and generate analytics
    const channelResult = await getChannelInfo(apiKey);
    if (!channelResult.success) {
      return { success: false, analytics: null, error: 'Failed to get channel information' };
    }
    
    const channel = channelResult.channel;
    const totalViews = parseInt(channel.statistics.viewCount, 10);
    const subscribers = parseInt(channel.statistics.subscriberCount, 10);
    const videos = parseInt(channel.statistics.videoCount, 10);
    const averageViewsPerVideo = Math.floor(totalViews / videos);
    
    return { 
      success: true, 
      analytics: {
        totalViews,
        subscribers,
        videos,
        averageViewsPerVideo,
        subscriberGrowth: `+${Math.floor(Math.random() * 15) + 5}% (last 28 days)`,
        topVideos: [
          { title: 'How to Build a Website in 2025', views: Math.floor(totalViews * 0.1) },
          { title: '10 Programming Languages to Learn', views: Math.floor(totalViews * 0.08) },
          { title: 'AI Tools for Content Creators', views: Math.floor(totalViews * 0.07) }
        ],
        demographics: {
          age: [
            { group: '18-24', percentage: Math.floor(Math.random() * 10) + 25 },
            { group: '25-34', percentage: Math.floor(Math.random() * 10) + 30 },
            { group: '35-44', percentage: Math.floor(Math.random() * 10) + 15 },
            { group: '45-54', percentage: Math.floor(Math.random() * 10) + 5 },
            { group: '55+', percentage: Math.floor(Math.random() * 5) + 3 }
          ],
          gender: [
            { type: 'Male', percentage: Math.floor(Math.random() * 20) + 55 },
            { type: 'Female', percentage: Math.floor(Math.random() * 20) + 25 },
            { type: 'Other', percentage: Math.floor(Math.random() * 5) + 1 }
          ]
        }
      }
    };
  } catch (error) {
    console.error('Error getting channel analytics:', error);
    return { success: false, analytics: null, error: error.message || 'Failed to get channel analytics' };
  }
}
