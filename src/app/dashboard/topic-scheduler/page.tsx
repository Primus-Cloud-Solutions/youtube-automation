'use client';

import React, { useState } from 'react';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

function TopicSchedulerPage() {
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledVideos, setScheduledVideos] = useState([
    {
      id: 'video-1',
      title: '10 AI Tools That Will Revolutionize Content Creation in 2025',
      thumbnailUrl: 'https://via.placeholder.com/120x68/1a1a1a/4ade80?text=AI+Tools',
      scheduledFor: '2025-05-01T10:00:00Z',
      status: 'scheduled'
    },
    {
      id: 'video-2',
      title: 'How to Build a Passive Income YouTube Channel Without Showing Your Face',
      thumbnailUrl: 'https://via.placeholder.com/120x68/1a1a1a/3b82f6?text=Passive+Income',
      scheduledFor: '2025-05-05T14:30:00Z',
      status: 'scheduled'
    },
    {
      id: 'video-3',
      title: 'The Ultimate Guide to YouTube SEO: Double Your Views in 30 Days',
      thumbnailUrl: 'https://via.placeholder.com/120x68/1a1a1a/a855f7?text=YouTube+SEO',
      scheduledFor: '2025-05-10T09:15:00Z',
      status: 'scheduled'
    }
  ]);
  
  // Mock videos ready to be scheduled
  const readyVideos = [
    {
      id: 'video-4',
      title: 'I Tested 5 Video Editing Software and Found the Best One for Beginners',
      description: 'A comprehensive comparison of popular video editing tools with a focus on ease of use and features for new creators.',
      thumbnailUrl: 'https://via.placeholder.com/240x135/1a1a1a/f59e0b?text=Video+Editing',
      duration: '12:45',
      createdAt: '2025-04-23T15:30:00Z',
      status: 'ready'
    },
    {
      id: 'video-5',
      title: 'How to Create Viral Short-Form Videos That Convert Viewers to Subscribers',
      description: 'Strategies for creating compelling short videos that not only go viral but also drive channel growth.',
      thumbnailUrl: 'https://via.placeholder.com/240x135/1a1a1a/ec4899?text=Viral+Videos',
      duration: '09:18',
      createdAt: '2025-04-24T11:20:00Z',
      status: 'ready'
    }
  ];
  
  // Function to schedule a video
  const scheduleVideo = () => {
    if (!selectedVideo || !scheduledDate || !scheduledTime) {
      alert('Please select a video and set a date and time');
      return;
    }
    
    setIsScheduling(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00Z`;
      
      // Add the scheduled video to the list
      const newScheduledVideo = {
        ...selectedVideo,
        scheduledFor: scheduledDateTime,
        status: 'scheduled'
      };
      
      setScheduledVideos([...scheduledVideos, newScheduledVideo]);
      
      // Reset form
      setSelectedVideo(null);
      setScheduledDate('');
      setScheduledTime('');
      setIsScheduling(false);
    }, 1500);
  };
  
  // Function to format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Schedule Videos</span>
            </h1>
            <div className="flex space-x-3">
              <Link href="/dashboard" className="py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-colors text-sm">
                Back to Dashboard
              </Link>
              <Link href="/dashboard/manual-topics" className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors text-sm">
                Create New Video
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Scheduled Videos</h2>
                
                {scheduledVideos.length > 0 ? (
                  <div className="space-y-4">
                    {scheduledVideos.map((video) => (
                      <div key={video.id} className="bg-gray-700 rounded-lg p-4 flex items-center border border-gray-600">
                        <div className="flex-shrink-0 mr-4">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="w-24 h-auto rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base truncate">{video.title}</h3>
                          <p className="text-gray-300 text-xs md:text-sm mt-1">
                            Scheduled for: {formatDate(video.scheduledFor)}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                          <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button className="p-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-6 text-center">
                    <p className="text-gray-300">No videos scheduled yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Select a video from the right panel to schedule it.</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Optimal Posting Schedule</h2>
                <p className="text-gray-300 mb-6">
                  Based on your audience analytics, here are the best times to post your videos:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Weekdays</h3>
                      <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs">Recommended</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-400">Morning:</span>
                        <span>7:00 AM - 9:00 AM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Afternoon:</span>
                        <span>12:00 PM - 2:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Evening:</span>
                        <span>6:00 PM - 8:00 PM</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Weekends</h3>
                      <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full text-xs">Good Option</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-400">Morning:</span>
                        <span>9:00 AM - 11:00 AM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Afternoon:</span>
                        <span>2:00 PM - 4:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Evening:</span>
                        <span>7:00 PM - 10:00 PM</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-900/30">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-400">Pro Tip</h4>
                      <p className="text-gray-300 text-sm mt-1">
                        Consistency is key! Pick a schedule you can maintain and stick to it. Your audience will learn when to expect new content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Schedule a Video</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Video
                    </label>
                    <div className="space-y-3">
                      {readyVideos.map((video) => (
                        <div 
                          key={video.id}
                          className={`bg-gray-700 rounded-lg p-3 cursor-pointer border ${selectedVideo?.id === video.id ? 'border-blue-500' : 'border-gray-600'}`}
                          onClick={() => setSelectedVideo(video)}
                        >
                          <div className="flex">
                            <div className="flex-shrink-0 mr-3">
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-16 h-auto rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{video.title}</h3>
                              <p className="text-gray-400 text-xs mt-1">Duration: {video.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {readyVideos.length === 0 && (
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                          <p className="text-gray-300">No videos ready to schedule.</p>
                          <Link href="/dashboard/manual-topics" className="text-blue-400 text-sm hover:underline mt-2 inline-block">
                            Create a new video
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Schedule Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Schedule Time
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={scheduleVideo}
                    disabled={isScheduling || !selectedVideo || !scheduledDate || !scheduledTime}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isScheduling ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scheduling...
                      </span>
                    ) : 'Schedule Video'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(TopicSchedulerPage);
