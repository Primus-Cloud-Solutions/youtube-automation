'use client';

import React, { useState } from 'react';
import { useAuth, AuthProvider } from '../context/auth-context';
import { usePayment } from '../hooks/use-payment';
import Link from 'next/link';
import Image from 'next/image';

// Create a safe component that uses useAuth inside AuthProvider
function PricingContent() {
  const { user } = useAuth();
  const { createCheckoutSession, loading, error } = usePayment();
  const [processingPlan, setProcessingPlan] = useState(null);

  const handleSubscribe = async (planId) => {
    if (!user) {
      // Redirect to signup with plan parameter
      window.location.href = `/signup?plan=${planId}`;
      return;
    }

    setProcessingPlan(planId);
    try {
      await createCheckoutSession(planId, user.id);
      // Redirect happens in the createCheckoutSession function
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="pricing-page">
      <header className="page-header">
        <div className="container">
          <h1 className="page-title gradient-text">Choose Your Plan</h1>
          <p className="page-subtitle">
            Select the plan that best fits your content creation needs
          </p>
        </div>
      </header>

      {error && (
        <div className="container mb-8">
          <div className="error-alert">
            <p>{error}</p>
          </div>
        </div>
      )}

      <section className="pricing-section">
        <div className="container">
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-name">Starter</div>
                <div className="pricing-price">$19<span className="text-sm font-normal">/month</span></div>
                <div className="pricing-description">Perfect for content creators just getting started</div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>5 AI-generated videos per month</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Basic voice synthesis</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Standard scheduling</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Basic analytics</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Email support</span>
                </div>
              </div>
              <button 
                className="btn pricing-cta"
                onClick={() => handleSubscribe('starter')}
                disabled={loading || processingPlan === 'starter'}
              >
                {loading && processingPlan === 'starter' ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
            
            <div className="pricing-card popular">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <div className="pricing-name">Professional</div>
                <div className="pricing-price">$49<span className="text-sm font-normal">/month</span></div>
                <div className="pricing-description">For serious creators looking to scale</div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>20 AI-generated videos per month</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Advanced voice synthesis</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Smart scheduling</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Comprehensive analytics</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Priority support</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Trend analysis</span>
                </div>
              </div>
              <button 
                className="btn pricing-cta"
                onClick={() => handleSubscribe('professional')}
                disabled={loading || processingPlan === 'professional'}
              >
                {loading && processingPlan === 'professional' ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-name">Enterprise</div>
                <div className="pricing-price">$99<span className="text-sm font-normal">/month</span></div>
                <div className="pricing-description">For teams and professional studios</div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Unlimited AI-generated videos</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Premium voice synthesis</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Advanced scheduling</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Advanced analytics & reporting</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Dedicated account manager</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>API access</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Custom integrations</span>
                </div>
              </div>
              <button 
                className="btn pricing-cta"
                onClick={() => handleSubscribe('enterprise')}
                disabled={loading || processingPlan === 'enterprise'}
              >
                {loading && processingPlan === 'enterprise' ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title gradient-text">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="faq-item">
              <div className="faq-question">
                Can I upgrade or downgrade my plan?
              </div>
              <div className="faq-answer">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                Is there a free trial?
              </div>
              <div className="faq-answer">
                We offer a 7-day free trial for all plans. You can cancel anytime during the trial period and you won't be charged.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                What payment methods do you accept?
              </div>
              <div className="faq-answer">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                How do I cancel my subscription?
              </div>
              <div className="faq-answer">
                You can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of your current billing period.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrap the component with AuthProvider
export default function PricingPage() {
  return (
    <AuthProvider>
      <PricingContent />
    </AuthProvider>
  );
}
