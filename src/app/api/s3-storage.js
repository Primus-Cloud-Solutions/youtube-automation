'use server';

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client with environment variables
const initializeS3Client = () => {
  // Check if required environment variables are set
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-1';
  
  if (!accessKeyId || !secretAccessKey) {
    console.error('AWS credentials not configured. S3 operations will fail.');
    return null;
  }
  
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
};

// Initialize S3 client
const s3Client = initializeS3Client();

// S3 bucket name from environment variable
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Check if S3 is properly configured
const isS3Configured = () => {
  if (!s3Client) {
    console.error('S3 client not initialized. Check AWS credentials.');
    return false;
  }
  
  if (!BUCKET_NAME) {
    console.error('S3_BUCKET_NAME environment variable not set.');
    return false;
  }
  
  return true;
};

/**
 * Create a user folder in S3 if it doesn't exist
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, error: string|null}>} - Result
 */
export async function createUserFolder(userId) {
  try {
    if (!isS3Configured()) {
      return { 
        success: false, 
        error: 'S3 not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME environment variables.' 
      };
    }

    // Create an empty object with the user folder prefix to establish the "directory"
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `users/${userId}/`,
      Body: ''
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error creating user folder:', error);
    return { success: false, error: error.message || 'Failed to create user folder' };
  }
}

/**
 * Upload a file to S3
 * @param {string} userId - User ID
 * @param {string} filename - File name
 * @param {Buffer|string} body - File content
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<{success: boolean, key: string|null, error: string|null}>} - Upload result
 */
export async function uploadToS3(userId, filename, body, contentType) {
  try {
    if (!isS3Configured()) {
      return { 
        success: false, 
        error: 'S3 not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME environment variables.' 
      };
    }

    // Create the key with user ID prefix
    const key = `users/${userId}/${filename}`;

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
 * @param {string} userId - User ID
 * @param {string} filename - File name
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
 * @returns {Promise<{success: boolean, url: string|null, error: string|null}>} - Signed URL result
 */
export async function getSignedUrl(userId, filename, expiresIn = 3600) {
  try {
    if (!isS3Configured()) {
      return { 
        success: false, 
        error: 'S3 not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME environment variables.' 
      };
    }

    // Create the key with user ID prefix
    const key = `users/${userId}/${filename}`;

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
 * @param {string} userId - User ID
 * @param {string} filename - File name
 * @returns {Promise<{success: boolean, error: string|null}>} - Delete result
 */
export async function deleteFromS3(userId, filename) {
  try {
    if (!isS3Configured()) {
      return { 
        success: false, 
        error: 'S3 not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME environment variables.' 
      };
    }

    // Create the key with user ID prefix
    const key = `users/${userId}/${filename}`;

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
 * List objects in a user's S3 directory
 * @param {string} userId - User ID
 * @param {string} prefix - Additional prefix (optional)
 * @returns {Promise<{success: boolean, objects: Array|null, error: string|null}>} - List result
 */
export async function listUserObjects(userId, prefix = '') {
  try {
    if (!isS3Configured()) {
      return { 
        success: false, 
        error: 'S3 not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME environment variables.' 
      };
    }

    // Create the full prefix with user ID
    const fullPrefix = `users/${userId}/${prefix}`;

    // Create the list command
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: fullPrefix
    });

    // List the objects
    const response = await s3Client.send(command);

    // Format the response
    const objects = response.Contents?.map(item => ({
      key: item.Key,
      filename: item.Key.replace(fullPrefix, ''),
      size: item.Size,
      lastModified: item.LastModified
    })).filter(item => item.filename !== '') || [];

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
    if (!isS3Configured()) {
      return { 
        success: false, 
        error: 'S3 not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME environment variables.' 
      };
    }

    const result = await listUserObjects(userId);
    
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

/**
 * Check if S3 is properly configured
 * @returns {Promise<{success: boolean, configured: boolean, error: string|null}>} - Configuration status
 */
export async function checkS3Configuration() {
  try {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.S3_BUCKET_NAME;
    
    const missingVars = [];
    if (!accessKeyId) missingVars.push('AWS_ACCESS_KEY_ID');
    if (!secretAccessKey) missingVars.push('AWS_SECRET_ACCESS_KEY');
    if (!bucketName) missingVars.push('S3_BUCKET_NAME');
    
    if (missingVars.length > 0) {
      return { 
        success: true, 
        configured: false, 
        error: `Missing required environment variables: ${missingVars.join(', ')}` 
      };
    }
    
    // If we have all variables but s3Client failed to initialize
    if (!s3Client) {
      return { 
        success: true, 
        configured: false, 
        error: 'S3 client failed to initialize despite having environment variables' 
      };
    }
    
    return { success: true, configured: true };
  } catch (error) {
    console.error('Error checking S3 configuration:', error);
    return { success: false, configured: false, error: error.message || 'Failed to check S3 configuration' };
  }
}
