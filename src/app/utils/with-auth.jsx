'use client';

import React from 'react';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';

// Higher-order component to protect routes
export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-center">
            <div className="text-xl font-semibold mb-2">Loading...</div>
            <p className="text-muted-foreground">Verifying your authentication</p>
          </div>
        </div>
      );
    }
    
    // Redirect to login if not authenticated
    if (!user) {
      React.useEffect(() => {
        router.push('/login');
      }, [router]);
      
      return null;
    }
    
    // Render the protected component if authenticated
    return <Component {...props} />;
  };
}
