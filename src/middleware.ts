import { NextResponse } from 'next/server';

// This middleware runs on every request
export function middleware(request) {
  // Set CORS headers to allow external access
  const response = NextResponse.next();
  
  // Allow requests from any origin
  response.headers.set('Access-Control-Allow-Origin', '*');
  
  // Allow specific HTTP methods
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Allow specific headers
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Allow credentials
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

// Configure middleware to run on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
