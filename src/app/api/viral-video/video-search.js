import { google } from 'googleapis';
import { analyzeTrends } from '@/lib/trend-analyzer';

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
});

/**
 * Search for viral videos based on trending topics
 * @param {string} category - Content category
 * @param {number} minViews - Minimum view count
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} - Array of viral videos
 */
export async function searchViralVideos(category, minViews = 100000, maxResults = 10) {
  try {
    // Get trending topics for the category
    const trendsResult = await analyzeTrends(category, 5, YOUTUBE_API_KEY);
    
    if (!trendsResult.success) {
      throw new Error('Failed to analyze trends');
    }
    
    const trendingTopics = trendsResult.trends;
    let allVideos = [];
    
    // Search for videos for each trending topic
    for (const topic of trendingTopics) {
      const response = await youtube.search.list({
        part: 'snippet',
        q: topic.title,
        maxResults: 5,
        type: 'video',
        videoDuration: 'medium', // Medium length videos (4-20 minutes)
        order: 'viewCount'       // Sort by view count
      });
      
      // Get video IDs
      const videoIds = response.data.items.map(item => item.id.videoId);
      
      // Get detailed video information
      const videoDetailsResponse = await youtube.videos.list({
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(',')
      });
      
      // Filter videos by view count
      const viralVideos = videoDetailsResponse.data.items.filter(
        video => parseInt(video.statistics.viewCount) >= minViews
      );
      
      // Add trending topic information to each video
      viralVideos.forEach(video => {
        video.trendTopic = topic.title;
        video.trendScore = topic.score;
      });
      
      allVideos = [...allVideos, ...viralVideos];
    }
    
    // Sort by view count and limit results
    allVideos.sort((a, b) => parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount));
    return allVideos.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching viral videos:', error);
    throw error;
  }
}

/**
 * Get video download URL
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} - Video download URL
 */
export async function getVideoDownloadUrl(videoId) {
  try {
    // In a real implementation, you would use a service like youtube-dl or a similar API
    // For now, we'll return a mock URL
    return `https://api.example.com/download?videoId=${videoId}`;
  } catch (error) {
    console.error('Error getting video download URL:', error);
    throw error;
  }
}

/**
 * Check if a video is suitable for rebranding
 * @param {Object} video - Video object
 * @returns {Promise<{suitable: boolean, reasons: Array}>} - Suitability result
 */
export async function checkVideoSuitability(video) {
  try {
    const reasons = [];
    let suitable = true;
    
    // Check video duration (should be between 3-15 minutes for optimal rebranding)
    const duration = video.contentDetails.duration;
    const durationInSeconds = parseDuration(duration);
    
    if (durationInSeconds < 180) {
      reasons.push('Video is too short (less than 3 minutes)');
      suitable = false;
    }
    
    if (durationInSeconds > 900) {
      reasons.push('Video is too long (more than 15 minutes)');
      suitable = false;
    }
    
    // Check if video has enough engagement
    const viewCount = parseInt(video.statistics.viewCount);
    const likeCount = parseInt(video.statistics.likeCount) || 0;
    const commentCount = parseInt(video.statistics.commentCount) || 0;
    
    const engagementRate = (likeCount + commentCount) / viewCount;
    
    if (engagementRate < 0.01) {
      reasons.push('Low engagement rate (less than 1%)');
      suitable = false;
    }
    
    // Check if video title contains problematic keywords
    const problematicKeywords = ['copyright', 'exclusive', 'official', 'original'];
    const title = video.snippet.title.toLowerCase();
    
    for (const keyword of problematicKeywords) {
      if (title.includes(keyword)) {
        reasons.push(`Title contains potentially problematic keyword: "${keyword}"`);
        suitable = false;
      }
    }
    
    return { suitable, reasons };
  } catch (error) {
    console.error('Error checking video suitability:', error);
    throw error;
  }
}

/**
 * Parse ISO 8601 duration to seconds
 * @param {string} duration - ISO 8601 duration string
 * @returns {number} - Duration in seconds
 */
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match[1] && parseInt(match[1])) || 0;
  const minutes = (match[2] && parseInt(match[2])) || 0;
  const seconds = (match[3] && parseInt(match[3])) || 0;
  
  return hours * 3600 + minutes * 60 + seconds;
}
