'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import withAuth from '../utils/with-auth';

function AccountPage() {
  const { user, signOut, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    try {
      updateUserProfile({ name, email });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }
    
    // In a real app, this would call an API to change the password
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="text-green-500 mr-2">📹</span>
            <span>TubeAutomator</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
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
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          {message.text && (
            <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
              
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Subscription</h2>
                <div className="mb-4">
                  <p className="font-medium text-lg">Professional Plan</p>
                  <p className="text-gray-400">20 AI-generated videos per month</p>
                  <p className="text-green-500 mt-2">Active until May 25, 2025</p>
                </div>
                <Link href="/pricing" className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors text-center">
                  Manage Subscription
                </Link>
              </div>
              
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
                <div className="space-y-4">
                  <Link href="/account/billing" className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors text-center">
                    Billing History
                  </Link>
                  <Link href="/account/api" className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors text-center">
                    API Keys
                  </Link>
                  <button className="block w-full py-2 px-4 bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-white rounded-md font-medium transition-colors text-center">
                    Delete Account
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

export default withAuth(AccountPage);
