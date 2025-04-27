'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/app/components/dashboard-header';

export default function DashboardPage() {
  const { user, loading, subscription } = useAuth();
  const router = useRouter();
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

  // Loading state
  if (loading && !isSessionValid) {
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

  // Calculate remaining videos based on subscription
  const videosRemaining = subscription?.limits?.videosPerMonth || 5;
  const videosTotal = subscription?.limits?.videosPerMonth || 5;
  
  // Calculate trial expiration if applicable
  const trialExpiresText = subscription?.trialDaysRemaining 
    ? `${subscription.trialDaysRemaining} days` 
    : '30 days';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Welcome, {userInfo.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
            <p className="text-gray-300 mb-4">Get started with YouTube automation in just a few steps.</p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Create an account</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">1</span>
                <span>Set up your YouTube API credentials</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">2</span>
                <span>Generate your first video topic</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">3</span>
                <span>Schedule your content calendar</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-400 mb-4">You haven't created any videos yet.</p>
            <button 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              onClick={() => router.push('/dashboard/manual-topics')}
            >
              Create Your First Video
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Account Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Current Plan</p>
                <p className="font-medium">{subscription?.planName || 'Free'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Videos Remaining</p>
                <p className="font-medium">{videosRemaining} / {videosTotal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  {subscription?.status === 'trialing' ? 'Trial Expires' : 'Billing Period'}
                </p>
                <p className="font-medium">{trialExpiresText}</p>
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
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
            <p className="text-gray-300 mb-4">Popular topics in your niche right now:</p>
            <ul className="space-y-2">
              <li className="p-3 bg-gray-700 rounded-md">AI in content creation</li>
              <li className="p-3 bg-gray-700 rounded-md">YouTube Shorts strategy</li>
              <li className="p-3 bg-gray-700 rounded-md">Passive income through automation</li>
              <li className="p-3 bg-gray-700 rounded-md">Video SEO techniques</li>
            </ul>
            <button 
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              onClick={() => router.push('/dashboard/topic-scheduler')}
            >
              View More Topics
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-left"
                onClick={() => router.push('/dashboard/manual-topics')}
              >
                <div className="text-lg font-medium mb-1">Create Video</div>
                <div className="text-sm text-gray-400">Generate new content</div>
              </button>
              <button 
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-left"
                onClick={() => router.push('/dashboard/topic-scheduler')}
              >
                <div className="text-lg font-medium mb-1">Schedule</div>
                <div className="text-sm text-gray-400">Plan your content</div>
              </button>
              <button 
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-left"
                onClick={() => router.push('/dashboard/storage')}
              >
                <div className="text-lg font-medium mb-1">Storage</div>
                <div className="text-sm text-gray-400">Manage your files</div>
              </button>
              <button 
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-left"
                onClick={() => router.push('/account')}
              >
                <div className="text-lg font-medium mb-1">Settings</div>
                <div className="text-sm text-gray-400">Update your profile</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
