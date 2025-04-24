'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider } from './context/auth-context';
import { YouTubeApiProvider } from './context/youtube-api-context';
import { ContentProvider } from './context/content-context';

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

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>TubeAutomator - YouTube Automation Platform</title>
        <meta name="description" content="Create, schedule, and publish engaging YouTube videos with AI-powered automation" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Stars background animation */}
        <div className="stars" id="stars"></div>
        
        {/* Context providers */}
        <AuthProvider>
          <YouTubeApiProvider>
            <ContentProvider>
              {/* Main content */}
              {children}
            </ContentProvider>
          </YouTubeApiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
