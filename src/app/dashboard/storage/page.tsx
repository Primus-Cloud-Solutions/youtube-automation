'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/app/components/dashboard-header';

export default function StoragePage() {
  const { user, loading, subscription } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState({
    videos: [],
    images: [],
    audio: [],
    other: []
  });
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [error, setError] = useState(null);
  const [storageUsage, setStorageUsage] = useState({ bytes: 0, megabytes: "0", gigabytes: "0", fileCount: 0 });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [progressInterval, setProgressIntervalState] = useState(null);

  // Check session storage to maintain login state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = window.sessionStorage.getItem('isLoggedIn');
      const userEmail = window.sessionStorage.getItem('userEmail');
      
      if (isLoggedIn && userEmail) {
        setIsSessionValid(true);
        fetchMockData();
      } else if (!loading && !user) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
      } else if (user) {
        fetchMockData();
      }
    }
    
    // Cleanup function to clear any intervals on unmount
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [user, loading, router]);

  // Fetch mock data for demo purposes
  const fetchMockData = () => {
    try {
      setLoadingFiles(true);
      setError(null);
      
      // Mock files data
      const mockFiles = {
        videos: [
          {
            key: 'users/demo-user/videos/sample_video_1.mp4',
            size: 15728640, // 15 MB
            lastModified: new Date().toISOString()
          },
          {
            key: 'users/demo-user/videos/how_to_create_youtube_content.mp4',
            size: 31457280, // 30 MB
            lastModified: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ],
        images: [
          {
            key: 'users/demo-user/images/thumbnail_1.jpg',
            size: 1048576, // 1 MB
            lastModified: new Date().toISOString()
          },
          {
            key: 'users/demo-user/images/channel_banner.png',
            size: 2097152, // 2 MB
            lastModified: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          }
        ],
        audio: [
          {
            key: 'users/demo-user/audio/background_music.mp3',
            size: 5242880, // 5 MB
            lastModified: new Date().toISOString()
          }
        ],
        other: [
          {
            key: 'users/demo-user/other/script.txt',
            size: 10240, // 10 KB
            lastModified: new Date().toISOString()
          }
        ]
      };
      
      // Mock storage usage
      const mockStorageUsage = {
        bytes: 55574528, // Sum of all file sizes
        megabytes: "53.00",
        gigabytes: "0.05",
        fileCount: 6 // Total number of files
      };
      
      setFiles(mockFiles);
      setStorageUsage(mockStorageUsage);
      
      // Simulate API delay
      setTimeout(() => {
        setLoadingFiles(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error fetching mock data:', err);
      setError('Failed to load storage data. Please try again later.');
      setLoadingFiles(false);
      
      // Provide fallback data even on error
      setFiles({
        videos: [],
        images: [],
        audio: [],
        other: []
      });
      setStorageUsage({ bytes: 0, megabytes: "0", gigabytes: "0", fileCount: 0 });
    }
  };

  // Handle file upload with comprehensive error handling
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
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
      const userId = user?.id || 'demo-user';
      const key = `users/${userId}/${category}/${timestamp}_${file.name}`;
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      setProgressIntervalState(interval);
      
      // Simulate successful upload after delay
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Add the new file to the files state
        const newFile = {
          key,
          size: file.size,
          lastModified: new Date().toISOString()
        };
        
        setFiles(prevFiles => ({
          ...prevFiles,
          [category]: [...prevFiles[category], newFile]
        }));
        
        // Update storage usage
        setStorageUsage(prev => ({
          bytes: prev.bytes + file.size,
          megabytes: ((prev.bytes + file.size) / (1024 * 1024)).toFixed(2),
          gigabytes: ((prev.bytes + file.size) / (1024 * 1024 * 1024)).toFixed(2),
          fileCount: prev.fileCount + 1
        }));
        
        setIsUploading(false);
        
        // Reset the file input
        event.target.value = '';
      }, 3000);
      
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again later.');
      setIsUploading(false);
      
      // Always ensure progress interval is cleared on error
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      // Reset the file input
      event.target.value = '';
    }
  };

  // Get download URL for a file
  const getDownloadUrl = async (key) => {
    try {
      // Simulate download action
      alert(`Downloading file: ${key.split('/').pop()}`);
    } catch (err) {
      console.error('Error getting download URL:', err);
      setError('Failed to download file. Please try again later.');
    }
  };

  // Delete a file with error handling
  const deleteFile = async (key) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      // Determine file category from key
      let category = 'other';
      if (key.includes('/videos/')) {
        category = 'videos';
      } else if (key.includes('/images/')) {
        category = 'images';
      } else if (key.includes('/audio/')) {
        category = 'audio';
      }
      
      // Find the file to get its size
      const fileToDelete = files[category].find(file => file.key === key);
      
      if (!fileToDelete) {
        throw new Error('File not found');
      }
      
      // Remove the file from the files state
      setFiles(prevFiles => ({
        ...prevFiles,
        [category]: prevFiles[category].filter(file => file.key !== key)
      }));
      
      // Update storage usage
      setStorageUsage(prev => ({
        bytes: prev.bytes - fileToDelete.size,
        megabytes: ((prev.bytes - fileToDelete.size) / (1024 * 1024)).toFixed(2),
        gigabytes: ((prev.bytes - fileToDelete.size) / (1024 * 1024 * 1024)).toFixed(2),
        fileCount: prev.fileCount - 1
      }));
      
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again later.');
    }
  };

  // Upload to YouTube with error handling
  const uploadToYouTube = async (key) => {
    try {
      // Get file name without extension
      const fileName = key.split('/').pop().split('.')[0];
      
      // Navigate to the video creation page with the file key
      router.push(`/dashboard/manual-topics?videoKey=${encodeURIComponent(key)}&title=${encodeURIComponent(fileName)}`);
    } catch (err) {
      console.error('Error navigating to video creation:', err);
      setError('Failed to prepare YouTube upload. Please try again later.');
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
    try {
      return new Date(date).toLocaleString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Unknown date';
    }
  };

  // Get user info from context or session storage
  const getUserInfo = () => {
    if (user) {
      return {
        name: user.name || user.email || 'User',
        email: user.email || 'user@example.com',
        id: user.id || 'demo-user'
      };
    }
    
    // Fallback to session storage
    if (typeof window !== 'undefined') {
      const userEmail = window.sessionStorage.getItem('userEmail') || 'user@example.com';
      const name = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      return {
        name: formattedName,
        email: userEmail,
        id: 'demo-user'
      };
    }
    
    return {
      name: 'User',
      email: 'user@example.com',
      id: 'demo-user'
    };
  };

  const userInfo = getUserInfo();

  // Calculate storage limit based on subscription
  const storageLimit = subscription?.limits?.storageGB || 1;
  const storageUsedPercentage = (parseFloat(storageUsage.gigabytes) / storageLimit) * 100;

  // Loading state
  if (loading && !isSessionValid) {
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
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className={`block w-full px-4 py-2 rounded-md transition-colors text-center cursor-pointer ${
                  isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Select File'}
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
            <button 
              onClick={() => setError(null)} 
              className="ml-4 px-2 py-1 bg-red-800 hover:bg-red-700 rounded-md text-xs"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {loadingFiles ? (
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
                          src="https://via.placeholder.com/150?text=Image"
                          alt={file.key.split('/').pop()}
                          className="object-cover w-full h-full"
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
            
            {/* No Files Message */}
            {Object.values(files).every(category => category.length === 0) && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
                <p className="text-gray-400">You don't have any files yet. Upload your first file to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
