import React, { useEffect, useState } from 'react';
import DashboardHeader from '../../components/dashboard-header';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
    
    // Create stars background
    const createStars = () => {
      const stars = document.getElementById('stars');
      if (!stars) return;
      
      const count = 100;
      
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 4}s`;
        
        stars.appendChild(star);
      }
    };
    
    createStars();
  }, []);

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
              <button className="btn flex items-center justify-center gap-2">
                <span>📹</span> Create Video
              </button>
              <button className="btn flex items-center justify-center gap-2">
                <span>📅</span> Schedule Content
              </button>
              <button className="btn flex items-center justify-center gap-2">
                <span>📊</span> View Analytics
              </button>
              <button className="btn flex items-center justify-center gap-2">
                <span>🔑</span> Manage API Keys
              </button>
            </div>
          </div>
          
          {/* Upcoming Videos */}
          <div>
            <h2 className="text-xl font-bold mb-4">Upcoming Videos</h2>
            <div className="flex flex-col gap-4">
              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Future of AI in Healthcare</h3>
                    <p className="text-sm text-muted-foreground">Scheduled for Apr 25, 2025</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Edit</button>
                </div>
              </div>
              
              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Quantum Computing Breakthroughs</h3>
                    <p className="text-sm text-muted-foreground">Scheduled for Apr 27, 2025</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Edit</button>
                </div>
              </div>
              
              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Elden Ring DLC Review</h3>
                    <p className="text-sm text-muted-foreground">Scheduled for Apr 30, 2025</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Edit</button>
                </div>
              </div>
              
              <button className="btn btn-outline">View All Scheduled Content</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
