'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardHeader = () => {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };
  
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-primary font-bold text-2xl">YT</span>
            <span className="font-semibold hidden md:inline-block">Automation</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/dashboard') && pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Overview
            </Link>
            <Link 
              href="/dashboard/topic-scheduler" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/dashboard/topic-scheduler') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Topic Scheduler
            </Link>
            <Link 
              href="/dashboard/manual-topics" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/dashboard/manual-topics') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Manual Topics
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/dashboard/analytics') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Analytics
            </Link>
            <Link 
              href="/dashboard/api-keys" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/dashboard/api-keys') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              API Keys
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Sign Out
          </Link>
          
          <div className="hidden md:block">
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium">
              <span className="text-primary">YA</span>
            </button>
          </div>
          
          <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden">
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
