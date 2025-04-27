'use client';

import React from 'react';
import { useAuth } from '../context/auth-context';
import Link from 'next/link';

export default function DashboardHeader() {
  const { user, signOut, subscription } = useAuth();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      // Redirect happens automatically via auth state change in auth-context
      console.log('Signed out successfully');
    } else {
      console.error('Error signing out:', result.error);
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold flex items-center">
              <span className="text-green-500 mr-2">📹</span>
              <span>TubeAutomator</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/manual-topics" className="text-gray-300 hover:text-white transition-colors">
                Create Video
              </Link>
              <Link href="/dashboard/topic-scheduler" className="text-gray-300 hover:text-white transition-colors">
                Schedule
              </Link>
              <Link href="/dashboard/storage" className="text-gray-300 hover:text-white transition-colors">
                Storage
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Subscription Badge */}
            {subscription && (
              <div className="hidden md:block">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subscription.planId === 'enterprise' 
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-700' 
                    : subscription.planId === 'pro' 
                    ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                    : subscription.planId === 'basic' 
                    ? 'bg-green-900/50 text-green-300 border border-green-700'
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}>
                  {subscription.planName}
                </span>
              </div>
            )}
            
            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline-block">{user?.user_metadata?.full_name || user?.email || 'User'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link href="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Account Settings
                </Link>
                <Link href="/dashboard/system-test" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  System Test
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
