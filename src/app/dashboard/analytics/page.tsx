'use client';

import React from 'react';
import withAuth from '@/app/utils/with-auth';
import DashboardHeader from '@/app/components/dashboard-header';
import { useAuth } from '@/lib/auth-context';

function AnalyticsPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-2">Total Views</h3>
              <p className="text-3xl font-bold text-green-500">24,892</p>
              <p className="text-sm text-green-400 mt-2">↑ 12% from last month</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-2">Watch Time</h3>
              <p className="text-3xl font-bold text-blue-500">1,245 hrs</p>
              <p className="text-sm text-blue-400 mt-2">↑ 8% from last month</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-2">Subscribers</h3>
              <p className="text-3xl font-bold text-purple-500">1,892</p>
              <p className="text-sm text-purple-400 mt-2">↑ 15% from last month</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-2">Engagement Rate</h3>
              <p className="text-3xl font-bold text-yellow-500">4.7%</p>
              <p className="text-sm text-yellow-400 mt-2">↑ 0.5% from last month</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
              <div className="h-64 flex items-center justify-center bg-gray-700 rounded-lg">
                <p className="text-gray-400">Chart visualization would appear here</p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Audience Demographics</h2>
              <div className="h-64 flex items-center justify-center bg-gray-700 rounded-lg">
                <p className="text-gray-400">Demographics visualization would appear here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Top Performing Videos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Video Title</th>
                    <th className="text-right py-3 px-4">Views</th>
                    <th className="text-right py-3 px-4">Watch Time</th>
                    <th className="text-right py-3 px-4">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">10 AI Tools Every Content Creator Needs</td>
                    <td className="text-right py-3 px-4">8,245</td>
                    <td className="text-right py-3 px-4">412 hrs</td>
                    <td className="text-right py-3 px-4">5.2%</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">How to Grow Your YouTube Channel in 2025</td>
                    <td className="text-right py-3 px-4">6,129</td>
                    <td className="text-right py-3 px-4">356 hrs</td>
                    <td className="text-right py-3 px-4">4.9%</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">The Future of Video Content Creation</td>
                    <td className="text-right py-3 px-4">5,872</td>
                    <td className="text-right py-3 px-4">298 hrs</td>
                    <td className="text-right py-3 px-4">4.5%</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4">Ultimate Guide to YouTube SEO</td>
                    <td className="text-right py-3 px-4">4,646</td>
                    <td className="text-right py-3 px-4">179 hrs</td>
                    <td className="text-right py-3 px-4">4.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Content Recommendations</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Trending Topic: AI Video Editing</h3>
                <p className="text-gray-300">Our analysis shows this topic is gaining traction. Consider creating content around AI-powered video editing tools.</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Audience Interest: Tutorial Content</h3>
                <p className="text-gray-300">Your tutorial videos have 32% higher engagement. Consider creating more how-to and educational content.</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Optimal Posting Time</h3>
                <p className="text-gray-300">Your audience is most active on Tuesdays and Thursdays between 6-8pm. Consider scheduling your content during these times.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(AnalyticsPage);
