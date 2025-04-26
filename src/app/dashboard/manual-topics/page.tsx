'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
// Updated import path to use the browser-compatible version
import { validateYouTubeApiKey, uploadVideo, getChannelInfo } from '../../lib/youtube-api';

function ManualTopicsPage() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [niche, setNiche] = useState('Technology');
  const [topicCount, setTopicCount] = useState(5);
  const [creatingVideo, setCreatingVideo] = useState(false);
  const [videoCreated, setVideoCreated] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [youtubeApiStatus, setYoutubeApiStatus] = useState('not_connected');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [channelInfo, setChannelInfo] = useState(null);
  const [isValidatingApiKey, setIsValidatingApiKey] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Sample niches
  const niches = [
    'Technology', 'Gaming', 'Cooking', 'Fitness', 'Travel', 
    'Finance', 'Education', 'Fashion', 'Beauty', 'DIY'
  ];
  
  // Check for YouTube API key on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        // Fetch API key from backend instead of localStorage
        const response = await fetch('/api/api-keys?userId=' + user?.id);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.youtubeApiKey) {
            setYoutubeApiKey(data.youtubeApiKey);
            setYoutubeApiStatus('connected');
            
            // Get channel info if API key is available
            try {
              const result = await getChannelInfo(data.youtubeApiKey);
              if (result.success) {
                setChannelInfo(result.channel);
              }
            } catch (error) {
              console.error('Error fetching channel info:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error checking API key:', error);
      }
    };
    
    if (user) {
      checkApiKey();
    }
  }, [user]);
  
  // Mock function to generate topics
  const generateTopics = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockTopics = [
        {
          id: 1,
          title: '10 AI Tools That Will Revolutionize Content Creation in 2025',
          description: 'Explore cutting-edge AI tools that are changing how creators produce videos, graphics, and written content.',
          score: 92,
        },
        {
          id: 2,
          title: 'How to Build a Passive Income YouTube Channel Without Showing Your Face',
          description: 'Learn strategies for creating successful YouTube content while maintaining privacy and automating your workflow.',
          score: 88,
        },
        {
          id: 3,
          title: 'The Ultimate Guide to YouTube SEO: Double Your Views in 30 Days',
          description: 'Master YouTube\'s algorithm with proven SEO techniques that will significantly increase your video visibility.',
          score: 85,
        },
        {
          id: 4,
          title: 'I Tested 5 Video Editing Software and Found the Best One for Beginners',
          description: 'A comprehensive comparison of popular video editing tools with a focus on ease of use and features for new creators.',
          score: 79,
        },
        {
          id: 5,
          title: 'How to Create Viral Short-Form Videos That Convert Viewers to Subscribers',
          description: 'Strategies for creating compelling short videos that not only go viral but also drive channel growth.',
          score: 83,
        },
      ];
      
      setGeneratedTopics(mockTopics);
      setIsGenerating(false);
    }, 2000);
  };
  
  // Mock function to create a video
  const createVideo = () => {
    setCreatingVideo(true);
    setUploadSuccess(false);
    setUploadError('');
    
    // Simulate API call delay
    setTimeout(() => {
      const mockVideoData = {
        id: `video-${Date.now()}`,
        title: videoTitle || selectedTopic.title,
        description: videoDescription || selectedTopic.description,
        thumbnailUrl: 'https://via.placeholder.com/1280x720/1a1a1a/4ade80?text=AI+Generated+Thumbnail',
        videoUrl: 'https://example.com/sample-video.mp4',
        duration: '10:24',
        status: 'ready',
        createdAt: new Date().toISOString(),
        fileSize: '128.5 MB',
        format: 'MP4 (1080p)',
      };
      
      setVideoData(mockVideoData);
      setCreatingVideo(false);
      setVideoCreated(true);
    }, 3000);
  };
  
  // Function to preview the video
  const previewVideo = () => {
    if (!videoData) return;
    setPreviewMode(true);
  };
  
  // Function to upload to YouTube
  const uploadToYoutube = async () => {
    if (youtubeApiStatus !== 'connected') {
      setUploadError('YouTube API not connected. Please add your API key in settings.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    
    try {
      // Update progress periodically to simulate upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 800);
      
      // Use the YouTube API helper to upload the video
      const result = await uploadVideo(
        youtubeApiKey, 
        {
          title: videoData.title,
          description: videoData.description,
          tags: [niche, 'YouTube', 'Content Creation', 'Tutorial', 'How To'],
          privacyStatus: 'private' // Start as private for safety
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        setUploadSuccess(true);
        // Store the video ID and URL for future reference
        setVideoData({
          ...videoData,
          youtubeVideoId: result.videoId,
          youtubeVideoUrl: result.url
        });
        
        // Save the upload record to the backend
        await fetch('/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'save-upload',
            userId: user.id,
            videoId: result.videoId,
            videoUrl: result.url,
            videoTitle: videoData.title,
            videoDescription: videoData.description
          }),
        });
      } else {
        setUploadError(result.error || 'Failed to upload to YouTube');
      }
    } catch (error) {
      console.error('Error during YouTube upload:', error);
      setUploadError(error.message || 'An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Function to save YouTube API key
  const saveYoutubeApiKey = async () => {
    if (!youtubeApiKey.trim()) {
      setUploadError('Please enter a valid API key');
      return;
    }
    
    setIsValidatingApiKey(true);
    setUploadError('');
    
    try {
      // Validate the API key
      const validationResult = await validateYouTubeApiKey(youtubeApiKey);
      
      if (validationResult.valid) {
        // Save the API key to the backend
        const response = await fetch('/api/api-keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'save',
            userId: user.id,
            youtubeApiKey: youtubeApiKey
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setYoutubeApiStatus('connected');
          
          // Get channel info
          const channelResult = await getChannelInfo(youtubeApiKey);
          if (channelResult.success) {
            setChannelInfo(channelResult.channel);
          }
        } else {
          throw new Error(data.error || 'Failed to save API key');
        }
      } else {
        setUploadError(validationResult.message || 'Invalid API key');
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setUploadError(error.message || 'Failed to validate API key');
    } finally {
      setIsValidatingApiKey(false);
    }
  };
  
  // Function to open YouTube video in new tab
  const openYouTubeVideo = () => {
    if (videoData?.youtubeVideoUrl) {
      window.open(videoData.youtubeVideoUrl, '_blank');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Create Video</span>
            </h1>
            <div className="flex space-x-3">
              <Link href="/dashboard" className="py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-colors text-sm">
                Back to Dashboard
              </Link>
              <Link href="/dashboard/topic-scheduler" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors text-sm">
                Schedule Videos
              </Link>
            </div>
          </div>
          
          {!selectedTopic && !videoCreated ? (
            <>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Generate Video Topics</h2>
                <p className="text-gray-300 mb-6">
                  Our AI will generate engaging video topic ideas based on your niche and preferences.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content Niche
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {niches.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Topics
                    </label>
                    <select
                      value={topicCount}
                      onChange={(e) => setTopicCount(parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={3}>3 Topics</option>
                      <option value={5}>5 Topics</option>
                      <option value={10}>10 Topics</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={generateTopics}
                  disabled={isGenerating}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Topics...
                    </span>
                  ) : 'Generate Topics'}
                </button>
              </div>
              
              {/* YouTube API Status */}
              {youtubeApiStatus !== 'connected' && (
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Connect YouTube API</h2>
                  <p className="text-gray-300 mb-4">
                    To upload videos directly to YouTube, you need to connect your YouTube API key.
                  </p>
                  
                  <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">
                        YouTube API Key
                      </label>
                      <input
                        type="text"
                        value={youtubeApiKey}
                        onChange={(e) => setYoutubeApiKey(e.target.value)}
                        placeholder="Enter your YouTube API Key"
                        className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={saveYoutubeApiKey}
                      disabled={isValidatingApiKey}
                      className="py-2 px-6 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isValidatingApiKey ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connecting...
                        </span>
                      ) : 'Connect'}
                    </button>
                  </div>
                  
                  {uploadError && (
                    <p className="mt-3 text-red-400 text-sm">{uploadError}</p>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-400">
                    <p>For testing purposes, you can use any API key that starts with "AIza" to simulate a successful connection.</p>
                    <p className="mt-2">
                      <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        Learn how to get your YouTube API key →
                      </a>
                    </p>
                  </div>
                </div>
              )}
              
              {/* YouTube Channel Info (if connected) */}
              {youtubeApiStatus === 'connected' && channelInfo && (
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Connected YouTube Channel</h2>
                    <span className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-xs">Connected</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 mr-4">
                      <img src={channelInfo.thumbnailUrl} alt="Channel thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{channelInfo.title}</h3>
                      <p className="text-gray-400 text-sm">{channelInfo.customUrl}</p>
                      <div className="flex space-x-4 mt-2 text-sm text-gray-300">
                        <span>{channelInfo.statistics.subscriberCount} subscribers</span>
                        <span>{channelInfo.statistics.videoCount} videos</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Generated Topics */}
              {generatedTopics.length > 0 && (
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Generated Topics</h2>
                  <p className="text-gray-300 mb-6">
                    Select a topic to create a video. Topics are ranked by potential engagement score.
                  </p>
                  
                  <div className="space-y-4">
                    {generatedTopics.map((topic) => (
                      <div 
                        key={topic.id}
                        className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer border border-gray-600"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">{topic.title}</h3>
                          <div className="bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs flex items-center">
                            <span className="mr-1">Score:</span>
                            <span className="font-bold">{topic.score}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 mt-2">{topic.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : selectedTopic && !videoCreated ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Create Video from Topic</h2>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Topics
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">{selectedTopic.title}</h3>
                <p className="text-gray-300">{selectedTopic.description}</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder={selectedTopic.title}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video Description
                  </label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder={selectedTopic.description}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={createVideo}
                    disabled={creatingVideo}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {creatingVideo ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Video...
                      </span>
                    ) : 'Create Video'}
                  </button>
                </div>
              </div>
            </div>
          ) : videoCreated && !previewMode ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Video Created</h2>
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    setVideoCreated(false);
                    setVideoData(null);
                    setUploadSuccess(false);
                    setUploadError('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Create Another Video
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video relative">
                    <img 
                      src={videoData.thumbnailUrl} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={previewVideo}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-colors"
                      >
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">{videoData.title}</h3>
                  <p className="text-gray-300 mb-4">{videoData.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span>{videoData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span>{videoData.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Size:</span>
                      <span>{videoData.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span>{new Date(videoData.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Preview Button */}
                  <button
                    onClick={previewVideo}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors mb-3"
                  >
                    Preview Video
                  </button>
                  
                  {/* Upload to YouTube Button */}
                  {!uploadSuccess ? (
                    <button
                      onClick={uploadToYoutube}
                      disabled={isUploading || youtubeApiStatus !== 'connected'}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors mb-3 ${
                        youtubeApiStatus !== 'connected'
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading to YouTube...
                        </span>
                      ) : (
                        'Upload to YouTube'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={openYouTubeVideo}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors mb-3"
                    >
                      View on YouTube
                    </button>
                  )}
                  
                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Upload Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Success Message */}
                  {uploadSuccess && (
                    <div className="mt-3 p-3 bg-green-900/30 border border-green-800 rounded-md">
                      <p className="text-green-400 text-sm">
                        Video successfully uploaded to YouTube! It may take a few minutes to process.
                      </p>
                    </div>
                  )}
                  
                  {/* Upload Error Message */}
                  {uploadError && (
                    <div className="mt-3 p-3 bg-red-900/30 border border-red-800 rounded-md">
                      <p className="text-red-400 text-sm">{uploadError}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : previewMode && videoData ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Video Preview</h2>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Video Details
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-black rounded-lg overflow-hidden aspect-video">
                  {/* Video player - in a real app, this would be an actual video player */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center p-8">
                      <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-xl font-medium text-gray-400 mb-2">Video Preview</h3>
                      <p className="text-gray-500">
                        This is a simulated preview. In the actual application, this would be a real video player showing your generated content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">{videoData.title}</h3>
                  <p className="text-gray-300">{videoData.description}</p>
                </div>
                
                <div className="space-y-4">
                  {/* Upload to YouTube Button */}
                  {!uploadSuccess ? (
                    <button
                      onClick={uploadToYoutube}
                      disabled={isUploading || youtubeApiStatus !== 'connected'}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        youtubeApiStatus !== 'connected'
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isUploading ? 'Uploading...' : 'Upload to YouTube'}
                    </button>
                  ) : (
                    <button
                      onClick={openYouTubeVideo}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
                    >
                      View on YouTube
                    </button>
                  )}
                  
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                  >
                    Back to Details
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default withAuth(ManualTopicsPage);
