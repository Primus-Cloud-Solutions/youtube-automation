import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { uploadToS3, getSignedUrl } from '@/app/api/s3-storage';

/**
 * Download video from URL to temporary file
 * @param {string} url - Video download URL
 * @returns {Promise<string>} - Path to downloaded file
 */
export async function downloadVideo(url) {
  try {
    // Create temporary file path
    const tempDir = os.tmpdir();
    const fileName = `video_${Date.now()}.mp4`;
    const tempFilePath = path.join(tempDir, fileName);
    
    // Download file from URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    // Save to temporary file
    const fileStream = fs.createWriteStream(tempFilePath);
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on('error', reject);
      fileStream.on('finish', resolve);
    });
    
    return tempFilePath;
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
}

/**
 * Add watermark to video
 * @param {string} videoPath - Path to video file
 * @param {string} watermarkText - Text to use as watermark
 * @param {string} position - Position of watermark (topLeft, topRight, bottomLeft, bottomRight)
 * @returns {Promise<string>} - Path to watermarked video
 */
export async function addWatermark(videoPath, watermarkText, position = 'bottomRight') {
  try {
    // Create output file path
    const outputPath = `${videoPath.replace('.mp4', '')}_watermarked.mp4`;
    
    // Determine position coordinates
    let positionString;
    switch (position) {
      case 'topLeft':
        positionString = '10:10';
        break;
      case 'topRight':
        positionString = 'w-tw-10:10';
        break;
      case 'bottomLeft':
        positionString = '10:h-th-10';
        break;
      case 'bottomRight':
      default:
        positionString = 'w-tw-10:h-th-10';
        break;
    }
    
    // FFmpeg command to add watermark
    const ffmpegArgs = [
      '-i', videoPath,
      '-vf', `drawtext=text='${watermarkText}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=${positionString}`,
      '-codec:a', 'copy',
      outputPath
    ];
    
    // Execute FFmpeg command
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpeg.on('error', reject);
    });
    
    return outputPath;
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw error;
  }
}

/**
 * Add intro and outro to video
 * @param {string} videoPath - Path to video file
 * @param {string} introPath - Path to intro video
 * @param {string} outroPath - Path to outro video
 * @returns {Promise<string>} - Path to edited video
 */
export async function addIntroOutro(videoPath, introPath, outroPath) {
  try {
    // Create output file path
    const outputPath = `${videoPath.replace('.mp4', '')}_with_intro_outro.mp4`;
    
    // Create temporary file list
    const tempDir = os.tmpdir();
    const listFilePath = path.join(tempDir, `list_${Date.now()}.txt`);
    
    // Write file list for concatenation
    const fileList = [
      `file '${introPath}'`,
      `file '${videoPath}'`,
      `file '${outroPath}'`
    ].join('\n');
    
    fs.writeFileSync(listFilePath, fileList);
    
    // FFmpeg command to concatenate videos
    const ffmpegArgs = [
      '-f', 'concat',
      '-safe', '0',
      '-i', listFilePath,
      '-c', 'copy',
      outputPath
    ];
    
    // Execute FFmpeg command
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpeg.on('error', reject);
    });
    
    // Clean up list file
    fs.unlinkSync(listFilePath);
    
    return outputPath;
  } catch (error) {
    console.error('Error adding intro and outro:', error);
    throw error;
  }
}

/**
 * Add text overlay to video
 * @param {string} videoPath - Path to video file
 * @param {string} text - Text to overlay
 * @param {string} position - Position of text (top, bottom, middle)
 * @param {number} startTime - Start time in seconds
 * @param {number} duration - Duration in seconds
 * @returns {Promise<string>} - Path to edited video
 */
export async function addTextOverlay(videoPath, text, position = 'bottom', startTime = 0, duration = 5) {
  try {
    // Create output file path
    const outputPath = `${videoPath.replace('.mp4', '')}_with_text.mp4`;
    
    // Determine position coordinates
    let positionString;
    switch (position) {
      case 'top':
        positionString = 'x=(w-text_w)/2:y=h/10';
        break;
      case 'middle':
        positionString = 'x=(w-text_w)/2:y=(h-text_h)/2';
        break;
      case 'bottom':
      default:
        positionString = 'x=(w-text_w)/2:y=h-h/10-text_h';
        break;
    }
    
    // FFmpeg command to add text overlay
    const ffmpegArgs = [
      '-i', videoPath,
      '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=36:box=1:boxcolor=black@0.5:boxborderw=5:${positionString}:enable='between(t,${startTime},${startTime + duration})'`,
      '-codec:a', 'copy',
      outputPath
    ];
    
    // Execute FFmpeg command
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpeg.on('error', reject);
    });
    
    return outputPath;
  } catch (error) {
    console.error('Error adding text overlay:', error);
    throw error;
  }
}

/**
 * Trim video
 * @param {string} videoPath - Path to video file
 * @param {number} startTime - Start time in seconds
 * @param {number} duration - Duration in seconds
 * @returns {Promise<string>} - Path to trimmed video
 */
export async function trimVideo(videoPath, startTime, duration) {
  try {
    // Create output file path
    const outputPath = `${videoPath.replace('.mp4', '')}_trimmed.mp4`;
    
    // FFmpeg command to trim video
    const ffmpegArgs = [
      '-i', videoPath,
      '-ss', startTime.toString(),
      '-t', duration.toString(),
      '-c', 'copy',
      outputPath
    ];
    
    // Execute FFmpeg command
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpeg.on('error', reject);
    });
    
    return outputPath;
  } catch (error) {
    console.error('Error trimming video:', error);
    throw error;
  }
}

/**
 * Upload edited video to S3
 * @param {string} videoPath - Path to video file
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, key: string|null, error: string|null}>} - Upload result
 */
export async function uploadEditedVideo(videoPath, userId) {
  try {
    // Read video file
    const videoBuffer = fs.readFileSync(videoPath);
    
    // Generate S3 key
    const fileName = path.basename(videoPath);
    const key = `users/${userId}/edited_videos/${fileName}`;
    
    // Upload to S3
    const result = await uploadToS3(key, videoBuffer, 'video/mp4');
    
    // Clean up temporary file
    fs.unlinkSync(videoPath);
    
    return result;
  } catch (error) {
    console.error('Error uploading edited video:', error);
    throw error;
  }
}

/**
 * Generate thumbnail from video
 * @param {string} videoPath - Path to video file
 * @param {number} timePosition - Time position in seconds
 * @returns {Promise<string>} - Path to thumbnail image
 */
export async function generateThumbnail(videoPath, timePosition = 5) {
  try {
    // Create output file path
    const thumbnailPath = `${videoPath.replace('.mp4', '')}_thumbnail.jpg`;
    
    // FFmpeg command to extract frame
    const ffmpegArgs = [
      '-i', videoPath,
      '-ss', timePosition.toString(),
      '-vframes', '1',
      '-q:v', '2',
      thumbnailPath
    ];
    
    // Execute FFmpeg command
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpeg.on('error', reject);
    });
    
    return thumbnailPath;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
}

/**
 * Upload thumbnail to S3
 * @param {string} thumbnailPath - Path to thumbnail image
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, key: string|null, error: string|null}>} - Upload result
 */
export async function uploadThumbnail(thumbnailPath, userId) {
  try {
    // Read thumbnail file
    const thumbnailBuffer = fs.readFileSync(thumbnailPath);
    
    // Generate S3 key
    const fileName = path.basename(thumbnailPath);
    const key = `users/${userId}/thumbnails/${fileName}`;
    
    // Upload to S3
    const result = await uploadToS3(key, thumbnailBuffer, 'image/jpeg');
    
    // Clean up temporary file
    fs.unlinkSync(thumbnailPath);
    
    return result;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
}
