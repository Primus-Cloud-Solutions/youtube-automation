'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '../../lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Higher-order component to protect routes
const withAuth = function(Component) {
  return function ProtectedRoute(props) {
    // Wrap the component with AuthProvider to ensure useAuth works properly
    return (
      <AuthProvider>
        <AuthGuard Component={Component} props={props} />
      </AuthProvider>
    );
  };
}

// Separate component to use useAuth inside AuthProvider
function AuthGuard({ Component, props }) {
  const { user, isLoading, error } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Check authentication status
  useEffect(() => {
    // Only set authCheckComplete after initial loading is done
    if (!isLoading) {
      setAuthCheckComplete(true);
    }
    
    // Redirect to login if not authenticated
    if (!user && !isLoading && !redirecting) {
      console.log('User not authenticated, redirecting to login');
      setRedirecting(true);
      router.push('/login');
    }
  }, [user, isLoading, router, redirecting]);
  
  // Show loading state while checking authentication
  if (isLoading || !authCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <p className="text-gray-400">Verifying your authentication</p>
        </div>
      </div>
    );
  }
  
  // Show access restricted message if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
          <div className="text-xl font-semibold mb-2">Access Restricted</div>
          <p className="text-gray-400 mb-4">Please log in to access this page</p>
          
          {error && (
            <div className="mt-4 mb-4 p-3 bg-red-900/50 text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mt-6">
            <Link 
              href="/login" 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
            >
              Go to Login
            </Link>
          </div>
          
          {/* Demo credentials info box */}
          <div className="mt-6 p-3 bg-green-900/30 border border-green-800 rounded-md text-left">
            <h3 className="text-sm font-medium text-green-400 mb-1">Demo Credentials</h3>
            <p className="text-xs text-gray-300">Email: test@example.com</p>
            <p className="text-xs text-gray-300">Password: Password123!</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render the protected component if authenticated
  return <Component {...props} />;
}

export { withAuth };
export default withAuth;
