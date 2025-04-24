'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import DashboardHeader from '../../components/dashboard-header';
import withAuth from '../utils/with-auth';
import { useRouter } from 'next/navigation';
import { useContent } from '../context/content-context';

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { scheduledVideos, loadScheduledVideos, loading: contentLoading } = useContent();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadScheduledVideos();
    }
  }, [user, loadScheduledVideos]);

  const loading = authLoading || contentLoading;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p>View your YouTube channel performance and upcoming content</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat-card">
            <div className="stat-label">Videos Created</div>
            <div className="stat-value">24</div>
            <div className="stat-change positive">+12% from last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">142.5K</div>
            <div className="stat-change positive">+18% from last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Subscription Status</div>
            <div className="stat-value">Active</div>
            <div className="stat-change">Next billing: May 24, 2025</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-4">
              <button 
                className="btn flex items-center justify-center gap-2"
                onClick={() => router.push('/dashboard/topic-scheduler')}
              >
                <span>📹</span> Create Video
              </button>
              <button 
                className="btn flex items-center justify-center gap-2"
                onClick={() => router.push('/dashboard/topic-scheduler')}
              >
                <span>📅</span> Schedule Content
              </button>
              <button 
                className="btn flex items-center justify-center gap-2"
                onClick={() => router.push('/dashboard/analytics')}
              >
                <span>📊</span> View Analytics
              </button>
              <button 
                className="btn flex items-center justify-center gap-2"
                onClick={() => router.push('/dashboard/api-keys')}
              >
                <span>🔑</span> Manage API Keys
              </button>
            </div>
          </div>
          
          {/* Upcoming Videos */}
          <div>
            <h2 className="text-xl font-bold mb-4">Upcoming Videos</h2>
            <div className="flex flex-col gap-4">
              {scheduledVideos && scheduledVideos.length > 0 ? (
                scheduledVideos.map((video) => (
                  <div className="card" key={video.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Scheduled for {new Date(video.scheduled_time).toLocaleDateString()}
                        </p>
                      </div>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => router.push(`/dashboard/topic-scheduler?edit=${video.id}`)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card">
                  <p>No upcoming videos scheduled. Create your first video!</p>
                  <button 
                    className="btn btn-outline mt-4"
                    onClick={() => router.push('/dashboard/topic-scheduler')}
                  >
                    Schedule Your First Video
                  </button>
                </div>
              )}
              
              {scheduledVideos && scheduledVideos.length > 0 && (
                <button 
                  className="btn btn-outline"
                  onClick={() => router.push('/dashboard/topic-scheduler')}
                >
                  View All Scheduled Content
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
