'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { usePayment } from '../hooks/use-payment';
import Link from 'next/link';
import Image from 'next/image';

export default function AccountPage() {
  const { user } = useAuth();
  const { getSubscription, cancelSubscription, loading, error } = usePayment();
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    setLoadingSubscription(true);
    setSubscriptionError(null);
    
    try {
      const result = await getSubscription(user.id);
      if (result.success) {
        setSubscription(result.subscription);
      } else {
        setSubscriptionError(result.error);
      }
    } catch (err) {
      setSubscriptionError('Failed to load subscription information');
      console.error(err);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.')) {
      return;
    }
    
    setCancellingSubscription(true);
    
    try {
      const result = await cancelSubscription(user.id);
      if (result.success) {
        setSubscription(result.subscription);
        alert('Your subscription has been canceled. You will have access until the end of your current billing period.');
      } else {
        setSubscriptionError(result.error);
      }
    } catch (err) {
      setSubscriptionError('Failed to cancel subscription');
      console.error(err);
    } finally {
      setCancellingSubscription(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="account-page">
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Account</h1>
            <p className="mb-6">Please sign in to view your account information.</p>
            <Link href="/login" className="btn">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="page-header">
        <div className="container">
          <h1 className="page-title gradient-text">Your Account</h1>
          <p className="page-subtitle">
            Manage your account settings and subscription
          </p>
        </div>
      </header>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="account-sidebar">
              <div className="account-user">
                <div className="account-avatar">
                  {user.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : user.email.charAt(0)}
                </div>
                <div className="account-info">
                  <h3 className="account-name">
                    {user.user_metadata?.full_name || 'User'}
                  </h3>
                  <p className="account-email">{user.email}</p>
                </div>
              </div>
              
              <nav className="account-nav">
                <Link href="/account" className="account-nav-item active">
                  Account Overview
                </Link>
                <Link href="/account/profile" className="account-nav-item">
                  Profile Settings
                </Link>
                <Link href="/account/billing" className="account-nav-item">
                  Billing & Subscription
                </Link>
                <Link href="/account/api" className="account-nav-item">
                  API Access
                </Link>
              </nav>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="account-content">
              <h2 className="account-section-title">Subscription Details</h2>
              
              {subscriptionError && (
                <div className="error-alert mb-6">
                  <p>{subscriptionError}</p>
                </div>
              )}
              
              {loadingSubscription ? (
                <div className="loading-spinner">Loading subscription information...</div>
              ) : subscription ? (
                <div className="subscription-details">
                  <div className="subscription-info">
                    <div className="subscription-plan">
                      <span className="subscription-label">Current Plan:</span>
                      <span className="subscription-value">{subscription.planName}</span>
                    </div>
                    <div className="subscription-status">
                      <span className="subscription-label">Status:</span>
                      <span className="subscription-value">
                        <span className={`status-badge ${subscription.status}`}>
                          {subscription.status === 'active' ? 'Active' : 
                           subscription.status === 'canceled' ? 'Canceled' : 
                           subscription.status === 'past_due' ? 'Past Due' : 
                           subscription.status}
                        </span>
                      </span>
                    </div>
                    <div className="subscription-renewal">
                      <span className="subscription-label">
                        {subscription.cancelAtPeriodEnd ? 'Access Until:' : 'Next Billing Date:'}
                      </span>
                      <span className="subscription-value">
                        {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="subscription-actions">
                    {!subscription.cancelAtPeriodEnd && (
                      <button 
                        className="btn btn-outline btn-danger"
                        onClick={handleCancelSubscription}
                        disabled={cancellingSubscription}
                      >
                        {cancellingSubscription ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                    <Link href="/pricing" className="btn">
                      {subscription.cancelAtPeriodEnd ? 'Renew Subscription' : 'Change Plan'}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="no-subscription">
                  <p className="mb-6">You don't have an active subscription.</p>
                  <Link href="/pricing" className="btn">
                    View Pricing Plans
                  </Link>
                </div>
              )}
              
              <h2 className="account-section-title mt-12">Account Security</h2>
              <div className="security-options">
                <div className="security-option">
                  <div className="security-option-info">
                    <h3 className="security-option-title">Password</h3>
                    <p className="security-option-description">
                      Change your password or reset it if you've forgotten it.
                    </p>
                  </div>
                  <button className="btn btn-sm">Change Password</button>
                </div>
                
                <div className="security-option">
                  <div className="security-option-info">
                    <h3 className="security-option-title">Two-Factor Authentication</h3>
                    <p className="security-option-description">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <button className="btn btn-sm btn-outline">Enable 2FA</button>
                </div>
                
                <div className="security-option">
                  <div className="security-option-info">
                    <h3 className="security-option-title">Connected Accounts</h3>
                    <p className="security-option-description">
                      Manage your connected social accounts and services.
                    </p>
                  </div>
                  <Link href="/account/connections" className="btn btn-sm">
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
