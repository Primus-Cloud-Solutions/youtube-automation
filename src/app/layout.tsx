'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider } from './context/auth-context';
import { YouTubeApiProvider } from './context/youtube-api-context';
import { ContentProvider } from './context/content-context';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import ErrorBoundary from './components/error-boundary';

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Add stars background animation
  useEffect(() => {
    const createStars = () => {
      const stars = document.getElementById('stars');
      if (!stars) return;
      
      // Clear existing stars
      stars.innerHTML = '';
      
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
    
    // Recreate stars on window resize
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, []);

  // Determine if we should show the header
  const showHeader = pathname !== '/login' && pathname !== '/signup';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>TubeAutomator - YouTube Automation Platform</title>
        <meta name="description" content="Create, schedule, and publish engaging YouTube videos with AI-powered automation" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#7B68EE" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Stars background animation */}
        <div className="stars" id="stars"></div>
        
        {/* Header with logo */}
        {showHeader && (
          <header className="site-header">
            <div className="container">
              <div className="header-content">
                <Link href="/" className="logo-container">
                  <Image 
                    src="/images/logo.svg" 
                    alt="TubeAutomator Logo" 
                    width={200} 
                    height={50} 
                    priority
                  />
                </Link>
                <nav className="main-nav">
                  <Link href="/features" className="nav-link">Features</Link>
                  <Link href="/pricing" className="nav-link">Pricing</Link>
                  <Link href="/dashboard" className="nav-link">Dashboard</Link>
                  <Link href="/login" className="btn btn-sm">Sign In</Link>
                </nav>
              </div>
            </div>
          </header>
        )}
        
        {/* Context providers */}
        <ErrorBoundary>
          <AuthProvider>
            <YouTubeApiProvider>
              <ContentProvider>
                {/* Main content */}
                {children}
              </ContentProvider>
            </YouTubeApiProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
