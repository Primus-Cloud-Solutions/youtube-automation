'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './context/auth-context';

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
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
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-green-500">AI-Powered</span> YouTube Content Creation
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Create, schedule, and optimize YouTube videos with our AI-powered platform. Save time and grow your channel faster.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="py-3 px-8 bg-green-600 hover:bg-green-700 rounded-md font-medium text-lg transition-colors">
                Start Free Trial
              </Link>
              <Link href="/demo" className="py-3 px-8 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md font-medium text-lg transition-colors">
                Watch Demo
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How TubeAutomator Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-green-900/50 text-green-500 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate Topics</h3>
                <p className="text-gray-300">
                  Our AI analyzes trending content and your channel's performance to suggest high-performing video topics.
                </p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-green-900/50 text-green-500 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Content</h3>
                <p className="text-gray-300">
                  Generate scripts, storyboards, and even complete videos with our advanced AI tools.
                </p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-green-900/50 text-green-500 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Schedule & Optimize</h3>
                <p className="text-gray-300">
                  Schedule your content for optimal posting times and get AI-powered SEO recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Trusted by Content Creators</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-semibold">Alex Johnson</h3>
                    <p className="text-gray-400 text-sm">Tech Reviewer, 250K subscribers</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "TubeAutomator has completely transformed my content creation process. I've increased my posting frequency by 3x while maintaining quality."
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-semibold">Sarah Williams</h3>
                    <p className="text-gray-400 text-sm">Lifestyle Creator, 500K subscribers</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "The topic generator alone is worth the subscription. It's helped me discover content ideas that consistently outperform my previous videos."
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-semibold">Michael Chen</h3>
                    <p className="text-gray-400 text-sm">Educational Channel, 1M subscribers</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "As someone who values data-driven decisions, the analytics and optimization features have been game-changing for my channel growth."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 bg-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your YouTube Channel?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of content creators who are saving time and growing their channels with TubeAutomator.
            </p>
            <Link href="/signup" className="py-3 px-8 bg-green-600 hover:bg-green-700 rounded-md font-medium text-lg transition-colors inline-block">
              Start Your Free Trial
            </Link>
            <p className="mt-4 text-gray-400">No credit card required. 14-day free trial.</p>
          </div>
        </section>
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
