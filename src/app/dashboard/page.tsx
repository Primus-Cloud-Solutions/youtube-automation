'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const demoUser = localStorage.getItem('demo_user');
        
        if (demoUser) {
          setUser(JSON.parse(demoUser));
        } else {
          // Redirect to login if no user found
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('demo_user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <header className="dashboard-header py-4">
        <div className="container flex justify-between items-center">
          <Link href="/dashboard" className="logo">
            <span className="logo-icon">📹</span>TubeAutomator
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="nav-link active">Dashboard</Link>
            <Link href="/dashboard/topic-scheduler" className="nav-link">Topic Scheduler</Link>
            <Link href="/dashboard/manual-topics" className="nav-link">Manual Topics</Link>
            <Link href="/dashboard/analytics" className="nav-link">Analytics</Link>
            <Link href="/dashboard/api-keys" className="nav-link">API Keys</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              {user?.user_metadata?.full_name || user?.email || 'Demo User'}
            </div>
            <button 
              onClick={handleSignOut}
              className="btn btn-sm btn-outline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.user_metadata?.full_name || 'Demo User'}!</h1>
          <p className="text-muted-foreground">Here's an overview of your YouTube automation activities.</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="stat-value">12</div>
            <div className="stat-label">Videos Created</div>
            <div className="stat-change positive">+3 this week</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">8,432</div>
            <div className="stat-label">Total Views</div>
            <div className="stat-change positive">+15% this month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">342</div>
            <div className="stat-label">Subscribers Gained</div>
            <div className="stat-change positive">+28 this week</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">4.8</div>
            <div className="stat-label">Avg. Engagement Rate</div>
            <div className="stat-change positive">+0.3 this month</div>
          </div>
        </div>
        
        {/* Recent Videos */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10 Advanced JavaScript Techniques You Need to Know</td>
                  <td>Apr 20, 2025</td>
                  <td>1,245</td>
                  <td>87</td>
                  <td>23</td>
                </tr>
                <tr>
                  <td>Building a Full-Stack App with Next.js and Supabase</td>
                  <td>Apr 15, 2025</td>
                  <td>2,187</td>
                  <td>156</td>
                  <td>42</td>
                </tr>
                <tr>
                  <td>The Future of AI in Content Creation</td>
                  <td>Apr 10, 2025</td>
                  <td>3,421</td>
                  <td>278</td>
                  <td>64</td>
                </tr>
                <tr>
                  <td>5 Productivity Hacks for Developers</td>
                  <td>Apr 5, 2025</td>
                  <td>1,579</td>
                  <td>112</td>
                  <td>31</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/dashboard/topic-scheduler" className="btn w-full">
                Schedule New Video
              </Link>
              <Link href="/dashboard/manual-topics" className="btn btn-outline w-full">
                Submit Manual Topic
              </Link>
              <Link href="/dashboard/analytics" className="btn btn-outline w-full">
                View Analytics
              </Link>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer">
                <span>AI Content Generation Tools</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">High Demand</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer">
                <span>Web3 Development Tutorial</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Trending</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer">
                <span>Remote Work Productivity Tips</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Popular</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer">
                <span>Next.js 14 Features Overview</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">New</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Schedule */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded bg-secondary/10">
              <div className="text-center">
                <div className="text-xl font-bold">28</div>
                <div className="text-xs">APR</div>
              </div>
              <div className="flex-1">
                <div className="font-medium">How to Build a SaaS Application from Scratch</div>
                <div className="text-sm text-muted-foreground">Scheduled for 10:00 AM</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm">Edit</button>
                <button className="btn btn-sm btn-outline">Cancel</button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded bg-secondary/10">
              <div className="text-center">
                <div className="text-xl font-bold">02</div>
                <div className="text-xs">MAY</div>
              </div>
              <div className="flex-1">
                <div className="font-medium">Top 7 React Performance Optimization Techniques</div>
                <div className="text-sm text-muted-foreground">Scheduled for 2:00 PM</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm">Edit</button>
                <button className="btn btn-sm btn-outline">Cancel</button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded bg-secondary/10">
              <div className="text-center">
                <div className="text-xl font-bold">05</div>
                <div className="text-xs">MAY</div>
              </div>
              <div className="flex-1">
                <div className="font-medium">The Complete Guide to TypeScript Generics</div>
                <div className="text-sm text-muted-foreground">Scheduled for 11:30 AM</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm">Edit</button>
                <button className="btn btn-sm btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
