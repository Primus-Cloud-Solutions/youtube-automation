"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { withAuth } from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';

const StorageManager = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageUsage, setStorageUsage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Fetch user's files and storage usage on component mount
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchStorageData = async () => {
      try {
        // Fetch storage usage
        const usageResponse = await fetch('/api/storage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get-storage-usage',
            userId: user.id
          }),
        });
        
        const usageData = await usageResponse.json();
        
        if (usageData.success) {
          setStorageUsage(usageData.usage);
        } else {
          console.error('Error fetching storage usage:', usageData.error);
        }
        
        // Fetch file list
        const filesResponse = await fetch('/api/storage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list-files',
            prefix: `users/${user.id}/`
          }),
        });
        
        const filesData = await filesResponse.json();
        
        if (filesData.success) {
          setFiles(filesData.objects);
        } else {
          console.error('Error fetching files:', filesData.error);
        }
      } catch (error) {
        console.error('Error fetching storage data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStorageData();
  }, [user]);
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !user?.id) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setMessage('');
    
    try {
      // Get a pre-signed URL for upload
      const urlResponse = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-upload-url',
          key: `users/${user.id}/uploads/${Date.now()}-${selectedFile.name}`,
          fileType: selectedFile.type
        }),
      });
      
      const urlData = await urlResponse.json();
      
      if (!urlData.success) {
        throw new Error(urlData.error || 'Failed to get upload URL');
      }
      
      // Upload the file directly to S3 using the pre-signed URL
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      // Handle upload completion
      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setMessage('File uploaded successfully!');
          
          // Refresh file list and storage usage
          const [filesResponse, usageResponse] = await Promise.all([
            fetch('/api/storage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'list-files',
                prefix: `users/${user.id}/`
              }),
            }),
            fetch('/api/storage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'get-storage-usage',
                userId: user.id
              }),
            })
          ]);
          
          const filesData = await filesResponse.json();
          const usageData = await usageResponse.json();
          
          if (filesData.success) {
            setFiles(filesData.objects);
          }
          
          if (usageData.success) {
            setStorageUsage(usageData.usage);
          }
          
          setSelectedFile(null);
        } else {
          setMessage(`Upload failed: ${xhr.statusText}`);
        }
        
        setIsUploading(false);
      });
      
      // Handle upload error
      xhr.addEventListener('error', () => {
        setMessage('Upload failed due to a network error');
        setIsUploading(false);
      });
      
      // Start the upload
      xhr.open('PUT', urlData.url);
      xhr.setRequestHeader('Content-Type', selectedFile.type);
      xhr.send(selectedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage(`Error: ${error.message}`);
      setIsUploading(false);
    }
  };
  
  // Handle file deletion
  const handleDelete = async (key) => {
    if (!user?.id) return;
    
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
      
      if (data.success) {
        setMessage('File deleted successfully!');
        
        // Remove the file from the list
        setFiles(files.filter(file => file.key !== key));
        
        // Update storage usage
        const usageResponse = await fetch('/api/storage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get-storage-usage',
            userId: user.id
          }),
        });
        
        const usageData = await usageResponse.json();
        
        if (usageData.success) {
          setStorageUsage(usageData.usage);
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage(`Error: ${error.message}`);
    }
  };
  
  // Get a download URL for a file
  const handleDownload = async (key) => {
    if (!user?.id) return;
    
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
      
      if (data.success) {
        // Open the download URL in a new tab
        window.open(data.url, '_blank');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error getting download URL:', error);
      setMessage(`Error: ${error.message}`);
    }
  };
  
  // Format file size for display
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
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get file type icon
  const getFileTypeIcon = (key) => {
    const extension = key.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'webm':
        return (
          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'mp3':
      case 'wav':
      case 'ogg':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Storage Manager</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Storage Usage */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Storage Usage</h2>
            
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
              </div>
            ) : storageUsage ? (
              <div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Total Storage Used</p>
                  <p className="text-2xl font-bold text-green-400">{storageUsage.gigabytes} GB</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Files Stored</p>
                  <p className="text-2xl font-bold text-green-400">{storageUsage.fileCount}</p>
                </div>
                
                <div className="mt-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-200 bg-green-900">
                          Storage Quota
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-200">
                          {Math.min(Math.round((parseFloat(storageUsage.gigabytes) / 10) * 100), 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                      <div 
                        style={{ width: `${Math.min(Math.round((parseFloat(storageUsage.gigabytes) / 10) * 100), 100)}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">10 GB total storage available</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No storage data available</p>
            )}
          </div>
          
          {/* Upload File */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Upload File</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                disabled={isUploading}
              />
            </div>
            
            {selectedFile && (
              <div className="mb-4 p-3 bg-gray-700 rounded-md">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(selectedFile.size)}</p>
              </div>
            )}
            
            {isUploading && (
              <div className="mb-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-200 bg-green-900">
                        Uploading
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-200">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div 
                      style={{ width: `${uploadProgress}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
            
            {message && (
              <div className={`mt-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                {message}
              </div>
            )}
          </div>
          
          {/* Storage Info */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Storage Information</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-md">
                <h3 className="font-medium mb-2">Supported File Types</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>Videos: MP4, MOV, AVI, WEBM</li>
                  <li>Audio: MP3, WAV, OGG</li>
                  <li>Images: JPG, PNG, GIF</li>
                  <li>Documents: PDF, DOCX, TXT</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-700 rounded-md">
                <h3 className="font-medium mb-2">File Size Limits</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>Videos: Up to 2 GB</li>
                  <li>Audio: Up to 500 MB</li>
                  <li>Images: Up to 50 MB</li>
                  <li>Documents: Up to 100 MB</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-700 rounded-md">
                <h3 className="font-medium mb-2">Storage Tips</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>Compress videos before uploading</li>
                  <li>Use MP4 format for best compatibility</li>
                  <li>Delete unused files to free up space</li>
                  <li>Organize files with consistent naming</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* File List */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Your Files</h2>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-800 rounded"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
            </div>
          ) : files.length > 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        File
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {files.map((file, index) => {
                      // Extract filename from key
                      const filename = file.key.split('/').pop();
                      
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {getFileTypeIcon(file.key)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{filename}</div>
                                <div className="text-xs text-gray-400">{file.key}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{formatFileSize(file.size)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{formatDate(file.lastModified)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDownload(file.key)}
                                className="text-blue-400 hover:text-blue-300 transition duration-300"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(file.key)}
                                className="text-red-400 hover:text-red-300 transition duration-300"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No files uploaded yet</h3>
              <p className="text-gray-400">Upload your first file to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(StorageManager);
