import React from 'react';
import Link from 'next/link';

// Dashboard header component with navigation
export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const handleSignOut = () => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    // Redirect to home
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            className="md:hidden btn p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {/* Logo */}
          <Link href="/dashboard" className="logo">
            <span className="logo-icon">📹</span>
            TubeAutomator
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-4">
          <Link href="/dashboard" className="nav-item active">Dashboard</Link>
          <Link href="/dashboard/manual-topics" className="nav-item">Manual Topics</Link>
          <Link href="/dashboard/automated-content" className="nav-item">Automated Content</Link>
          <Link href="/dashboard/topic-scheduler" className="nav-item">Topic Scheduler</Link>
          <Link href="/dashboard/analytics" className="nav-item">Analytics</Link>
          <Link href="/dashboard/api-keys" className="nav-item">API Keys</Link>
          <button onClick={handleSignOut} className="nav-item">Sign Out</button>
        </nav>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card p-4 z-50 border-t border-b">
            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="nav-item active">Dashboard</Link>
              <Link href="/dashboard/manual-topics" className="nav-item">Manual Topics</Link>
              <Link href="/dashboard/automated-content" className="nav-item">Automated Content</Link>
              <Link href="/dashboard/topic-scheduler" className="nav-item">Topic Scheduler</Link>
              <Link href="/dashboard/analytics" className="nav-item">Analytics</Link>
              <Link href="/dashboard/api-keys" className="nav-item">API Keys</Link>
              <button onClick={handleSignOut} className="nav-item">Sign Out</button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
