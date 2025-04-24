'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-primary/20 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-primary/20 rounded w-2/3 mx-auto mb-6"></div>
          <div className="h-10 bg-primary/20 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
