'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard-header';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for charts - would be replaced with real API data
const viewsData = [
  { name: 'Mon', views: 4000 },
  { name: 'Tue', views: 3000 },
  { name: 'Wed', views: 5000 },
  { name: 'Thu', views: 2780 },
  { name: 'Fri', views: 1890 },
  { name: 'Sat', views: 2390 },
  { name: 'Sun', views: 3490 },
];

const subscribersData = [
  { name: 'Week 1', subscribers: 120 },
  { name: 'Week 2', subscribers: 145 },
  { name: 'Week 3', subscribers: 190 },
  { name: 'Week 4', subscribers: 220 },
];

const revenueData = [
  { name: 'Jan', revenue: 400 },
  { name: 'Feb', revenue: 600 },
  { name: 'Mar', revenue: 800 },
  { name: 'Apr', revenue: 1200 },
];

// Mock upcoming videos
const upcomingVideos = [
  { id: 1, title: 'Top 10 AI Tools for Content Creators', scheduledFor: '2025-04-28T10:00:00Z', status: 'scheduled' },
  { id: 2, title: 'How to Grow Your YouTube Channel in 2025', scheduledFor: '2025-04-30T14:30:00Z', status: 'scheduled' },
  { id: 3, title: 'Passive Income Strategies for YouTubers', scheduledFor: '2025-05-02T09:15:00Z', status: 'scheduled' },
];

// Mock recent videos
const recentVideos = [
  { id: 101, title: 'YouTube Algorithm Explained', publishedAt: '2025-04-20T15:30:00Z', views: 12500, likes: 850, comments: 230 },
  { id: 102, title: 'How to Edit Videos Like a Pro', publishedAt: '2025-04-15T12:45:00Z', views: 8700, likes: 620, comments: 185 },
];

export default function DashboardPage() {
  const { user, isLoading, subscription, loadingSubscription } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <DashboardHeader />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.user_metadata?.full_name || 'Creator'}</h1>
            <p className="text-gray-400 mt-1">Here's what's happening with your channel</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center">
            {/* Subscription Badge */}
            {subscription && (
              <div className="mb-3 md:mb-0 md:mr-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.planId === 'enterprise' 
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-700' 
                    : subscription.planId === 'pro' 
                    ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                    : subscription.planId === 'basic' 
                    ? 'bg-green-900/50 text-green-300 border border-green-700'
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}>
                  {subscription.planName} Plan
                </span>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center"
                onClick={() => router.push('/dashboard/manual-topics')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Video
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                onClick={() => router.push('/dashboard/topic-scheduler')}
              >
                Schedule Content
              </button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-8 border-b border-gray-800">
          <nav className="flex space-x-8">
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'content' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'revenue' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('revenue')}
            >
              Revenue
            </button>
          </nav>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">Total Views</p>
                    <h3 className="text-2xl font-bold mt-1">24,521</h3>
                    <p className="text-sm text-green-500 mt-1">+12.5% from last week</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">Subscribers</p>
                    <h3 className="text-2xl font-bold mt-1">1,250</h3>
                    <p className="text-sm text-green-500 mt-1">+25 new this week</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">Engagement Rate</p>
                    <h3 className="text-2xl font-bold mt-1">8.7%</h3>
                    <p className="text-sm text-green-500 mt-1">+1.2% from last month</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">Est. Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">$1,245</h3>
                    <p className="text-sm text-green-500 mt-1">+18.3% from last month</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Views Trend</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                        labelStyle={{ color: '#F9FAFB' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Subscriber Growth</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscribersData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                        labelStyle={{ color: '#F9FAFB' }}
                      />
                      <Legend />
                      <Bar dataKey="subscribers" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Upcoming and Recent Videos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Upcoming Videos</h2>
                  <Link href="/dashboard/topic-scheduler" className="text-sm text-green-500 hover:text-green-400">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingVideos.map(video => (
                    <div key={video.id} className="p-4 bg-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">{video.title}</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Scheduled for {formatDate(video.scheduledFor)}</span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {video.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Videos</h2>
                  <Link href="/dashboard/analytics" className="text-sm text-green-500 hover:text-green-400">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentVideos.map(video => (
                    <div key={video.id} className="p-4 bg-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">{video.title}</h3>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Published {formatDate(video.publishedAt)}</span>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <span className="flex items-center text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {video.views.toLocaleString()}
                        </span>
                        <span className="flex items-center text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {video.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          {video.comments.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Channel Analytics</h2>
            <p className="text-gray-400 mb-8">Detailed analytics will be available after you publish your first video.</p>
            
            <div className="text-center">
              <button 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                onClick={() => router.push('/dashboard/manual-topics')}
              >
                Create Your First Video
              </button>
            </div>
          </div>
        )}
        
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Content Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gray-700 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Create Video</h3>
                <p className="text-gray-400 mb-4">Generate new video content with AI</p>
                <button 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors w-full"
                  onClick={() => router.push('/dashboard/manual-topics')}
                >
                  Create Video
                </button>
              </div>
              
              <div className="p-6 bg-gray-700 rounded-lg text-center">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Schedule Content</h3>
                <p className="text-gray-400 mb-4">Plan your content calendar</p>
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full"
                  onClick={() => router.push('/dashboard/topic-scheduler')}
                >
                  Schedule
                </button>
              </div>
              
              <div className="p-6 bg-gray-700 rounded-lg text-center">
                <div className="w-16 h-16 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Manage Storage</h3>
                <p className="text-gray-400 mb-4">View and manage your files</p>
                <button 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors w-full"
                  onClick={() => router.push('/dashboard/storage')}
                >
                  Storage
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Revenue Analytics</h2>
            
            <div className="mb-8">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                      labelStyle={{ color: '#F9FAFB' }}
                      formatter={(value) => [`$${value}`, 'Revenue']}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#FBBF24" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">Estimated Monthly Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$1,245</h3>
                <p className="text-sm text-green-500 mt-1">+18.3% from last month</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">Revenue Per 1000 Views</p>
                <h3 className="text-2xl font-bold mt-1">$5.20</h3>
                <p className="text-sm text-green-500 mt-1">+0.8% from last month</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">Top Earning Video</p>
                <h3 className="text-lg font-medium mt-1 truncate">How to Edit Videos Like a Pro</h3>
                <p className="text-sm text-green-500 mt-1">$320 this month</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
