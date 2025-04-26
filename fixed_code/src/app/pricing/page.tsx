"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { usePayment } from '../../lib/payment-context';

const PricingPage = () => {
  const { user } = useAuth();
  const { createCheckoutSession, loading } = usePayment();
  const router = useRouter();
  
  const [plans, setPlans] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Fetch plans and current subscription on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans
        const plansResponse = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get-plans'
          }),
        });
        
        const plansData = await plansResponse.json();
        
        if (plansData.success) {
          setPlans(plansData.plans);
        } else {
          console.error('Error fetching plans:', plansData.error);
        }
        
        // Fetch current subscription if user is logged in
        if (user?.id) {
          const subscriptionResponse = await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'get-subscription',
              userId: user.id
            }),
          });
          
          const subscriptionData = await subscriptionResponse.json();
          
          if (subscriptionData.success) {
            setCurrentSubscription(subscriptionData.subscription);
          } else {
            console.error('Error fetching subscription:', subscriptionData.error);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Handle subscription checkout
  const handleSubscribe = async (planId) => {
    if (!user) {
      // Redirect to login page if not logged in
      router.push('/login?redirect=pricing');
      return;
    }
    
    setMessage('');
    
    try {
      // Get the current URL for success and cancel redirects
      const origin = window.location.origin;
      const successUrl = `${origin}/dashboard?payment=success`;
      const cancelUrl = `${origin}/pricing?payment=canceled`;
      
      // Create checkout session
      const result = await createCheckoutSession(planId, user.id, user.email, successUrl, cancelUrl);
      
      if (!result.success) {
        setMessage(`Error: ${result.error}`);
      }
      // Redirect is handled by the payment context
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setMessage(`Error: ${error.message}`);
    }
  };
  
  // Handle free trial start
  const handleStartTrial = async () => {
    if (!user) {
      // Redirect to login page if not logged in
      router.push('/login?redirect=pricing');
      return;
    }
    
    setMessage('');
    
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start-trial',
          userId: user.id,
          email: user.email,
          trialDays: 7
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to dashboard
        router.push('/dashboard?trial=started');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error starting trial:', error);
      setMessage(`Error: ${error.message}`);
    }
  };
  
  // Check if user is on a specific plan
  const isOnPlan = (planId) => {
    if (!currentSubscription) return false;
    return currentSubscription.planId === planId;
  };
  
  // Check if user is in trial period
  const isInTrial = () => {
    if (!currentSubscription) return false;
    return currentSubscription.status === 'trialing';
  };
  
  // Format price for display
  const formatPrice = (price) => {
    return `$${(price / 100).toFixed(2)}`;
  };
  
  // Get days remaining in trial
  const getTrialDaysRemaining = () => {
    if (!currentSubscription || !isInTrial()) return 0;
    return currentSubscription.trialDaysRemaining || 0;
  };
  
  // Get current plan name
  const getCurrentPlanName = () => {
    if (!currentSubscription) return 'No Plan';
    return currentSubscription.planName || 'Unknown Plan';
  };
  
  // Get current plan status
  const getCurrentPlanStatus = () => {
    if (!currentSubscription) return 'inactive';
    
    if (isInTrial()) {
      return 'trial';
    }
    
    if (currentSubscription.cancelAtPeriodEnd) {
      return 'canceling';
    }
    
    return currentSubscription.status || 'inactive';
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center">
              <span className="text-green-400 mr-2">Tube</span>Automator
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link href="/pricing" className="text-green-400 font-medium">
                Pricing
              </Link>
              {user ? (
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white transition">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Select the perfect plan for your YouTube automation needs. All plans include our core AI video generation technology.
          </p>
          
          {/* Current Subscription Status */}
          {user && (
            <div className="mt-8 inline-block bg-gray-800 rounded-lg px-6 py-4 border border-gray-700">
              {isLoading ? (
                <div className="animate-pulse h-6 w-48 bg-gray-700 rounded"></div>
              ) : (
                <div className="text-left">
                  <p className="text-gray-400">Current Plan: <span className="font-semibold text-white">{getCurrentPlanName()}</span></p>
                  <div className="flex items-center mt-1">
                    <p className="text-gray-400 text-sm">Status: </p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getCurrentPlanStatus() === 'active' ? 'bg-green-900 text-green-200' :
                      getCurrentPlanStatus() === 'trial' ? 'bg-blue-900 text-blue-200' :
                      getCurrentPlanStatus() === 'canceling' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {getCurrentPlanStatus() === 'active' ? 'Active' :
                       getCurrentPlanStatus() === 'trial' ? `Trial (${getTrialDaysRemaining()} days left)` :
                       getCurrentPlanStatus() === 'canceling' ? 'Canceling' :
                       'Inactive'}
                    </span>
                  </div>
                  {currentSubscription && currentSubscription.currentPeriodEnd && (
                    <p className="text-gray-400 text-sm mt-1">
                      {currentSubscription.cancelAtPeriodEnd 
                        ? `Access until: ${formatDate(currentSubscription.currentPeriodEnd)}`
                        : `Next billing date: ${formatDate(currentSubscription.currentPeriodEnd)}`
                      }
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {message && (
          <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-md ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
            {message}
          </div>
        )}
        
        {/* Pricing Plans */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800 rounded-lg p-6 h-96"></div>
            ))}
          </div>
        ) : plans ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Free Trial */}
            <div className={`bg-gray-800 rounded-lg overflow-hidden border-2 ${isOnPlan('free') || isInTrial() ? 'border-green-500' : 'border-gray-700'}`}>
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
                <h2 className="text-xl font-bold">{plans.free.name}</h2>
                <p className="text-3xl font-bold mt-2">Free</p>
                <p className="text-sm text-gray-300 mt-1">7-day trial</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  {plans.free.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={handleStartTrial}
                  disabled={isInTrial() || loading || isOnPlan('basic') || isOnPlan('pro') || isOnPlan('enterprise')}
                  className={`w-full py-2 px-4 rounded-md font-medium transition ${
                    isInTrial() || isOnPlan('basic') || isOnPlan('pro') || isOnPlan('enterprise')
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isInTrial()
                    ? 'Trial Active'
                    : isOnPlan('basic') || isOnPlan('pro') || isOnPlan('enterprise')
                      ? 'Already Subscribed'
                      : 'Start Free Trial'}
                </button>
                
                <p className="text-xs text-gray-400 mt-2 text-center">
                  No credit card required
                </p>
              </div>
            </div>
            
            {/* Basic Plan */}
            <div className={`bg-gray-800 rounded-lg overflow-hidden border-2 ${isOnPlan('basic') ? 'border-green-500' : 'border-gray-700'}`}>
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <h2 className="text-xl font-bold">{plans.basic.name}</h2>
                <p className="text-3xl font-bold mt-2">{formatPrice(plans.basic.price)}</p>
                <p className="text-sm text-gray-300 mt-1">per month</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  {plans.basic.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe('basic')}
                  disabled={isOnPlan('basic') || loading}
                  className={`w-full py-2 px-4 rounded-md font-medium transition ${
                    isOnPlan('basic')
                      ? 'bg-green-900 text-green-200 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isOnPlan('basic')
                    ? 'Current Plan'
                    : loading
                      ? 'Processing...'
                      : 'Subscribe'}
                </button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className={`bg-gray-800 rounded-lg overflow-hidden border-2 ${isOnPlan('pro') ? 'border-green-500' : 'border-green-700'} relative`}>
              <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-12">
                POPULAR
              </div>
              
              <div className="bg-gradient-to-r from-green-900 to-green-800 px-6 py-4">
                <h2 className="text-xl font-bold">{plans.pro.name}</h2>
                <p className="text-3xl font-bold mt-2">{formatPrice(plans.pro.price)}</p>
                <p className="text-sm text-gray-300 mt-1">per month</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  {plans.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe('pro')}
                  disabled={isOnPlan('pro') || loading}
                  className={`w-full py-2 px-4 rounded-md font-medium transition ${
                    isOnPlan('pro')
                      ? 'bg-green-900 text-green-200 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isOnPlan('pro')
                    ? 'Current Plan'
                    : loading
                      ? 'Processing...'
                      : 'Subscribe'}
                </button>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className={`bg-gray-800 rounded-lg overflow-hidden border-2 ${isOnPlan('enterprise') ? 'border-green-500' : 'border-gray-700'}`}>
              <div className="bg-gradient-to-r from-purple-900 to-purple-800 px-6 py-4">
                <h2 className="text-xl font-bold">{plans.enterprise.name}</h2>
                <p className="text-3xl font-bold mt-2">{formatPrice(plans.enterprise.price)}</p>
                <p className="text-sm text-gray-300 mt-1">per month</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  {plans.enterprise.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe('enterprise')}
                  disabled={isOnPlan('enterprise') || loading}
                  className={`w-full py-2 px-4 rounded-md font-medium transition ${
                    isOnPlan('enterprise')
                      ? 'bg-green-900 text-green-200 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isOnPlan('enterprise')
                    ? 'Current Plan'
                    : loading
                      ? 'Processing...'
                      : 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-red-400">Error loading plans. Please try again later.</p>
          </div>
        )}
        
        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Can I cancel my subscription at any time?</h3>
              <p className="text-gray-300">
                Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How does the free trial work?</h3>
              <p className="text-gray-300">
                Our 7-day free trial gives you full access to all features of the Pro plan. No credit card is required to start your trial. You can upgrade to a paid plan at any time during or after your trial.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What happens to my videos if I downgrade or cancel?</h3>
              <p className="text-gray-300">
                Any videos already created and uploaded to your YouTube channel will remain there. However, scheduled videos that haven't been processed yet will be canceled, and you'll lose access to features not included in your new plan.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Do I need to connect my YouTube account?</h3>
              <p className="text-gray-300">
                Yes, to enable automatic uploads to YouTube, you'll need to connect your YouTube account via API key. We provide detailed instructions on how to set this up in your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
