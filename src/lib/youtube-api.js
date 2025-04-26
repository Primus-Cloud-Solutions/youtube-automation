// YouTube API integration helper functions

/**
 * Validates a YouTube API key by making a test request
 * @param {string} apiKey - The YouTube API key to validate
 * @returns {Promise<{valid: boolean, error: string|null}>} - Result of validation
 */
export const validateYouTubeApiKey = async (apiKey) => {
  try {
    // In a real implementation, this would make an actual API call to YouTube
    // For demo purposes, we'll simulate the validation
    
    if (!apiKey || apiKey.trim().length < 10) {
      return { valid: false, error: 'API key is too short or invalid' };
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, we'll consider any key that starts with 'AIza' as valid
    // In a real implementation, this would check against the actual YouTube API
    if (apiKey.startsWith('AIza')) {
      return { valid: true, error: null };
    }
    
    return { valid: false, error: 'Invalid API key format' };
  } catch (error) {
    console.error('Error validating YouTube API key:', error);
    return { valid: false, error: error.message || 'Failed to validate API key' };
  }
};

/**
 * Uploads a video to YouTube
 * @param {string} apiKey - YouTube API key
 * @param {Object} videoData - Video data including title, description, etc.
 * @param {Function} progressCallback - Callback for upload progress updates
 * @returns {Promise<{success: boolean, videoId: string|null, error: string|null}>} - Upload result
 */
export const uploadVideoToYouTube = async (apiKey, videoData, progressCallback) => {
  try {
    if (!apiKey) {
      return { success: false, videoId: null, error: 'YouTube API key is required' };
    }
    
    if (!videoData || !videoData.title) {
      return { success: false, videoId: null, error: 'Video data is incomplete' };
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        progressCallback(progress);
      }
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 500);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Clear interval just in case
    clearInterval(interval);
    
    // Ensure 100% progress is reported
    progressCallback(100);
    
    // In a real implementation, this would return the actual YouTube video ID and URL
    return { 
      success: true, 
      videoId: `youtube-${Date.now()}`,
      videoUrl: `https://youtube.com/watch?v=demo-${Date.now()}`,
      error: null 
    };
  } catch (error) {
    console.error('Error uploading to YouTube:', error);
    return { success: false, videoId: null, error: error.message || 'Failed to upload video' };
  }
};

/**
 * Gets YouTube channel information
 * @param {string} apiKey - YouTube API key
 * @returns {Promise<{success: boolean, channelInfo: Object|null, error: string|null}>} - Channel info
 */
export const getYouTubeChannelInfo = async (apiKey) => {
  try {
    if (!apiKey) {
      return { success: false, channelInfo: null, error: 'YouTube API key is required' };
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock channel data for demo purposes
    const mockChannelInfo = {
      id: 'UC1234567890',
      title: 'Demo YouTube Channel',
      description: 'This is a demo YouTube channel for testing purposes',
      customUrl: '@demochannel',
      publishedAt: '2020-01-01T00:00:00Z',
      thumbnails: {
        default: 'https://via.placeholder.com/88x88',
        medium: 'https://via.placeholder.com/240x240',
        high: 'https://via.placeholder.com/800x800'
      },
      statistics: {
        viewCount: '12500',
        subscriberCount: '1250',
        videoCount: '45'
      }
    };
    
    return { success: true, channelInfo: mockChannelInfo, error: null };
  } catch (error) {
    console.error('Error getting YouTube channel info:', error);
    return { success: false, channelInfo: null, error: error.message || 'Failed to get channel info' };
  }
};
