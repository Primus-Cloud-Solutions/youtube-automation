'use client';

import React from 'react';
import { useAuth, AuthProvider } from '../../lib/auth-context';
import { useRouter } from 'next/navigation';

// Higher-order component to protect routes
export default function withAuth(Component) {
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
  const [redirecting, setRedirecting] = React.useState(false);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <p className="text-gray-400">Verifying your authentication</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user && !isLoading && !redirecting) {
      setRedirecting(true);
      router.push('/login');
    }
  }, [user, isLoading, router, redirecting]);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Access Restricted</div>
          <p className="text-gray-400">Please log in to access this page</p>
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Render the protected component if authenticated
  return <Component {...props} />;
}
