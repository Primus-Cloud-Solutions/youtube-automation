import { searchViralVideos, checkVideoSuitability, getVideoDownloadUrl } from './video-search';
import { 
  downloadVideo, 
  addWatermark, 
  addIntroOutro, 
  addTextOverlay, 
  trimVideo, 
  generateThumbnail, 
  uploadEditedVideo, 
  uploadThumbnail 
} from './video-editor';
import { uploadVideoToYouTube } from '@/app/api/youtube-upload';
import { 
  checkYouTubeCompliance, 
  generateCompliantDescription, 
  generateCompliantTitle, 
  generateCompliantTags 
} from './compliance-checker';

// Using the imported compliance checker module instead of the local implementation

/**
 * Process viral video workflow
 * @param {Object} options - Processing options
 * @param {string} options.category - Content category
 * @param {string} options.userId - User ID
 * @param {string} options.accessToken - YouTube OAuth access token
 * @param {Object} options.branding - Branding options
 * @param {string} options.branding.watermarkText - Watermark text
 * @param {string} options.branding.introPath - Path to intro video
 * @param {string} options.branding.outroPath - Path to outro video
 * @param {Array} options.textOverlays - Text overlays to add
 * @param {Object} options.metadata - Video metadata
 * @returns {Promise<{success: boolean, videoId: string|null, url: string|null, error: string|null}>} - Processing result
 */
export async function processViralVideo(options) {
  try {
    // Search for viral videos
    const viralVideos = await searchViralVideos(options.category);
    
    if (viralVideos.length === 0) {
      return { success: false, error: 'No suitable viral videos found' };
    }
    
    // Find a suitable video
    let selectedVideo = null;
    let suitabilityResult = null;
    
    for (const video of viralVideos) {
      suitabilityResult = await checkVideoSuitability(video);
      
      if (suitabilityResult.suitable) {
        selectedVideo = video;
        break;
      }
    }
    
    if (!selectedVideo) {
      return { 
        success: false, 
        error: 'No suitable videos found',
        suitabilityIssues: suitabilityResult ? suitabilityResult.reasons : []
      };
    }
    
    // Get download URL
    const downloadUrl = await getVideoDownloadUrl(selectedVideo.id);
    
    // Download the video
    const videoPath = await downloadVideo(downloadUrl);
    
    // Prepare video data for compliance check
    const videoData = {
      originalTitle: selectedVideo.snippet.title,
      originalDuration: parseDuration(selectedVideo.contentDetails.duration),
      title: options.metadata.title || generateCompliantTitle(selectedVideo, options.branding.watermarkText),
      description: options.metadata.description || 
        generateCompliantDescription(selectedVideo, options.branding.watermarkText),
      hasWatermark: false,
      hasIntroOutro: false,
      hasTextOverlay: false
    };

    // Add watermark
    if (options.branding.watermarkText) {
      processedVideoPath = await addWatermark(
        processedVideoPath, 
        options.branding.watermarkText, 
        options.branding.watermarkPosition || 'bottomRight'
      );
      videoData.hasWatermark = true;
    }
    
    // Add intro and outro
    if (options.branding.introPath && options.branding.outroPath) {
      processedVideoPath = await addIntroOutro(
        processedVideoPath,
        options.branding.introPath,
        options.branding.outroPath
      );
      videoData.hasIntroOutro = true;
    }
    
    // Add text overlays
    if (options.textOverlays && options.textOverlays.length > 0) {
      for (const overlay of options.textOverlays) {
        processedVideoPath = await addTextOverlay(
          processedVideoPath,
          overlay.text,
          overlay.position,
          overlay.startTime,
          overlay.duration
        );
      }
      videoData.hasTextOverlay = true;
    }
    
    // Trim video if needed
    if (options.trimStart !== undefined && options.trimDuration !== undefined) {
      processedVideoPath = await trimVideo(
        processedVideoPath,
        options.trimStart,
        options.trimDuration
      );
      videoData.duration = options.trimDuration;
    } else {
      videoData.duration = videoData.originalDuration;
    }
    
    // Check YouTube compliance
    const complianceResult = await checkYouTubeCompliance(videoData);
    
    if (!complianceResult.compliant) {
      return {
        success: false,
        error: 'Video does not comply with YouTube policies on reused content',
        complianceIssues: complianceResult.issues,
        recommendations: complianceResult.recommendations
      };
    }
    
    // Generate thumbnail
    const thumbnailPath = await generateThumbnail(processedVideoPath, options.thumbnailTime || 5);
    
    // Upload video to S3
    const videoUploadResult = await uploadEditedVideo(processedVideoPath, options.userId);
    
    if (!videoUploadResult.success) {
      return { success: false, error: 'Failed to upload edited video' };
    }
    
    // Upload thumbnail to S3
    const thumbnailUploadResult = await uploadThumbnail(thumbnailPath, options.userId);
    
    if (!thumbnailUploadResult.success) {
      return { success: false, error: 'Failed to upload thumbnail' };
    }
    
    // Prepare video data for YouTube upload
    const youtubeVideoData = {
      title: videoData.title,
      description: videoData.description,
      tags: options.metadata.tags || generateCompliantTags(selectedVideo, options.branding.watermarkText),
      categoryId: options.metadata.categoryId || '22', // People & Blogs
      privacyStatus: options.metadata.privacyStatus || 'private',
      videoKey: videoUploadResult.key,
      thumbnailKey: thumbnailUploadResult.key
    };
    
    // Upload to YouTube
    const youtubeUploadResult = await uploadVideoToYouTube(youtubeVideoData, options.accessToken);
    
    return youtubeUploadResult;
  } catch (error) {
    console.error('Error processing viral video:', error);
    return { success: false, error: error.message || 'Failed to process viral video' };
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
