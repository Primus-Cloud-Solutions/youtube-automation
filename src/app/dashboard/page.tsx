'use client';

import React from 'react';
import withAuth from '../utils/with-auth';
import DashboardHeader from '../components/dashboard-header';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h2>
            <p className="text-gray-300 mb-4">
              Your YouTube content automation platform is ready to help you create engaging videos and grow your channel.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Videos Created</h3>
                <p className="text-3xl font-bold text-green-500">12</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Scheduled</h3>
                <p className="text-3xl font-bold text-blue-500">5</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Topics Generated</h3>
                <p className="text-3xl font-bold text-purple-500">28</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Link href="/dashboard/manual-topics" className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors text-center">
                  Generate New Video Topics
                </Link>
                <Link href="/dashboard/topic-scheduler" className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors text-center">
                  Schedule Content
                </Link>
                <Link href="/dashboard/analytics" className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition-colors text-center">
                  View Analytics
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <p className="font-medium">Video "Top 10 AI Tools for Content Creators" created</p>
                  <p className="text-sm text-gray-400">2 days ago</p>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <p className="font-medium">Scheduled 3 videos for publication</p>
                  <p className="text-sm text-gray-400">3 days ago</p>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <p className="font-medium">Generated 8 new topic ideas</p>
                  <p className="text-sm text-gray-400">5 days ago</p>
                </div>
                <div>
                  <p className="font-medium">Account created</p>
                  <p className="text-sm text-gray-400">7 days ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-lg">Professional Plan</p>
                <p className="text-gray-400">20 AI-generated videos per month</p>
                <p className="text-green-500 mt-2">Active until May 25, 2025</p>
              </div>
              <Link href="/pricing" className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors">
                Manage Subscription
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
