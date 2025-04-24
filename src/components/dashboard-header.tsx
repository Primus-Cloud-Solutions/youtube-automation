"use client";

import React from 'react';
import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="logo">
            <span className="logo-icon">📹</span>
            TubeAutomator
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/dashboard/topic-scheduler" className="nav-link">Topic Scheduler</Link>
            <Link href="/dashboard/manual-topics" className="nav-link">Manual Topics</Link>
            <Link href="/dashboard/analytics" className="nav-link">Analytics</Link>
            <Link href="/dashboard/api-keys" className="nav-link">API Keys</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <button 
              className="btn btn-outline"
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
