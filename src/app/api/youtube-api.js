// api/youtube-api.js
import { google } from 'googleapis';
import { supabase } from '../../supabase-auth-setup';

// Initialize YouTube API client
export const initializeYouTubeClient = (apiKey) => {
  return google.youtube({
    version: 'v3',
    auth: apiKey
  });
};

// Initialize YouTube API client with OAuth
export const initializeYouTubeOAuthClient = (oauthClient) => {
  return google.youtube({
    version: 'v3',
    auth: oauthClient
  });
};

export const youtubeApi = {
  // Test YouTube API key
  testApiKey: async (apiKey) => {
    try {
      const youtube = initializeYouTubeClient(apiKey);
      
      // Make a simple request to test the API key
      const response = await youtube.channels.list({
        part: 'snippet',
        mine: false,
        maxResults: 1,
        forUsername: 'GoogleDevelopers' // Use a known channel as a test
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('YouTube API key test error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to validate YouTube API key' 
      };
    }
  },
  
  // Get user's YouTube channels
  getUserChannels: async (apiKey) => {
    try {
      const youtube = initializeYouTubeClient(apiKey);
      
      const response = await youtube.channels.list({
        part: 'snippet,statistics,contentDetails',
        mine: true
      });
      
      return { success: true, channels: response.data.items };
    } catch (error) {
      console.error('Error getting user channels:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get YouTube channels' 
      };
    }
  },
  
  // Get channel videos
  getChannelVideos: async (apiKey, channelId, maxResults = 50) => {
    try {
      const youtube = initializeYouTubeClient(apiKey);
      
      // First get the uploads playlist ID
      const channelResponse = await youtube.channels.list({
        part: 'contentDetails',
        id: channelId
      });
      
      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Then get the videos from that playlist
      const videosResponse = await youtube.playlistItems.list({
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults
      });
      
      return { success: true, videos: videosResponse.data.items };
    } catch (error) {
      console.error('Error getting channel videos:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get channel videos' 
      };
    }
  },
  
  // Get video statistics
  getVideoStats: async (apiKey, videoId) => {
    try {
      const youtube = initializeYouTubeClient(apiKey);
      
      const response = await youtube.videos.list({
        part: 'statistics,snippet',
        id: videoId
      });
      
      return { success: true, stats: response.data.items[0] };
    } catch (error) {
      console.error('Error getting video stats:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get video statistics' 
      };
    }
  },
  
  // Upload a video to YouTube (requires OAuth)
  uploadVideo: async (oauthClient, videoFile, metadata) => {
    try {
      const youtube = initializeYouTubeOAuthClient(oauthClient);
      
      const response = await youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId || '22' // People & Blogs by default
          },
          status: {
            privacyStatus: metadata.privacyStatus || 'private'
          }
        },
        media: {
          body: videoFile
        }
      });
      
      return { success: true, video: response.data };
    } catch (error) {
      console.error('Error uploading video:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to upload video' 
      };
    }
  },
  
  // Schedule a video for publishing
  scheduleVideo: async (userId, videoData) => {
    try {
      // Save video schedule to database
      const { data, error } = await supabase
        .from('scheduled_videos')
        .insert({
          user_id: userId,
          title: videoData.title,
          description: videoData.description,
          category: videoData.category,
          tags: videoData.tags,
          scheduled_time: videoData.scheduledTime,
          status: 'scheduled',
          created_at: new Date()
        });
      
      if (error) throw error;
      
      return { success: true, scheduledVideo: data };
    } catch (error) {
      console.error('Error scheduling video:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to schedule video' 
      };
    }
  },
  
  // Get trending topics in a category
  getTrendingTopics: async (apiKey, category) => {
    try {
      const youtube = initializeYouTubeClient(apiKey);
      
      // Map our categories to YouTube category IDs
      const categoryMap = {
        'technology': '28',
        'gaming': '20',
        'education': '27',
        'entertainment': '24',
        'science': '28', // Science & Technology
        'finance': '22'  // People & Blogs (closest match)
      };
      
      const videoCategoryId = categoryMap[category] || '0';
      
      // Get trending videos in the category
      const response = await youtube.videos.list({
        part: 'snippet,statistics',
        chart: 'mostPopular',
        videoCategoryId,
        maxResults: 50,
        regionCode: 'US'
      });
      
      // Extract topics from video titles and tags
      const videos = response.data.items;
      const topics = extractTopicsFromVideos(videos);
      
      return { success: true, topics };
    } catch (error) {
      console.error('Error getting trending topics:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get trending topics' 
      };
    }
  }
};

// Helper function to extract topics from videos
function extractTopicsFromVideos(videos) {
  // Extract all words from titles
  const allWords = videos.flatMap(video => 
    video.snippet.title.toLowerCase().split(/\s+/)
  );
  
  // Count word frequency
  const wordCounts = {};
  allWords.forEach(word => {
    // Filter out common words and short words
    if (word.length > 3 && !commonWords.includes(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Extract phrases from titles
  const phrases = [];
  videos.forEach(video => {
    const title = video.snippet.title;
    // Extract 2-3 word phrases
    const words = title.split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(`${words[i]} ${words[i+1]}`.toLowerCase());
      if (i < words.length - 2) {
        phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`.toLowerCase());
      }
    }
  });
  
  // Count phrase frequency
  const phraseCounts = {};
  phrases.forEach(phrase => {
    // Filter out phrases with common words
    const hasCommonWord = commonWords.some(word => 
      phrase.split(/\s+/).includes(word)
    );
    if (!hasCommonWord) {
      phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
    }
  });
  
  // Combine words and phrases, sort by frequency
  const combined = [
    ...Object.entries(wordCounts).map(([text, count]) => ({ text, count, type: 'word' })),
    ...Object.entries(phraseCounts).map(([text, count]) => ({ text, count, type: 'phrase' }))
  ];
  
  combined.sort((a, b) => b.count - a.count);
  
  // Return top 20 topics
  return combined.slice(0, 20).map(item => item.text);
}

// Common words to filter out
const commonWords = [
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'she', 'will', 'would', 'there', 'their', 'what',
  'about', 'which', 'when', 'make', 'like', 'time', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
  'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
  'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
  'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
  'most', 'cant', 'cant', 'wont', 'dont', 'didnt', 'isnt', 'arent', 'wasnt',
  'werent', 'hasnt', 'havent', 'hadnt', 'doesnt', 'dont', 'didnt'
];
