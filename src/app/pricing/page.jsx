'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePayment } from '@/lib/payment-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Pricing() {
  const { user } = useAuth();
  const { createCheckoutSession, loading, error } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutStatus, setCheckoutStatus] = useState('');

  // Get URL parameters for payment status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      setCheckoutStatus('success');
    } else if (paymentStatus === 'canceled') {
      setCheckoutStatus('canceled');
    }
  }, []);

  const handleSelectPlan = async (planId) => {
    if (!user) {
      // Redirect to signup if not logged in
      window.location.href = '/signup';
      return;
    }
    
    setSelectedPlan(planId);
    const result = await createCheckoutSession(planId, user.id);
    
    if (!result.success) {
      setCheckoutStatus('error');
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$19',
      description: 'Perfect for new creators just getting started',
      features: [
        '5 AI-generated videos per month',
        'Basic voice synthesis',
        'Standard scheduling',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$49',
      description: 'For growing channels looking to scale',
      features: [
        '20 AI-generated videos per month',
        'Advanced voice synthesis',
        'Smart scheduling',
        'Comprehensive analytics',
        'Priority support',
        'Trend analysis'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      description: 'For established channels and businesses',
      features: [
        'Unlimited AI-generated videos',
        'Premium voice synthesis',
        'Advanced scheduling',
        'Advanced analytics & reporting',
        'Dedicated account manager',
        'API access',
        'Custom integrations'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your YouTube channel's needs
          </p>
        </div>
        
        {checkoutStatus === 'success' && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-md">
            <p className="font-medium">Payment successful!</p>
            <p>Thank you for subscribing. Your account has been upgraded.</p>
          </div>
        )}
        
        {checkoutStatus === 'canceled' && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-md">
            <p>Your payment was canceled. Please try again if you'd like to subscribe.</p>
          </div>
        )}
        
        {checkoutStatus === 'error' && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
            <p className="font-medium">Error processing payment</p>
            <p>{error || 'There was an issue with your payment. Please try again.'}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-lg p-8 border ${plan.popular ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-200'} hover:shadow-md transition-shadow relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading && selectedPlan === plan.id}
                className={`w-full block text-center py-3 px-4 rounded-md font-medium ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white hover:from-red-600 hover:to-purple-700' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                } disabled:opacity-50`}
              >
                {loading && selectedPlan === plan.id ? 'Processing...' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How does the billing work?",
                answer: "All plans are billed monthly. You can upgrade, downgrade, or cancel your subscription at any time from your account settings."
              },
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle."
              },
              {
                question: "Is there a free trial?",
                answer: "We offer a 7-day free trial on all plans. You won't be charged until the trial period ends, and you can cancel anytime."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "We offer a 30-day money-back guarantee if you're not completely satisfied with our service."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
