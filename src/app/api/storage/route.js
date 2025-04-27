import { 
  uploadToS3, 
  getSignedUrl, 
  deleteFromS3, 
  listS3Objects 
} from '../s3-storage';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client with environment variables
const s3Client = new S3Client({
  region: process.env.YOUTUBE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.YOUTUBE_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.YOUTUBE_AWS_SECRET_KEY || ''
  }
});

// S3 bucket name
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'youtube-automation-storage';

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
