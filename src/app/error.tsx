'use client';

import React from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h1 className="gradient-text text-3xl mb-4">Something went wrong</h1>
        <p className="mb-6">We encountered an error while loading this page.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn">
            Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
