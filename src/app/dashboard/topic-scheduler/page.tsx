'use client';

import React, { useState } from 'react';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';
import { useAuth } from '../../../lib/auth-context';

function TopicSchedulerPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  
  // Mock saved topics
  const [savedTopics, setSavedTopics] = useState([
    { id: 1, title: 'How to Use AI for Video Creation', scheduled: false },
    { id: 2, title: '10 Best Practices for YouTube in 2025', scheduled: false },
    { id: 3, title: 'The Future of Content Creation: Trends and Predictions', scheduled: true, date: '2025-05-15' },
    { id: 4, title: 'Video Editing for Beginners: A Complete Guide', scheduled: true, date: '2025-05-22' },
    { id: 5, title: 'Advanced YouTube SEO Techniques for Content Creators', scheduled: false },
    { id: 6, title: 'Why AI is Changing the Content Creation Industry', scheduled: false },
  ]);
  
  // Mock scheduled content calendar
  const [scheduledContent, setScheduledContent] = useState([
    { id: 101, title: 'The Future of Content Creation: Trends and Predictions', date: '2025-05-15', status: 'scheduled' },
    { id: 102, title: 'Video Editing for Beginners: A Complete Guide', date: '2025-05-22', status: 'scheduled' },
    { id: 103, title: 'How I Gained 10K Subscribers in 30 Days', date: '2025-05-01', status: 'published' },
    { id: 104, title: 'Best Camera Gear for YouTube in 2025', date: '2025-04-24', status: 'published' },
  ]);
  
  const handleScheduleTopic = (topicId) => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }
    
    // Update saved topics
    const updatedTopics = savedTopics.map(topic => {
      if (topic.id === topicId) {
        return { ...topic, scheduled: true, date: selectedDate };
      }
      return topic;
    });
    
    // Add to scheduled content
    const topicToSchedule = savedTopics.find(topic => topic.id === topicId);
    const newScheduledContent = [
      ...scheduledContent,
      { 
        id: Date.now(), 
        title: topicToSchedule.title, 
        date: selectedDate, 
        status: 'scheduled' 
      }
    ];
    
    setSavedTopics(updatedTopics);
    setScheduledContent(newScheduledContent);
    alert(`Topic scheduled for ${selectedDate}`);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Content Scheduler</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Saved Topics</h2>
              <p className="text-gray-300 mb-6">
                Schedule your saved topics for publication on YouTube.
              </p>
              
              <div className="mb-6">
                <label htmlFor="scheduleDate" className="block text-sm font-medium mb-2">
                  Select Publication Date
                </label>
                <input
                  id="scheduleDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-4">
                {savedTopics.filter(topic => !topic.scheduled).map(topic => (
                  <div key={topic.id} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">{topic.title}</h3>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleScheduleTopic(topic.id)}
                        disabled={!selectedDate}
                        className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
                
                {savedTopics.filter(topic => !topic.scheduled).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No unscheduled topics available</p>
                    <p className="mt-2 text-sm">Generate new topics in the Topic Generator</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Content Calendar</h2>
              <p className="text-gray-300 mb-6">
                View and manage your scheduled content.
              </p>
              
              <div className="space-y-4">
                <h3 className="font-medium text-green-500">Upcoming</h3>
                {scheduledContent.filter(content => content.status === 'scheduled').map(content => (
                  <div key={content.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{content.title}</h3>
                        <p className="text-sm text-gray-400">Scheduled for {formatDate(content.date)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-yellow-500 hover:text-yellow-400">
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-400">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <h3 className="font-medium text-blue-500 mt-8">Published</h3>
                {scheduledContent.filter(content => content.status === 'published').map(content => (
                  <div key={content.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{content.title}</h3>
                        <p className="text-sm text-gray-400">Published on {formatDate(content.date)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-400">
                          View Stats
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Optimal Posting Schedule</h2>
            <p className="text-gray-300 mb-6">
              Based on your audience analytics, these are the best times to post your content.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Best Days</h3>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full">Tuesday</span>
                  <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full">Thursday</span>
                  <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full">Saturday</span>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Best Times</h3>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full">6-8 PM</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full">12-2 PM</span>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Posting Frequency</h3>
                <p className="text-green-500">Recommended: 2-3 videos per week</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(TopicSchedulerPage);
