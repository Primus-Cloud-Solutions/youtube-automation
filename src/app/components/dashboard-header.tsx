'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Check session storage to maintain login state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = window.sessionStorage.getItem('isLoggedIn');
      const userEmail = window.sessionStorage.getItem('userEmail');
      
      if (!isLoggedIn || !userEmail) {
        // If no session data, redirect to login
        router.push('/login');
      }
    }
  }, [router]);

  const handleSignOut = async () => {
    try {
      await logout();
      
      // Clear session storage
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('isLoggedIn');
        window.sessionStorage.removeItem('userEmail');
        window.sessionStorage.removeItem('provider');
      }
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      
      // Force logout even on error
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('isLoggedIn');
        window.sessionStorage.removeItem('userEmail');
        window.sessionStorage.removeItem('provider');
      }
      
      router.push('/login');
    }
  };

  // Get user info from session storage as fallback
  const getUserInfo = () => {
    if (user) {
      return {
        name: user.name || user.email || 'User',
        email: user.email || 'user@example.com',
        initial: (user.name || user.email || 'U').charAt(0).toUpperCase()
      };
    }
    
    // Fallback to session storage
    if (typeof window !== 'undefined') {
      const userEmail = window.sessionStorage.getItem('userEmail') || 'user@example.com';
      const name = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      return {
        name: formattedName,
        email: userEmail,
        initial: formattedName.charAt(0).toUpperCase()
      };
    }
    
    return {
      name: 'User',
      email: 'user@example.com',
      initial: 'U'
    };
  };

  const userInfo = getUserInfo();

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
            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  {userInfo.initial}
                </div>
                <span className="hidden md:inline-block">{userInfo.email}</span>
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
