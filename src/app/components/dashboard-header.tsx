'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };
  
  return (
    <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center">
          <span className="text-green-500 mr-2">📹</span>
          <span className="text-white">TubeAutomator</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Link href="/dashboard/manual-topics" className="text-gray-300 hover:text-white transition-colors">
              Topics
            </Link>
            <Link href="/dashboard/topic-scheduler" className="text-gray-300 hover:text-white transition-colors">
              Scheduler
            </Link>
          </nav>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <span>{user?.email || 'User'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link href="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
