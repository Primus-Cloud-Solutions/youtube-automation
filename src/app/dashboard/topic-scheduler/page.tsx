'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard-header';

export default function TopicSchedulerPage() {
  const { user, isLoading, subscription } = useAuth();
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('technology');
  const [frequency, setFrequency] = useState('weekly');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [scheduledTopics, setScheduledTopics] = useState([]);
  const [loadingScheduled, setLoadingScheduled] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchCategories();
      fetchTrendingTopics();
      fetchScheduledTopics();
    }
  }, [user, isLoading, router]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-categories'
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch categories');
      }
      
      setCategories(data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch trending topics
  const fetchTrendingTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-trending-topics',
          category,
          limit: 10
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch trending topics');
      }
      
      setTopics(data.topics);
    } catch (err) {
      console.error('Error fetching trending topics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch scheduled topics
  const fetchScheduledTopics = async () => {
    try {
      setLoadingScheduled(true);
      
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-scheduled-topics',
          userId: user.id
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch scheduled topics');
      }
      
      setScheduledTopics(data.topics);
    } catch (err) {
      console.error('Error fetching scheduled topics:', err);
      // Don't set error for this one, as it's not critical
    } finally {
      setLoadingScheduled(false);
    }
  };

  // Schedule a topic
  const scheduleTopic = async (topic) => {
    try {
      setError(null);
      
      // Check if user has reached their limit
      if (scheduledTopics.length >= (subscription?.limits?.videosPerMonth || 3)) {
        throw new Error('You have reached your monthly limit for scheduled videos. Please upgrade your plan to schedule more videos.');
      }
      
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'schedule-topic',
          userId: user.id,
          topic: topic.title,
          category: topic.category || category,
          frequency,
          metadata: {
            trend_score: topic.trend_score,
            potential_views: topic.potential_views,
            monetization_score: topic.monetization_score
          }
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to schedule topic');
      }
      
      // Refresh scheduled topics
      fetchScheduledTopics();
      
      // Show success message
      alert(`Topic "${topic.title}" scheduled successfully!`);
    } catch (err) {
      console.error('Error scheduling topic:', err);
      setError(err.message);
    }
  };

  // Generate new trending topics
  const generateTrendingTopics = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze-trends',
          category,
          userId: user.id
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate trending topics');
      }
      
      setTopics(data.topics);
    } catch (err) {
      console.error('Error generating trending topics:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Delete a scheduled topic
  const deleteScheduledTopic = async (topicId) => {
    if (!confirm('Are you sure you want to delete this scheduled topic?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete-scheduled-topic',
          userId: user.id,
          topicId
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete scheduled topic');
      }
      
      // Refresh scheduled topics
      fetchScheduledTopics();
    } catch (err) {
      console.error('Error deleting scheduled topic:', err);
      setError(err.message);
    }
  };

  // Format date
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

  // Get available frequencies based on subscription
  const getAvailableFrequencies = () => {
    const frequencies = subscription?.limits?.schedulingFrequency || ['weekly'];
    
    const frequencyOptions = {
      daily: 'Daily',
      every3days: 'Every 3 Days',
      weekly: 'Weekly',
      biweekly: 'Bi-Weekly',
      monthly: 'Monthly'
    };
    
    return frequencies.map(freq => ({
      value: freq,
      label: frequencyOptions[freq] || freq
    }));
  };

  if (isLoading) {
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
        <h1 className="text-3xl font-bold mb-8">Topic Scheduler</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-semibold">Trending Topics</h2>
                
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-1 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading || loadingCategories || generating}
                  >
                    {loadingCategories ? (
                      <option>Loading...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                  
                  <button
                    onClick={() => fetchTrendingTopics()}
                    disabled={loading || generating}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      loading || generating
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>
                  
                  <button
                    onClick={() => generateTrendingTopics()}
                    disabled={generating || loading}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      generating || loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {generating ? 'Analyzing...' : 'Analyze New Trends'}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-900 text-white p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              {loading || generating ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">
                      {generating ? 'Analyzing trends...' : 'Loading trending topics...'}
                    </p>
                  </div>
                </div>
              ) : topics.length === 0 ? (
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-4">No trending topics found for this category.</p>
                  <button
                    onClick={() => generateTrendingTopics()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                  >
                    Generate Trending Topics
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700">
                      <tr>
                        <th className="px-6 py-3">Topic</th>
                        <th className="px-6 py-3">Trend Score</th>
                        <th className="px-6 py-3">Potential Views</th>
                        <th className="px-6 py-3">Monetization</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topics.map((topic, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="px-6 py-4">{topic.title}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-600 rounded-full h-2.5 mr-2">
                                <div 
                                  className="bg-green-600 h-2.5 rounded-full" 
                                  style={{ width: `${topic.trend_score * 10}%` }}
                                ></div>
                              </div>
                              <span>{topic.trend_score}/10</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{topic.potential_views}K</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-600 rounded-full h-2.5 mr-2">
                                <div 
                                  className="bg-yellow-500 h-2.5 rounded-full" 
                                  style={{ width: `${topic.monetization_score * 10}%` }}
                                ></div>
                              </div>
                              <span>{topic.monetization_score}/10</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => scheduleTopic(topic)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs"
                            >
                              Schedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Scheduled Content</h2>
              
              {loadingScheduled ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-2 text-gray-400">Loading scheduled content...</p>
                  </div>
                </div>
              ) : scheduledTopics.length === 0 ? (
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">You haven't scheduled any content yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700">
                      <tr>
                        <th className="px-6 py-3">Topic</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Frequency</th>
                        <th className="px-6 py-3">Next Scheduled</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledTopics.map((topic) => (
                        <tr key={topic.id} className="border-b border-gray-700">
                          <td className="px-6 py-4">{topic.topic}</td>
                          <td className="px-6 py-4">{topic.category}</td>
                          <td className="px-6 py-4">{topic.frequency}</td>
                          <td className="px-6 py-4">{formatDate(topic.next_scheduled)}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => deleteScheduledTopic(topic.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Schedule Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {getAvailableFrequencies().map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">
                    How often you want to publish videos
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Scheduled Videos</p>
                  <p className="font-medium">{scheduledTopics.length} / {subscription?.limits?.videosPerMonth || 3}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(scheduledTopics.length / (subscription?.limits?.videosPerMonth || 3)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Your Plan</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Current Plan</p>
                  <p className="font-medium">{subscription?.planName || 'Free Trial'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Videos Per Month</p>
                  <p className="font-medium">{subscription?.limits?.videosPerMonth || 3} videos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Available Frequencies</p>
                  <p className="font-medium">
                    {getAvailableFrequencies().map(f => f.label).join(', ')}
                  </p>
                </div>
                <button 
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full"
                  onClick={() => router.push('/pricing')}
                >
                  {subscription?.planId === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
