'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h1 className="gradient-text text-4xl mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn">
          Return Home
        </Link>
      </div>
    </div>
  );
}
