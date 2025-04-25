'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

export default function PricingPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="text-green-500 mr-2">📹</span>
            <span>TubeAutomator</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard" className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select the perfect plan for your YouTube content creation needs. All plans include our core AI-powered features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-105">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">Starter</h2>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  Perfect for beginners and small YouTube channels looking to grow.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>5 AI-generated videos per month</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Topic generation</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Email support</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link href={user ? "/account" : "/signup"} className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors text-center">
                  {user ? "Choose Plan" : "Get Started"}
                </Link>
              </div>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden relative transition-transform hover:scale-105">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 rounded-bl-lg font-medium">
                Popular
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">Professional</h2>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  Ideal for growing channels and serious content creators.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>20 AI-generated videos per month</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Advanced topic generation</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Comprehensive analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Content scheduler</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link href={user ? "/account" : "/signup"} className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors text-center">
                  {user ? "Choose Plan" : "Get Started"}
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-105">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  For professional YouTubers and content creation teams.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Unlimited AI-generated videos</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Custom topic generation</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Advanced analytics with API access</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Multi-user access</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link href={user ? "/account" : "/signup"} className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors text-center">
                  {user ? "Choose Plan" : "Get Started"}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-gray-800 rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                <p className="text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-gray-300">
                  We offer a 7-day free trial on all plans. No credit card required to start your trial.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How does the AI video generation work?</h3>
                <p className="text-gray-300">
                  Our AI analyzes your channel, audience, and trending topics to generate optimized video content ideas and scripts tailored to your niche.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-300">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="text-xl font-bold flex items-center mb-4">
                <span className="text-green-500 mr-2">📹</span>
                <span>TubeAutomator</span>
              </Link>
              <p className="text-gray-400">
                AI-powered YouTube content creation and channel growth platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/roadmap" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2025 TubeAutomator. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
