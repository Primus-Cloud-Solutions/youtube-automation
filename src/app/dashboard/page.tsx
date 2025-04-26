'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '../utils/with-auth';
import DashboardHeader from '../components/dashboard-header';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

function DashboardPage() {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recentVideos, setRecentVideos] = useState([
    {
      id: 'video-1',
      title: 'Top 10 AI Tools for Content Creators',
      thumbnail: 'https://via.placeholder.com/120x68/1a1a1a/4ade80?text=AI+Tools',
      status: 'published',
      date: '2 days ago',
      views: 1243
    },
    {
      id: 'video-2',
      title: 'How to Grow Your YouTube Channel in 2025',
      thumbnail: 'https://via.placeholder.com/120x68/1a1a1a/3b82f6?text=Growth+Tips',
      status: 'scheduled',
      date: '3 days ago',
      scheduledFor: 'Tomorrow, 9:00 AM'
    },
    {
      id: 'video-3',
      title: 'The Ultimate Guide to YouTube SEO',
      thumbnail: 'https://via.placeholder.com/120x68/1a1a1a/a855f7?text=YouTube+SEO',
      status: 'draft',
      date: '5 days ago'
    }
  ]);
  
  // Mock stats that would come from an API in a real app
  const stats = {
    videosCreated: 12,
    videosScheduled: 5,
    topicsGenerated: 28,
    viewsThisMonth: 15420,
    subscribersGained: 342,
    videosRemaining: 8
  };
  
  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {showTutorial && (
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg shadow-lg p-6 mb-8 relative">
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-green-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Getting Started with TubeAutomator
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="text-green-400 mb-2 text-lg font-bold">Step 1</div>
                  <h3 className="font-medium mb-2">Generate Video Topics</h3>
                  <p className="text-gray-300 text-sm">Use AI to generate engaging video topics based on your niche and trending subjects.</p>
                  <Link href="/dashboard/manual-topics" className="mt-3 inline-flex items-center text-green-400 text-sm hover:underline">
                    Create Topics
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="text-blue-400 mb-2 text-lg font-bold">Step 2</div>
                  <h3 className="font-medium mb-2">Create Video Content</h3>
                  <p className="text-gray-300 text-sm">Turn your topics into complete videos with AI-generated scripts, voiceovers, and visuals.</p>
                  <Link href="/dashboard/manual-topics" className="mt-3 inline-flex items-center text-blue-400 text-sm hover:underline">
                    Create Videos
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="text-purple-400 mb-2 text-lg font-bold">Step 3</div>
                  <h3 className="font-medium mb-2">Schedule & Publish</h3>
                  <p className="text-gray-300 text-sm">Schedule your videos for optimal posting times and track their performance.</p>
                  <Link href="/dashboard/topic-scheduler" className="mt-3 inline-flex items-center text-purple-400 text-sm hover:underline">
                    Schedule Content
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Dashboard</span>
              <span className="ml-3 text-sm bg-green-900/50 text-green-300 px-2 py-1 rounded-full">Pro Plan</span>
            </h1>
            
            <div className="flex space-x-3">
              <Link 
                href="/dashboard/manual-topics" 
                className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Video
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-green-500 mr-2">👋</span>
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h2>
            <p className="text-gray-300 mb-4">
              Your YouTube content automation platform is ready to help you create engaging videos and grow your channel.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-5 rounded-lg shadow-md border border-gray-700">
                <h3 className="font-medium mb-2 text-gray-300">Videos Created</h3>
                <p className="text-3xl font-bold text-green-500">{isLoading ? '-' : stats.videosCreated}</p>
                <div className="mt-2 text-xs text-gray-400 flex items-center">
                  <span className="text-green-400 mr-1">↑ 3</span> from last week
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-5 rounded-lg shadow-md border border-gray-700">
                <h3 className="font-medium mb-2 text-gray-300">Scheduled</h3>
                <p className="text-3xl font-bold text-blue-500">{isLoading ? '-' : stats.videosScheduled}</p>
                <div className="mt-2 text-xs text-gray-400 flex items-center">
                  <span className="text-blue-400 mr-1">↑ 2</span> from last week
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-5 rounded-lg shadow-md border border-gray-700">
                <h3 className="font-medium mb-2 text-gray-300">Views This Month</h3>
                <p className="text-3xl font-bold text-purple-500">{isLoading ? '-' : stats.viewsThisMonth.toLocaleString()}</p>
                <div className="mt-2 text-xs text-gray-400 flex items-center">
                  <span className="text-purple-400 mr-1">↑ 12%</span> from last month
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-5 rounded-lg shadow-md border border-gray-700">
                <h3 className="font-medium mb-2 text-gray-300">New Subscribers</h3>
                <p className="text-3xl font-bold text-yellow-500">{isLoading ? '-' : stats.subscribersGained}</p>
                <div className="mt-2 text-xs text-gray-400 flex items-center">
                  <span className="text-yellow-400 mr-1">↑ 8%</span> from last month
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <span className="text-green-500 mr-2">🎬</span>
                    Recent Videos
                  </h2>
                  <Link href="/dashboard/manual-topics" className="text-sm text-green-400 hover:text-green-300">
                    View All
                  </Link>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : recentVideos.length > 0 ? (
                  <div className="space-y-4">
                    {recentVideos.map(video => (
                      <div key={video.id} className="flex border-b border-gray-700 pb-4">
                        <div className="flex-shrink-0 w-30 h-17 bg-gray-700 rounded overflow-hidden">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{video.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              video.status === 'published' ? 'bg-green-900/50 text-green-400' :
                              video.status === 'scheduled' ? 'bg-blue-900/50 text-blue-400' :
                              'bg-gray-700 text-gray-400'
                            }`}>
                              {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">{video.date}</span>
                          </div>
                          {video.status === 'published' && (
                            <div className="mt-2 text-xs text-gray-400">
                              {video.views} views
                            </div>
                          )}
                          {video.status === 'scheduled' && (
                            <div className="mt-2 text-xs text-gray-400">
                              Scheduled for {video.scheduledFor}
                            </div>
                          )}
                          <div className="mt-2 flex space-x-2">
                            <button className="text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors">
                              Edit
                            </button>
                            {video.status === 'published' && (
                              <button className="text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors">
                                Analytics
                              </button>
                            )}
                            {video.status === 'draft' && (
                              <button className="text-xs text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 px-2 py-1 rounded transition-colors">
                                Continue Editing
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">You haven't created any videos yet</p>
                    <Link href="/dashboard/manual-topics" className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors inline-block">
                      Create Your First Video
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-green-500 mr-2">⚡</span>
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <Link href="/dashboard/manual-topics" className="block w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-md font-medium transition-colors text-center shadow-md">
                    Generate New Video Topics
                  </Link>
                  <Link href="/dashboard/topic-scheduler" className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md font-medium transition-colors text-center shadow-md">
                    Schedule Content
                  </Link>
                  <Link href="/dashboard/analytics" className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-md font-medium transition-colors text-center shadow-md">
                    View Analytics
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-green-500 mr-2">💎</span>
                  Subscription Status
                </h2>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-lg">Professional Plan</p>
                    <span className="ml-2 px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">Active</span>
                  </div>
                  <p className="text-gray-400">20 AI-generated videos per month</p>
                  <div className="mt-3 bg-gray-700 rounded-full h-2 w-full">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${(stats.videosCreated / 20) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-400">{stats.videosCreated} used</p>
                    <p className="text-xs text-gray-400">{stats.videosRemaining} remaining</p>
                  </div>
                  <p className="text-green-500 mt-2">Active until May 25, 2025</p>
                  
                  <Link href="/pricing" className="mt-4 block w-full py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-md font-medium transition-colors text-center shadow-md">
                    Manage Subscription
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
