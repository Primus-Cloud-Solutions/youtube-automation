'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth-context';

export default function Header() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };
  
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
          <span className="text-green-500 mr-2">📹</span>
          <span className="text-white">TubeAutomator</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          {user && (
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <span>{user.email || 'User'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link href="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                  Account Settings
                </Link>
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
