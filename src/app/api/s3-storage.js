'use server';

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client with environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// S3 bucket name
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'youtube-automation-storage';

/**
 * Upload a file to S3
 * @param {string} key - S3 object key (path)
 * @param {Buffer|string} body - File content
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<{success: boolean, key: string|null, error: string|null}>} - Upload result
 */
export async function uploadToS3(key, body, contentType) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.AWS_ACCESS_KEY_ID) {
      console.warn('AWS credentials not available during build, returning mock data');
      return { success: true, key, url: `https://example.com/${key}` };
    }

    // Create the upload command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType
    });

    // Upload the file
    await s3Client.send(command);

    return { success: true, key };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return { success: false, key: null, error: error.message || 'Failed to upload file' };
  }
}

/**
 * Get a signed URL for an S3 object
 * @param {string} key - S3 object key (path)
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
 * @returns {Promise<{success: boolean, url: string|null, error: string|null}>} - Signed URL result
 */
export async function getSignedUrl(key, expiresIn = 3600) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.AWS_ACCESS_KEY_ID) {
      console.warn('AWS credentials not available during build, returning mock URL');
      return { success: true, url: `https://example.com/${key}` };
    }

    // Create the get object command
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    // Generate the signed URL
    const url = await awsGetSignedUrl(s3Client, command, { expiresIn });

    return { success: true, url };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return { success: false, url: null, error: error.message || 'Failed to generate signed URL' };
  }
}

/**
 * Delete an object from S3
 * @param {string} key - S3 object key (path)
 * @returns {Promise<{success: boolean, error: string|null}>} - Delete result
 */
export async function deleteFromS3(key) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.AWS_ACCESS_KEY_ID) {
      console.warn('AWS credentials not available during build, returning mock result');
      return { success: true };
    }

    // Create the delete command
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    // Delete the object
    await s3Client.send(command);

    return { success: true };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return { success: false, error: error.message || 'Failed to delete file' };
  }
}

/**
 * List objects in an S3 directory
 * @param {string} prefix - Directory prefix
 * @returns {Promise<{success: boolean, objects: Array|null, error: string|null}>} - List result
 */
export async function listS3Objects(prefix) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.AWS_ACCESS_KEY_ID) {
      console.warn('AWS credentials not available during build, returning mock data');
      return { 
        success: true, 
        objects: [
          { key: `${prefix}/example1.mp4`, size: 1024000, lastModified: new Date() },
          { key: `${prefix}/example2.mp4`, size: 2048000, lastModified: new Date() }
        ] 
      };
    }

    // Create the list command
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix
    });

    // List the objects
    const response = await s3Client.send(command);

    // Format the response
    const objects = response.Contents?.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified
    })) || [];

    return { success: true, objects };
  } catch (error) {
    console.error('Error listing S3 objects:', error);
    return { success: false, objects: null, error: error.message || 'Failed to list files' };
  }
}

/**
 * Get storage usage for a user
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, usage: Object|null, error: string|null}>} - Storage usage result
 */
export async function getStorageUsage(userId) {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.AWS_ACCESS_KEY_ID) {
      console.warn('AWS credentials not available during build, returning mock data');
      return { 
        success: true, 
        usage: {
          bytes: 3072000,
          megabytes: "3.07",
          gigabytes: "0.00",
          fileCount: 2
        }
      };
    }

    const userPrefix = `users/${userId}/`;
    const result = await listS3Objects(userPrefix);
    
    if (!result.success) {
      return { success: false, usage: null, error: result.error };
    }
    
    // Calculate total storage usage
    const totalBytes = result.objects.reduce((total, obj) => total + obj.size, 0);
    const totalMB = totalBytes / (1024 * 1024);
    const totalGB = totalMB / 1024;
    
    return { 
      success: true, 
      usage: {
        bytes: totalBytes,
        megabytes: totalMB.toFixed(2),
        gigabytes: totalGB.toFixed(2),
        fileCount: result.objects.length
      }
    };
  } catch (error) {
    console.error('Error getting storage usage:', error);
    return { success: false, usage: null, error: error.message || 'Failed to get storage usage' };
  }
}

// No default export in 'use server' files - only async functions are allowed
