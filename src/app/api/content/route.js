import * as openaiApi from '../openai-api';
import * as elevenlabsApi from '../elevenlabs-api';
import * as trendAnalyzer from '../../../lib/trend-analyzer';
import { uploadToS3, getSignedUrl, deleteFromS3, listS3Objects, getStorageUsage } from '../s3-storage';

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
      console.error('Content API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// API route handler
export async function POST(request) {
  try {
    const { 
      action, 
      topic, 
      category,
      region,
      count,
      userId,
      text, 
      voiceId,
      videoId,
      scriptId,
      audioId,
      length, 
      tone,
      scheduleDate,
      scheduleTime,
      visibility,
      youtubeApiKey,
      channelId
    } = await request.json();
    
    if (!action) {
      return createApiError('Action is required', 400);
    }
    
    // Get trending topics
    if (action === 'get-trending-topics') {
      if (!category) {
        return createApiError('Category is required', 400);
      }
      
      try {
        const result = await trendAnalyzer.analyzeTrends(category, count || 10);
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to get trending topics', 500);
        }
        
        return createApiResponse({ topics: result.trends });
      } catch (error) {
        return createApiError(`Error getting trending topics: ${error.message}`, 500);
      }
    }
    
    // Get trending videos
    if (action === 'get-trending-videos') {
      if (!category) {
        return createApiError('Category is required', 400);
      }
      
      try {
        const result = await trendAnalyzer.analyzeTrends(category, count || 10);
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to get trending videos', 500);
        }
        
        // Convert trends to video format
        const videos = result.trends.map(trend => ({
          id: `video-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: trend.title,
          description: trend.description || `Video about ${trend.title}`,
          thumbnailUrl: `https://via.placeholder.com/320x180?text=${encodeURIComponent(trend.title)}`,
          viewCount: Math.floor(Math.random() * 1000000),
          publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
          channelTitle: 'Demo Channel',
          score: trend.score
        }));
        
        return createApiResponse({ videos });
      } catch (error) {
        return createApiError(`Error getting trending videos: ${error.message}`, 500);
      }
    }
    
    // Analyze content potential
    if (action === 'analyze-content-potential') {
      if (!topic || !category) {
        return createApiError('Topic and category are required', 400);
      }
      
      try {
        const result = await trendAnalyzer.predictViralPotential(topic, category, []);
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to analyze content potential', 500);
        }
        
        return createApiResponse({ 
          analysis: {
            score: result.score,
            potential: result.score > 80 ? 'high' : result.score > 60 ? 'medium' : 'low',
            insights: result.insights
          } 
        });
      } catch (error) {
        return createApiError(`Error analyzing content potential: ${error.message}`, 500);
      }
    }
    
    // Generate topic ideas
    if (action === 'generate-topic-ideas') {
      if (!category) {
        return createApiError('Category is required', 400);
      }
      
      try {
        const result = await openaiApi.generateTopicIdeas(category, count || 5);
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to generate topic ideas', 500);
        }
        
        return createApiResponse({ topics: result.topics });
      } catch (error) {
        return createApiError(`Error generating topic ideas: ${error.message}`, 500);
      }
    }
    
    // Generate script
    if (action === 'generate-script') {
      if (!topic) {
        return createApiError('Topic is required', 400);
      }
      
      try {
        const result = await openaiApi.generateScript(topic, tone || 'educational', length || 'medium');
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to generate script', 500);
        }
        
        // In a real implementation, you would save this to a database
        const scriptId = `script-${Date.now()}`;
        
        return createApiResponse({ 
          script: result.script,
          scriptId,
          metadata: {
            topic,
            length: length || 'medium',
            tone: tone || 'informative',
            createdAt: new Date().toISOString(),
            wordCount: result.script.split(' ').length
          }
        });
      } catch (error) {
        return createApiError(`Error generating script: ${error.message}`, 500);
      }
    }
    
    // Generate speech
    if (action === 'generate-speech') {
      if (!text) {
        return createApiError('Text is required', 400);
      }
      
      // Use default voice if not provided
      const selectedVoiceId = voiceId || 'default-voice-id';
      
      try {
        const result = await elevenlabsApi.generateVoiceover(text, selectedVoiceId);
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to generate speech', 500);
        }
        
        // In a real implementation, you would save this to S3
        const audioId = `audio-${Date.now()}`;
        const s3Key = `audio/${userId || 'demo'}/${audioId}.mp3`;
        
        // Mock S3 upload for demo purposes
        const uploadResult = { success: true, key: s3Key };
        
        // Get a signed URL for the audio
        const urlResult = { success: true, url: result.audioUrl || `https://example.com/${s3Key}` };
        
        return createApiResponse({ 
          audioId,
          audioUrl: urlResult.url,
          metadata: {
            voiceId: selectedVoiceId,
            duration: result.duration ? `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : estimateAudioDuration(text),
            createdAt: new Date().toISOString(),
            textLength: text.length
          }
        });
      } catch (error) {
        return createApiError(`Error generating speech: ${error.message}`, 500);
      }
    }
    
    // Get available voices
    if (action === 'get-voices') {
      try {
        const result = await elevenlabsApi.getVoices();
        
        if (!result.success) {
          // Provide default voices if API call fails
          return createApiResponse({ 
            voices: [
              { id: 'default-voice-id', name: 'Default Voice', preview_url: 'https://example.com/preview.mp3' },
              { id: 'voice-2', name: 'Professional Male', preview_url: 'https://example.com/preview2.mp3' },
              { id: 'voice-3', name: 'Professional Female', preview_url: 'https://example.com/preview3.mp3' }
            ]
          });
        }
        
        return createApiResponse({ voices: result.voices });
      } catch (error) {
        // Provide default voices if error occurs
        return createApiResponse({ 
          voices: [
            { id: 'default-voice-id', name: 'Default Voice', preview_url: 'https://example.com/preview.mp3' },
            { id: 'voice-2', name: 'Professional Male', preview_url: 'https://example.com/preview2.mp3' },
            { id: 'voice-3', name: 'Professional Female', preview_url: 'https://example.com/preview3.mp3' }
          ]
        });
      }
    }
    
    // Create video
    if (action === 'create-video') {
      // Make scriptId and audioId optional for testing
      if (!userId) {
        return createApiError('User ID is required', 400);
      }
      
      try {
        // In a real implementation, you would use a video rendering service
        // For now, we'll simulate the video creation process
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const videoId = `video-${Date.now()}`;
        const s3Key = `videos/${userId || 'demo'}/${videoId}.mp4`;
        
        // In a real implementation, this would be the actual video file
        const mockVideoBuffer = Buffer.from('Mock video data');
        
        // Upload to S3 (or mock it)
        const uploadResult = { success: true, key: s3Key };
        
        // Get a signed URL for the video (or mock it)
        const urlResult = { success: true, url: `https://example.com/${s3Key}` };
        
        // Generate a thumbnail
        const thumbnailKey = `thumbnails/${userId || 'demo'}/${videoId}.jpg`;
        
        // Mock thumbnail URL
        const thumbnailUrlResult = { success: true, url: `https://example.com/${thumbnailKey}` };
        
        return createApiResponse({ 
          videoId,
          videoUrl: urlResult.url,
          thumbnailUrl: thumbnailUrlResult.url,
          metadata: {
            scriptId: scriptId || `script-${Date.now()}`,
            audioId: audioId || `audio-${Date.now()}`,
            duration: '10:30', // This would be calculated from the actual video
            resolution: '1920x1080',
            format: 'MP4',
            createdAt: new Date().toISOString(),
            status: 'ready'
          }
        });
      } catch (error) {
        return createApiError(`Error creating video: ${error.message}`, 500);
      }
    }
    
    // Schedule video
    if (action === 'schedule-video') {
      if (!videoId) {
        return createApiError('Video ID is required', 400);
      }
      
      // Make schedule date and time optional with defaults
      const videoScheduleDate = scheduleDate || new Date().toISOString().split('T')[0];
      const videoScheduleTime = scheduleTime || '12:00';
      
      try {
        // In a real implementation, you would save this to a database
        const scheduleId = `schedule-${Date.now()}`;
        
        return createApiResponse({ 
          scheduleId,
          metadata: {
            videoId,
            scheduleDate: videoScheduleDate,
            scheduleTime: videoScheduleTime,
            visibility: visibility || 'public',
            createdAt: new Date().toISOString(),
            status: 'scheduled'
          }
        });
      } catch (error) {
        return createApiError(`Error scheduling video: ${error.message}`, 500);
      }
    }
    
    // Get content categories
    if (action === 'get-categories') {
      try {
        const result = await trendAnalyzer.getCategories();
        
        if (!result.success) {
          return createApiError(result.error || 'Failed to get categories', 500);
        }
        
        return createApiResponse({ categories: result.categories });
      } catch (error) {
        return createApiError(`Error getting categories: ${error.message}`, 500);
      }
    }
    
    // Upload video to YouTube
    if (action === 'upload-to-youtube') {
      if (!videoId || !youtubeApiKey) {
        return createApiError('Video ID and YouTube API key are required', 400);
      }
      
      try {
        // In a real implementation, this would use the YouTube API to upload the video
        // For demo purposes, we'll return mock data
        
        return createApiResponse({
          youtubeVideoId: `yt-${Date.now()}`,
          youtubeVideoUrl: `https://youtube.com/watch?v=yt-${Date.now()}`,
          status: 'uploaded',
          message: 'Video uploaded to YouTube successfully'
        });
      } catch (error) {
        return createApiError(`Error uploading to YouTube: ${error.message}`, 500);
      }
    }
    
    return createApiError('Invalid action', 400);
  } catch (error) {
    console.error('Content API error:', error);
    return createApiError('Internal server error', 500);
  }
}

// Helper function to estimate audio duration based on text length
function estimateAudioDuration(text) {
  // Average speaking rate is about 150 words per minute
  const wordCount = text.split(' ').length;
  const minutes = wordCount / 150;
  
  // Format as MM:SS
  const totalSeconds = Math.round(minutes * 60);
  const minutesPart = Math.floor(totalSeconds / 60);
  const secondsPart = totalSeconds % 60;
  
  return `${minutesPart}:${secondsPart.toString().padStart(2, '0')}`;
}
