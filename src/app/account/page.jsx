'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePayment } from '@/lib/payment-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Account() {
  const { user, signOut } = useAuth();
  const { getSubscription, cancelSubscription, loading, error } = usePayment();
  const [subscription, setSubscription] = useState(null);
  const [cancelStatus, setCancelStatus] = useState('');

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    const result = await getSubscription(user?.id);
    if (result.success) {
      setSubscription(result.subscription);
    }
  };

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      const result = await cancelSubscription(user?.id);
      if (result.success) {
        setCancelStatus('success');
        setSubscription(result.subscription);
      } else {
        setCancelStatus('error');
      }
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Account</h1>
          <p className="text-xl text-gray-600 mb-8">Please log in to view your account details.</p>
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-6 py-3 rounded-md text-base font-medium hover:from-red-600 hover:to-purple-700 shadow-md"
          >
            Log In
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Account</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-base text-gray-900">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="mt-1 text-base text-gray-900">{user.id}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
          </div>
          <div className="px-6 py-5">
            {loading ? (
              <p className="text-gray-600">Loading subscription details...</p>
            ) : subscription ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
                    <p className="mt-1 text-base text-gray-900 font-semibold">{subscription.planName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subscription.status === 'active' ? 'Active' : subscription.status}
                      </span>
                      {subscription.cancelAtPeriodEnd && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Cancels at period end
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Period Ends</h3>
                    <p className="mt-1 text-base text-gray-900">
                      {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {cancelStatus === 'success' ? (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    <p>Your subscription has been canceled. You will have access until the end of your current billing period.</p>
                  </div>
                ) : cancelStatus === 'error' ? (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p>Error canceling subscription: {error || 'An unexpected error occurred'}</p>
                  </div>
                ) : null}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {!subscription.cancelAtPeriodEnd && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Cancel Subscription'}
                    </button>
                  )}
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {subscription.cancelAtPeriodEnd ? 'Reactivate Subscription' : 'Change Plan'}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">You don't have an active subscription.</p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Plans
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4">
              <div>
                <Link 
                  href="/account/change-password" 
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Change Password
                </Link>
              </div>
              <div>
                <Link 
                  href="/account/notifications" 
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Notification Settings
                </Link>
              </div>
              <div>
                <button 
                  className="text-red-600 hover:text-red-500"
                  onClick={() => confirm('Are you sure you want to delete your account? This action cannot be undone.') && alert('Account deletion would be implemented in production.')}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
