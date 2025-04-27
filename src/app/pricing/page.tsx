"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { usePayment } from '@/lib/payment-context';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { plans, loading, error, checkout } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle plan selection
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedPlan) {
      setErrorMessage('Please select a plan to continue.');
      return;
    }

    if (!user) {
      // Redirect to signup if not logged in
      router.push('/signup?plan=' + selectedPlan);
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage('');
      
      // For demo purposes, just redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Failed to process checkout. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <p className="text-xl text-center mb-12">
        Select the perfect plan for your YouTube automation needs. All plans include our core
        AI video generation technology.
      </p>

      {user && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">Current Plan: {user.subscription?.planName || 'No Plan'}</h2>
          <p className="text-gray-300 mb-4">Status: {user.subscription?.status === 'active' ? 'Active' : 'Inactive'}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-xl">Loading plans...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-xl text-red-500">{error}</p>
          <button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:shadow-xl'
              }`}
            >
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold mb-4">
                {formatPrice(plan.price)}
                {plan.price > 0 && <span className="text-sm font-normal">/month</span>}
              </p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 px-4 rounded font-bold ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isProcessing}
              >
                {plan.price === 0 ? 'Start Free Trial' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Continue to Checkout'}
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      )}

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription at any time?</h3>
            <p>Yes, you can cancel your subscription at any time. You'll continue to have access to your plan features until the end of your current billing period.</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">How does the free trial work?</h3>
            <p>Our 7-day free trial gives you access to all features of the Professional plan. No credit card is required to start your trial, and you can upgrade to a paid plan at any time.</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference immediately. When downgrading, your new plan will take effect at the start of your next billing cycle.</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
            <p>We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support payment via PayPal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
