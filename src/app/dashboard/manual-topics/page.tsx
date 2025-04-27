'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/app/components/dashboard-header';

export default function ManualTopicsPage() {
  const { user, loading, subscription } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('technology');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [thumbnailKey, setThumbnailKey] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([
    { id: 'technology', name: 'Technology' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'education', name: 'Education' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'lifestyle', name: 'Lifestyle' }
  ]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);

  // Check session storage to maintain login state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = window.sessionStorage.getItem('isLoggedIn');
      const userEmail = window.sessionStorage.getItem('userEmail');
      
      if (isLoggedIn && userEmail) {
        setIsSessionValid(true);
      } else if (!loading && !user) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Initialize page data
  useEffect(() => {
    if (user || isSessionValid) {
      // Check for URL parameters
      if (typeof window !== 'undefined') {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const videoKeyParam = urlParams.get('videoKey');
          const titleParam = urlParams.get('title');
          
          if (videoKeyParam) {
            setVideoKey(videoKeyParam);
            if (titleParam) {
              setTitle(titleParam);
              setTopic(titleParam);
            }
          }
        } catch (err) {
          console.error('Error parsing URL parameters:', err);
          // Continue without URL parameters
        }
      }
    }
  }, [user, isSessionValid, router]);

  // Generate video content with error handling
  const generateContent = async () => {
    if (!topic) {
      setError('Please enter a topic');
      return;
    }
    
    try {
      setGenerating(true);
      setError(null);
      
      // Mock successful content generation for demo
      setTimeout(() => {
        const mockVideoData = {
          title: `How to ${topic} - Complete Guide`,
          description: `A comprehensive guide about ${topic}. Learn everything you need to know about this fascinating subject.`,
          tags: topic.split(' ').map(word => word.toLowerCase()),
          script: `Welcome to this video about ${topic}.\n\nIn this comprehensive guide, we'll explore everything you need to know about ${topic}.\n\nFirst, let's start with the basics...\n\n[Content continues for 5-10 minutes]\n\nThanks for watching! If you enjoyed this video, please like and subscribe for more content.`,
          videoKey: 'mock-video-key',
          thumbnailKey: 'mock-thumbnail-key'
        };
        
        setVideoData(mockVideoData);
        setTitle(mockVideoData.title);
        setGenerating(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again later.');
      setGenerating(false);
      
      // Fallback content for demo purposes
      const fallbackVideoData = {
        title: `${topic} - Video Guide`,
        description: `A guide about ${topic}.`,
        tags: [topic.toLowerCase()],
        script: `This is a fallback script about ${topic}.`,
        videoKey: 'fallback-video-key',
        thumbnailKey: 'fallback-thumbnail-key'
      };
      
      setVideoData(fallbackVideoData);
      setTitle(fallbackVideoData.title);
    }
  };

  // Upload to YouTube with comprehensive error handling
  const uploadToYouTube = async () => {
    if (!videoData && !videoKey) {
      setError('Please generate content first or select a video');
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 1000);
      
      // Simulate successful upload after delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Show success message
        alert(`Video uploaded successfully! YouTube URL: https://youtube.com/watch?v=demo-video-id`);
        
        // Reset form
        setVideoData(null);
        setVideoKey(null);
        setThumbnailKey(null);
        setTitle('');
        setTopic('');
        setUploading(false);
        
        // Redirect to dashboard
        router.push('/dashboard');
      }, 5000);
      
    } catch (err) {
      console.error('Error uploading to YouTube:', err);
      setError('Failed to upload to YouTube. Please try again later.');
      setUploading(false);
      
      // Always ensure progress interval is cleared on error
      clearInterval(progressInterval);
    }
  };

  // Get user info from context or session storage
  const getUserInfo = () => {
    if (user) {
      return {
        name: user.name || user.email || 'User',
        email: user.email || 'user@example.com'
      };
    }
    
    // Fallback to session storage
    if (typeof window !== 'undefined') {
      const userEmail = window.sessionStorage.getItem('userEmail') || 'user@example.com';
      const name = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      return {
        name: formattedName,
        email: userEmail
      };
    }
    
    return {
      name: 'User',
      email: 'user@example.com'
    };
  };

  const userInfo = getUserInfo();

  // Loading state
  if (loading && !isSessionValid) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <DashboardHeader />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading...</p>
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
        <h1 className="text-3xl font-bold mb-8">Create Video</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Video Details</h2>
              
              {error && (
                <div className="bg-red-900 text-white p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic for your video"
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={generating || uploading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={generating || uploading || loadingCategories}
                  >
                    {loadingCategories ? (
                      <option>Loading categories...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <button
                  onClick={generateContent}
                  disabled={!topic || generating || uploading}
                  className={`w-full px-4 py-2 rounded-md transition-colors ${
                    !topic || generating || uploading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {generating ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      Generating...
                    </span>
                  ) : (
                    'Generate Content'
                  )}
                </button>
              </div>
            </div>
            
            {(videoData || videoKey) && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Upload to YouTube</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for your video"
                      className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={uploading}
                    />
                  </div>
                  
                  {videoKey && (
                    <div className="p-4 bg-gray-700 rounded-md">
                      <p className="text-sm">
                        <span className="font-medium">Selected Video:</span> {videoKey.split('/').pop()}
                      </p>
                    </div>
                  )}
                  
                  {videoData && videoData.script && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Video Script</label>
                      <div className="p-4 bg-gray-700 rounded-md max-h-60 overflow-y-auto">
                        <p className="text-sm whitespace-pre-line">{videoData.script}</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={uploadToYouTube}
                    disabled={uploading}
                    className={`w-full px-4 py-2 rounded-md transition-colors ${
                      uploading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Uploading... {uploadProgress}%
                      </span>
                    ) : (
                      'Upload to YouTube'
                    )}
                  </button>
                  
                  {uploading && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-red-600" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Plan</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Current Plan</p>
                  <p className="font-medium">{subscription?.planName || 'Free'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Videos Remaining</p>
                  <p className="font-medium">{subscription?.limits?.videosPerMonth || 5} videos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Storage Limit</p>
                  <p className="font-medium">{subscription?.limits?.storageGB || 1} GB</p>
                </div>
                <button 
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full"
                  onClick={() => router.push('/pricing')}
                >
                  {subscription?.planId === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Tips</h2>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Be specific with your topic for better results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Choose the right category for your content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Review and edit the generated content before uploading</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Use trending topics for more views</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Upload videos during peak hours for your audience</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-gray-700 rounded-md">
                <p className="text-xs text-gray-400">
                  Need help? Check out our <a href="/guides" className="text-blue-400 hover:underline">guides</a> or <a href="/support" className="text-blue-400 hover:underline">contact support</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
