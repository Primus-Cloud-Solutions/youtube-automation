// This middleware ensures API routes work correctly on Netlify
// by setting the correct headers and handling CORS

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get response from the origin
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Ensure correct content type for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Content-Type', 'application/json');
  }

  return response;
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
};
