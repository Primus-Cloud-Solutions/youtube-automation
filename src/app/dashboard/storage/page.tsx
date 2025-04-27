'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard-header';

export default function StoragePage() {
  const { user, isLoading, subscription } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageUsage, setStorageUsage] = useState({ bytes: 0, megabytes: "0", gigabytes: "0", fileCount: 0 });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchFiles();
      fetchStorageUsage();
    }
  }, [user, isLoading, router]);

  // Fetch files from S3
  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list-files',
          prefix: `users/${user.id}/`
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch files');
      }
      
      // Group files by type
      const groupedFiles = {
        videos: [],
        images: [],
        audio: [],
        other: []
      };
      
      data.objects.forEach(file => {
        const key = file.key;
        const extension = key.split('.').pop().toLowerCase();
        
        if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
          groupedFiles.videos.push(file);
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
          groupedFiles.images.push(file);
        } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
          groupedFiles.audio.push(file);
        } else {
          groupedFiles.other.push(file);
        }
      });
      
      setFiles(groupedFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch storage usage
  const fetchStorageUsage = async () => {
    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-storage-usage',
          userId: user.id
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch storage usage');
      }
      
      setStorageUsage(data.usage);
    } catch (err) {
      console.error('Error fetching storage usage:', err);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Get file extension and type
      const extension = file.name.split('.').pop().toLowerCase();
      const contentType = file.type;
      
      // Determine file category
      let category = 'other';
      if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
        category = 'videos';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        category = 'images';
      } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
        category = 'audio';
      }
      
      // Generate a unique key for the file
      const timestamp = Date.now();
      const key = `users/${user.id}/${category}/${timestamp}_${file.name}`;
      
      // Get a pre-signed URL for upload
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-upload-url',
          key,
          fileType: contentType
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get upload URL');
      }
      
      // Upload the file to S3
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', data.url);
      xhr.setRequestHeader('Content-Type', contentType);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = async () => {
        if (xhr.status === 200) {
          // Refresh files and storage usage
          await fetchFiles();
          await fetchStorageUsage();
          setIsUploading(false);
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`);
        }
      };
      
      xhr.onerror = () => {
        throw new Error('Upload failed');
      };
      
      xhr.send(file);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message);
      setIsUploading(false);
    }
  };

  // Get download URL for a file
  const getDownloadUrl = async (key) => {
    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-download-url',
          key
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get download URL');
      }
      
      // Open the URL in a new tab
      window.open(data.url, '_blank');
    } catch (err) {
      console.error('Error getting download URL:', err);
      setError(err.message);
    }
  };

  // Delete a file
  const deleteFile = async (key) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete-file',
          key
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete file');
      }
      
      // Refresh files and storage usage
      await fetchFiles();
      await fetchStorageUsage();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message);
    }
  };

  // Upload to YouTube
  const uploadToYouTube = async (key) => {
    try {
      // Get file name without extension
      const fileName = key.split('/').pop().split('.')[0];
      
      // Navigate to the video creation page with the file key
      router.push(`/dashboard/manual-topics?videoKey=${encodeURIComponent(key)}&title=${encodeURIComponent(fileName)}`);
    } catch (err) {
      console.error('Error navigating to video creation:', err);
      setError(err.message);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // Calculate storage limit based on subscription
  const storageLimit = subscription?.limits?.storageGB || 1;
  const storageUsedPercentage = (parseFloat(storageUsage.gigabytes) / storageLimit) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <DashboardHeader />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your storage...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Storage</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Storage Usage</h2>
            <div className="mb-2 flex justify-between">
              <span>{storageUsage.megabytes} MB used</span>
              <span>{storageLimit} GB limit</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${storageUsedPercentage > 90 ? 'bg-red-600' : 'bg-green-600'}`} 
                style={{ width: `${Math.min(storageUsedPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              {storageUsage.fileCount} files stored
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <div className="space-y-4">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center cursor-pointer"
              >
                Select File
              </label>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-blue-600" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your files...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Videos */}
            {files.videos && files.videos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Videos</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-800">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Size</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.videos.map((file) => (
                        <tr key={file.key} className="border-b border-gray-700">
                          <td className="px-6 py-4">{file.key.split('/').pop()}</td>
                          <td className="px-6 py-4">{formatFileSize(file.size)}</td>
                          <td className="px-6 py-4">{formatDate(file.lastModified)}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <button 
                              onClick={() => getDownloadUrl(file.key)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs"
                            >
                              Download
                            </button>
                            <button 
                              onClick={() => uploadToYouTube(file.key)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-xs"
                            >
                              Upload to YouTube
                            </button>
                            <button 
                              onClick={() => deleteFile(file.key)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Images */}
            {files.images && files.images.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {files.images.map((file) => (
                    <div key={file.key} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                        <img 
                          src={`/api/storage?action=get-download-url&key=${encodeURIComponent(file.key)}`}
                          alt={file.key.split('/').pop()}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Image';
                          }}
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate">{file.key.split('/').pop()}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                        <div className="flex space-x-1 mt-2">
                          <button 
                            onClick={() => getDownloadUrl(file.key)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs flex-1"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => deleteFile(file.key)}
                            className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors text-xs flex-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Audio */}
            {files.audio && files.audio.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Audio</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-800">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Size</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.audio.map((file) => (
                        <tr key={file.key} className="border-b border-gray-700">
                          <td className="px-6 py-4">{file.key.split('/').pop()}</td>
                          <td className="px-6 py-4">{formatFileSize(file.size)}</td>
                          <td className="px-6 py-4">{formatDate(file.lastModified)}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <button 
                              onClick={() => getDownloadUrl(file.key)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs"
                            >
                              Download
                            </button>
                            <button 
                              onClick={() => deleteFile(file.key)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Other Files */}
            {files.other && files.other.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Other Files</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-800">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Size</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.other.map((file) => (
                        <tr key={file.key} className="border-b border-gray-700">
                          <td className="px-6 py-4">{file.key.split('/').pop()}</td>
                          <td className="px-6 py-4">{formatFileSize(file.size)}</td>
                          <td className="px-6 py-4">{formatDate(file.lastModified)}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <button 
                              onClick={() => getDownloadUrl(file.key)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs"
                            >
                              Download
                            </button>
                            <button 
                              onClick={() => deleteFile(file.key)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {Object.values(files).every(arr => arr.length === 0) && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
                <p className="text-gray-400 mb-4">You haven't uploaded any files yet.</p>
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
                >
                  Upload Your First File
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
