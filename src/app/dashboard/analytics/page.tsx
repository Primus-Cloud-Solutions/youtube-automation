"use client";

import React, { useState } from 'react';
import DashboardHeader from '../../components/dashboard-header';

export default function Analytics() {
  // Sample analytics data
  const [viewsData] = useState([
    { date: 'Jan', views: 12500 },
    { date: 'Feb', views: 18200 },
    { date: 'Mar', views: 25800 },
    { date: 'Apr', views: 31400 },
    { date: 'May', views: 42000 },
    { date: 'Jun', views: 38700 },
  ]);
  
  const [subscribersData] = useState([
    { date: 'Jan', subscribers: 850 },
    { date: 'Feb', subscribers: 1200 },
    { date: 'Mar', subscribers: 1650 },
    { date: 'Apr', subscribers: 2100 },
    { date: 'May', subscribers: 2750 },
    { date: 'Jun', subscribers: 3200 },
  ]);
  
  const [topVideos] = useState([
    { id: 1, title: 'How to Build a React App in 10 Minutes', views: 45280, likes: 3621, comments: 412 },
    { id: 2, title: 'The Future of Artificial Intelligence', views: 38750, likes: 2984, comments: 356 },
    { id: 3, title: '10 Programming Languages to Learn in 2025', views: 32140, likes: 2541, comments: 298 },
    { id: 4, title: 'Building a Smart Home on a Budget', views: 28970, likes: 2103, comments: 245 },
    { id: 5, title: 'Cryptocurrency Explained: A Beginner\'s Guide', views: 24680, likes: 1872, comments: 203 },
  ]);

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p>Track your YouTube channel performance and audience engagement</p>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">168,720</div>
            <div className="stat-change positive">+22% from last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Subscribers</div>
            <div className="stat-value">3,245</div>
            <div className="stat-change positive">+16% from last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Avg. Watch Time</div>
            <div className="stat-value">4:32</div>
            <div className="stat-change positive">+8% from last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Engagement Rate</div>
            <div className="stat-value">7.8%</div>
            <div className="stat-change negative">-2% from last month</div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card p-4">
            <h2 className="text-xl font-bold mb-4">Views Over Time</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {viewsData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-primary rounded-t"
                    style={{ 
                      height: `${(item.views / 50000) * 100}%`,
                      background: 'linear-gradient(to top, #3b82f6, #8b5cf6)'
                    }}
                  ></div>
                  <div className="mt-2 text-sm">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card p-4">
            <h2 className="text-xl font-bold mb-4">Subscribers Growth</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {subscribersData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-12 rounded-t"
                    style={{ 
                      height: `${(item.subscribers / 4000) * 100}%`,
                      background: 'linear-gradient(to top, #10b981, #3b82f6)'
                    }}
                  ></div>
                  <div className="mt-2 text-sm">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Top Performing Videos */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Top Performing Videos</h2>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Views</th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topVideos.map((video) => (
                    <tr key={video.id}>
                      <td>{video.title}</td>
                      <td>{video.views.toLocaleString()}</td>
                      <td>{video.likes.toLocaleString()}</td>
                      <td>{video.comments.toLocaleString()}</td>
                      <td>
                        <button className="btn btn-outline btn-sm">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Audience Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-4">
            <h2 className="text-xl font-bold mb-4">Audience Age</h2>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>18-24</span>
                  <span>32%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>25-34</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>35-44</span>
                  <span>15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>45+</span>
                  <span>8%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <h2 className="text-xl font-bold mb-4">Traffic Sources</h2>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>YouTube Search</span>
                  <span>38%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-secondary rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Suggested Videos</span>
                  <span>27%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-secondary rounded-full" style={{ width: '27%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>External</span>
                  <span>18%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-secondary rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Browse Features</span>
                  <span>12%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-secondary rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Other</span>
                  <span>5%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-secondary rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
