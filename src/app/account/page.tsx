'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard-header';

export default function AccountPage() {
  const { user, isLoading, updateUserProfile, subscription, loadingSubscription } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [contentNiche, setContentNiche] = React.useState('');
  const [uploadFrequency, setUploadFrequency] = React.useState('');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load user data
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setContentNiche(user.user_metadata?.preferences?.contentNiche || 'General');
      setUploadFrequency(user.user_metadata?.preferences?.uploadFrequency || 'weekly');
      setNotificationsEnabled(user.user_metadata?.preferences?.notificationsEnabled || false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await updateUserProfile({
        full_name: fullName,
        preferences: {
          contentNiche,
          uploadFrequency,
          notificationsEnabled
        }
      });

      if (result.success) {
        setSuccessMessage('Profile updated successfully');
      } else {
        setErrorMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <DashboardHeader />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your account...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-800 rounded-md text-green-200">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md text-red-200">
            {errorMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent opacity-70"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Email cannot be changed
                  </p>
                </div>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="contentNiche" className="block text-sm font-medium mb-2">
                    Content Niche
                  </label>
                  <select
                    id="contentNiche"
                    value={contentNiche}
                    onChange={(e) => setContentNiche(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Business">Business</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="uploadFrequency" className="block text-sm font-medium mb-2">
                    Upload Frequency
                  </label>
                  <select
                    id="uploadFrequency"
                    value={uploadFrequency}
                    onChange={(e) => setUploadFrequency(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifications"
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="h-4 w-4 text-green-500 rounded bg-gray-700 border-gray-600"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm">
                    Enable email notifications
                  </label>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Subscription</h2>
              {loadingSubscription ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              ) : subscription ? (
                <div className={`p-4 rounded-md border ${
                  subscription.planId === 'enterprise' 
                    ? 'bg-purple-900/30 border-purple-800 text-purple-300' 
                    : subscription.planId === 'pro' 
                    ? 'bg-blue-900/30 border-blue-800 text-blue-300' 
                    : subscription.planId === 'basic' 
                    ? 'bg-green-900/30 border-green-800 text-green-300'
                    : 'bg-gray-800/80 border-gray-700 text-gray-300'
                }`}>
                  <div className="font-medium">{subscription.planName}</div>
                  {subscription.status === 'trialing' ? (
                    <>
                      <div className="text-sm text-gray-300 mt-1">
                        {subscription.trialDaysRemaining} days remaining in trial
                      </div>
                      <div className="text-sm text-gray-300">
                        {subscription.limits.videosPerMonth} videos included
                      </div>
                    </>
                  ) : subscription.status === 'active' ? (
                    <>
                      <div className="text-sm text-gray-300 mt-1">
                        {subscription.limits.videosPerMonth === 999999 
                          ? 'Unlimited videos' 
                          : `${subscription.limits.videosPerMonth} videos per month`}
                      </div>
                      <div className="text-sm text-gray-300">
                        Renews: {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-300 mt-1">
                      No active subscription
                    </div>
                  )}
                  <button
                    className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-white"
                    onClick={() => router.push('/pricing')}
                  >
                    {subscription.status === 'active' 
                      ? 'Change Plan' 
                      : 'Upgrade Plan'}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-gray-800/80 border border-gray-700 rounded-md">
                  <div className="font-medium text-gray-300">No Subscription</div>
                  <div className="text-sm text-gray-400 mt-1">Choose a plan to get started</div>
                  <button
                    className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-white"
                    onClick={() => router.push('/pricing')}
                  >
                    View Plans
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Account Security</h2>
              <button
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors mb-3"
                onClick={() => alert('Password reset functionality will be available soon')}
              >
                Change Password
              </button>
              <button
                className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 rounded-md transition-colors"
                onClick={() => confirm('Are you sure you want to delete your account? This action cannot be undone.') && alert('Account deletion functionality will be available soon')}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
