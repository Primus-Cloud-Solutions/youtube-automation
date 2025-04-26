"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { withAuth } from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';

const TopicScheduler = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  // State for scheduling settings
  const [frequency, setFrequency] = useState('weekly');
  const [category, setCategory] = useState('technology');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
        
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error('Error fetching categories:', data.error);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch existing schedules on component mount
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch('/api/scheduler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get-recurring-schedules',
            userId: user.id
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSchedules(data.recurringSchedules);
        } else {
          console.error('Error fetching schedules:', data.error);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setIsLoadingSchedules(false);
      }
    };
    
    fetchSchedules();
  }, [user]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      setMessage('You must be logged in to create a schedule');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-recurring-schedule',
          userId: user.id,
          frequency,
          category,
          endDate: endDate || null
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Schedule created successfully!');
        
        // Add the new schedule to the list
        setSchedules([
          ...schedules,
          {
            scheduleId: data.scheduleId,
            category,
            frequency,
            nextGenerationDate: data.metadata.nextGenerationDate,
            status: 'active',
            createdAt: data.metadata.createdAt,
            endDate: data.metadata.endDate
          }
        ]);
        
        // Reset form
        setFrequency('weekly');
        setCategory('technology');
        setEndDate('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      setMessage('An error occurred while creating the schedule');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle schedule cancellation
  const handleCancelSchedule = async (scheduleId) => {
    if (!user?.id) {
      setMessage('You must be logged in to cancel a schedule');
      return;
    }
    
    try {
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel-recurring-schedule',
          userId: user.id,
          scheduleId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the schedule status in the list
        setSchedules(
          schedules.map(schedule => 
            schedule.scheduleId === scheduleId 
              ? { ...schedule, status: 'cancelled' } 
              : schedule
          )
        );
        
        setMessage('Schedule cancelled successfully!');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      setMessage('An error occurred while cancelling the schedule');
    }
  };
  
  // Format frequency for display
  const formatFrequency = (freq) => {
    switch (freq) {
      case 'daily':
        return 'Daily';
      case 'every3days':
        return 'Every 3 Days';
      case 'weekly':
        return 'Weekly';
      case 'biweekly':
        return 'Bi-Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return freq;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No end date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Topic Scheduler</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Schedule Form */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Create Automated Schedule</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Content Category</label>
                {isLoadingCategories ? (
                  <div className="animate-pulse h-10 bg-gray-700 rounded"></div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  Select the category of content you want to generate
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="every3days">Every 3 Days</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p className="text-sm text-gray-400 mt-1">
                  How often should new videos be generated and scheduled
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Leave blank for indefinite scheduling
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Schedule...
                  </>
                ) : (
                  'Create Automated Schedule'
                )}
              </button>
              
              {message && (
                <div className={`mt-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
          
          {/* Active Schedules */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Active Schedules</h2>
            
            {isLoadingSchedules ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-700 h-24 rounded-md"></div>
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">No active schedules</p>
                <p className="text-sm mt-1">Create a schedule to start automating your content</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.scheduleId} className="bg-gray-700 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg capitalize">{schedule.category}</h3>
                        <p className="text-gray-400 text-sm">
                          {formatFrequency(schedule.frequency)} • Next: {formatDate(schedule.nextGenerationDate)}
                        </p>
                        {schedule.endDate && (
                          <p className="text-gray-400 text-sm">
                            Ends: {formatDate(schedule.endDate)}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          schedule.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                        }`}>
                          {schedule.status === 'active' ? 'Active' : 'Cancelled'}
                        </span>
                      </div>
                    </div>
                    
                    {schedule.status === 'active' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleCancelSchedule(schedule.scheduleId)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Cancel Schedule
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Information Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">How Automated Scheduling Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="text-green-400 text-xl font-bold mb-2">1. Create Schedule</div>
              <p className="text-gray-300">
                Select a content category and frequency. Our system will automatically generate trending video topics in your chosen category.
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="text-green-400 text-xl font-bold mb-2">2. AI Content Creation</div>
              <p className="text-gray-300">
                Our AI will create high-quality scripts, generate voiceovers, and produce complete videos based on trending topics.
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="text-green-400 text-xl font-bold mb-2">3. YouTube Upload</div>
              <p className="text-gray-300">
                Videos will be automatically uploaded to your YouTube channel at optimal times for maximum engagement.
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-700 p-4 rounded-md border border-yellow-600/30">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-yellow-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-yellow-400">Important Note</h3>
                <p className="text-gray-300 mt-1">
                  You must connect your YouTube API key in the Account Settings to enable automatic uploads. 
                  The system will generate and store videos even without an API key, but uploads will be paused until a valid key is provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(TopicScheduler);
