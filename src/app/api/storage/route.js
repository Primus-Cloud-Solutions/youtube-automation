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
export const uploadToS3 = async (key, body, contentType) => {
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
};

/**
 * Get a signed URL for an S3 object
 * @param {string} key - S3 object key (path)
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
 * @returns {Promise<{success: boolean, url: string|null, error: string|null}>} - Signed URL result
 */
export const getSignedUrl = async (key, expiresIn = 3600) => {
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
};

/**
 * Delete an object from S3
 * @param {string} key - S3 object key (path)
 * @returns {Promise<{success: boolean, error: string|null}>} - Delete result
 */
export const deleteFromS3 = async (key) => {
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
};

/**
 * List objects in an S3 directory
 * @param {string} prefix - Directory prefix
 * @returns {Promise<{success: boolean, objects: Array|null, error: string|null}>} - List result
 */
export const listS3Objects = async (prefix) => {
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
};

/**
 * API route handler for S3 storage operations
 */
export const POST = async (request) => {
  try {
    const { action, key, userId, fileType, expiresIn, prefix } = await request.json();
    
    if (!action) {
      return Response.json({ success: false, error: 'Action is required' }, { status: 400 });
    }
    
    // Get signed URL for uploading
    if (action === 'get-upload-url') {
      if (!key || !fileType) {
        return Response.json({ success: false, error: 'Key and file type are required' }, { status: 400 });
      }
      
      // Generate a pre-signed URL for client-side upload
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType
      });
      
      const url = await awsGetSignedUrl(s3Client, command, { expiresIn: expiresIn || 3600 });
      
      return Response.json({ success: true, url, key });
    }
    
    // Get signed URL for downloading
    if (action === 'get-download-url') {
      if (!key) {
        return Response.json({ success: false, error: 'Key is required' }, { status: 400 });
      }
      
      const result = await getSignedUrl(key, expiresIn || 3600);
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 500 });
      }
      
      return Response.json({ success: true, url: result.url });
    }
    
    // Delete file
    if (action === 'delete-file') {
      if (!key) {
        return Response.json({ success: false, error: 'Key is required' }, { status: 400 });
      }
      
      const result = await deleteFromS3(key);
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 500 });
      }
      
      return Response.json({ success: true });
    }
    
    // List files
    if (action === 'list-files') {
      if (!prefix) {
        return Response.json({ success: false, error: 'Prefix is required' }, { status: 400 });
      }
      
      const result = await listS3Objects(prefix);
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 500 });
      }
      
      return Response.json({ success: true, objects: result.objects });
    }
    
    // Get user storage usage
    if (action === 'get-storage-usage') {
      if (!userId) {
        return Response.json({ success: false, error: 'User ID is required' }, { status: 400 });
      }
      
      const userPrefix = `users/${userId}/`;
      const result = await listS3Objects(userPrefix);
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 500 });
      }
      
      // Calculate total storage usage
      const totalBytes = result.objects.reduce((total, obj) => total + obj.size, 0);
      const totalMB = totalBytes / (1024 * 1024);
      const totalGB = totalMB / 1024;
      
      return Response.json({ 
        success: true, 
        usage: {
          bytes: totalBytes,
          megabytes: totalMB.toFixed(2),
          gigabytes: totalGB.toFixed(2),
          fileCount: result.objects.length
        }
      });
    }
    
    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('S3 API error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
};
