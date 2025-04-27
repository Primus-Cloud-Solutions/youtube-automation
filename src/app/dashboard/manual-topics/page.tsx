'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';
import Link from 'next/link';
import { useAuth } from '../../context/auth-context';
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
  
  // Sample niches
  const niches = [
    'Technology', 'Gaming', 'Cooking', 'Fitness', 'Travel', 
    'Finance', 'Education', 'Fashion', 'Beauty', 'DIY'
  ];
  
  // Check for YouTube API key on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      // In a real app, this would fetch from user settings or backend
      const storedApiKey = localStorage.getItem('youtube_api_key');
      if (storedApiKey) {
        setYoutubeApiKey(storedApiKey);
        setYoutubeApiStatus('connected');
        
        // Get channel info if API key is available
        try {
          const result = await getChannelInfo(storedApiKey);
          if (result.success) {
            setChannelInfo(result.channel);
          }
        } catch (error) {
          console.error('Error fetching channel info:', error);
        }
      }
    };
    
    checkApiKey();
  }, []);
  
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
      
      if (result.success) {
        setUploadSuccess(true);
        // Store the video ID and URL for future reference
        setVideoData({
          ...videoData,
          youtubeVideoId: result.videoId,
          youtubeVideoUrl: result.url
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
        // Save the API key
        localStorage.setItem('youtube_api_key', youtubeApiKey);
        setYoutubeApiStatus('connected');
        
        // Get channel info
        const channelResult = await getChannelInfo(youtubeApiKey);
        if (channelResult.success) {
          setChannelInfo(channelResult.channel);
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
                      <a href="#" className="text-blue-400 hover:underline" onClick={() => alert('This would open YouTube API documentation')}>
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
                  <h2 className="text-xl font-semibold mb-6">Generated Topics</h2>
                  
                  <div className="space-y-4">
                    {generatedTopics.map((topic) => (
                      <div 
                        key={topic.id}
                        className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-green-500 transition-colors cursor-pointer"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">{topic.title}</h3>
                          <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs">
                            Score: {topic.score}/100
                          </span>
                        </div>
                        <p className="text-gray-300 mt-2">{topic.description}</p>
                        <button 
                          className="mt-4 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTopic(topic);
                          }}
                        >
                          Select Topic
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : selectedTopic && !videoCreated ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Create Video</h2>
                <button 
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={() => setSelectedTopic(null)}
                >
                  ← Back to Topics
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{selectedTopic.title}</h3>
                  <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs">
                    Score: {selectedTopic.score}/100
                  </span>
                </div>
                <p className="text-gray-300 mt-2">{selectedTopic.description}</p>
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
                  <p className="mt-1 text-xs text-gray-400">Leave blank to use the topic title</p>
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
                  <p className="mt-1 text-xs text-gray-400">Leave blank to use the topic description</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Video Style
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="educational">Educational</option>
                      <option value="entertaining">Entertaining</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="vlog">Vlog Style</option>
                      <option value="news">News Format</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Video Length
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="short">Short (3-5 min)</option>
                      <option value="medium">Medium (8-12 min)</option>
                      <option value="long">Long (15-20 min)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Voice Style
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="male1">Male - Professional</option>
                      <option value="male2">Male - Casual</option>
                      <option value="female1">Female - Professional</option>
                      <option value="female2">Female - Casual</option>
                      <option value="neutral">Gender Neutral</option>
                    </select>
                  </div>
                </div>
                
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
          ) : videoCreated && videoData && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Video Created</h2>
                <button 
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={() => {
                    setSelectedTopic(null);
                    setVideoCreated(false);
                    setVideoData(null);
                  }}
                >
                  ← Create Another Video
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={videoData.thumbnailUrl} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="font-medium text-lg mb-2">{videoData.title}</h3>
                  <p className="text-gray-300 mb-4">{videoData.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="font-medium">{videoData.duration}</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">File Size</p>
                      <p className="font-medium">{videoData.fileSize}</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Format</p>
                      <p className="font-medium">{videoData.format}</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Created</p>
                      <p className="font-medium">{new Date(videoData.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="font-medium text-lg mb-4">Upload to YouTube</h3>
                    
                    {youtubeApiStatus !== 'connected' ? (
                      <div>
                        <p className="text-gray-300 mb-4">
                          To upload this video to YouTube, you need to connect your YouTube API key.
                        </p>
                        
                        <div className="flex flex-col space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              YouTube API Key
                            </label>
                            <input
                              type="text"
                              value={youtubeApiKey}
                              onChange={(e) => setYoutubeApiKey(e.target.value)}
                              placeholder="Enter your YouTube API Key"
                              className="w-full px-4 py-2 rounded-md bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <button
                            onClick={saveYoutubeApiKey}
                            disabled={isValidatingApiKey}
                            className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isValidatingApiKey ? 'Connecting...' : 'Connect YouTube API'}
                          </button>
                        </div>
                        
                        {uploadError && (
                          <p className="mt-3 text-red-400 text-sm">{uploadError}</p>
                        )}
                      </div>
                    ) : !isUploading && !uploadSuccess ? (
                      <div>
                        <p className="text-gray-300 mb-4">
                          Your YouTube account is connected. You can now upload this video directly to YouTube.
                        </p>
                        
                        <button
                          onClick={uploadToYoutube}
                          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors"
                        >
                          Upload to YouTube
                        </button>
                        
                        {uploadError && (
                          <p className="mt-3 text-red-400 text-sm">{uploadError}</p>
                        )}
                      </div>
                    ) : isUploading ? (
                      <div>
                        <p className="text-gray-300 mb-4">
                          Uploading your video to YouTube...
                        </p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Upload Progress</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2.5">
                            <div 
                              className="bg-red-600 h-2.5 rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">This may take several minutes depending on your connection speed</p>
                        </div>
                      </div>
                    ) : uploadSuccess && videoData.youtubeVideoId ? (
                      <div>
                        <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <p className="font-medium text-green-400">Upload Successful!</p>
                          </div>
                          <p className="text-gray-300 mt-2">
                            Your video has been successfully uploaded to YouTube and is now being processed.
                          </p>
                        </div>
                        
                        <div className="bg-gray-600 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium mb-2">YouTube Video ID</p>
                          <p className="font-mono text-gray-300">{videoData.youtubeVideoId}</p>
                        </div>
                        
                        <a 
                          href={videoData.youtubeVideoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors text-center"
                        >
                          View on YouTube
                        </a>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="font-medium text-lg mb-4">Next Steps</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                          <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-300">Video created successfully</p>
                      </div>
                      
                      {uploadSuccess ? (
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                            <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="ml-3 text-gray-300">Uploaded to YouTube</p>
                        </div>
                      ) : (
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                            <div className="absolute inset-0 bg-gray-500 rounded-full"></div>
                            <div className="h-5 w-5 flex items-center justify-center">
                              <span className="text-white text-xs">2</span>
                            </div>
                          </div>
                          <p className="ml-3 text-gray-300">Upload to YouTube</p>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                          <div className="absolute inset-0 bg-gray-500 rounded-full"></div>
                          <div className="h-5 w-5 flex items-center justify-center">
                            <span className="text-white text-xs">3</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-300">Schedule more videos</p>
                          <Link href="/dashboard/topic-scheduler" className="text-blue-400 text-sm hover:underline">
                            Go to scheduler →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default withAuth(ManualTopicsPage);
