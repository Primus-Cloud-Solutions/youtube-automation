'use client';

import React from 'react';
import Link from 'next/link';

export default function ApiTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <p className="mb-4">This is a simplified version of the API test page.</p>
      <Link href="/dashboard" className="text-blue-500 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
