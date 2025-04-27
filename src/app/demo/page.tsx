'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Demo steps
const DEMO_STEPS = [
  {
    id: 'intro',
    title: 'Welcome to TubeAutomator',
    description: 'See how easy it is to create, schedule, and publish YouTube videos automatically.',
    action: 'Start Demo'
  },
  {
    id: 'api-key',
    title: 'Connect Your YouTube Channel',
    description: 'First, add your YouTube API key or let us create a new channel for you (Pro & Enterprise plans).',
    image: '/demo/api-key-setup.png',
    action: 'Next: Topic Selection'
  },
  {
    id: 'topic-selection',
    title: 'Select Your Content Topics',
    description: 'Choose from AI-recommended trending topics or enter your own custom topics.',
    image: '/demo/topic-selection.png',
    action: 'Next: Content Creation'
  },
  {
    id: 'content-creation',
    title: 'AI-Powered Content Creation',
    description: 'Our AI generates high-quality scripts, voiceovers, and visuals for your videos.',
    image: '/demo/content-creation.png',
    action: 'Next: Scheduling'
  },
  {
    id: 'scheduling',
    title: 'Flexible Content Scheduling',
    description: 'Schedule your videos daily, weekly, or monthly with our easy-to-use calendar.',
    image: '/demo/scheduling.png',
    action: 'Next: Analytics'
  },
  {
    id: 'analytics',
    title: 'Comprehensive Analytics',
    description: 'Track views, subscribers, engagement, and revenue from your YouTube channel.',
    image: '/demo/analytics.png',
    action: 'Next: Publishing'
  },
  {
    id: 'publishing',
    title: 'Automatic Publishing',
    description: 'Videos are automatically uploaded to YouTube according to your schedule.',
    image: '/demo/publishing.png',
    action: 'Complete Demo'
  },
  {
    id: 'conclusion',
    title: 'Ready to Transform Your YouTube Channel?',
    description: 'Start your free trial today and see how TubeAutomator can help you grow your channel.',
    action: 'Start Free Trial'
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleNextStep = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setLoading(true);
      // Simulate loading for a more realistic demo experience
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setLoading(false);
      }, 800);
    } else {
      // On the last step, redirect to signup
      router.push('/signup');
    }
  };
  
  const step = DEMO_STEPS[currentStep];
  const progress = ((currentStep) / (DEMO_STEPS.length - 1)) * 100;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="text-green-500 mr-2">📹</span>
            <span>TubeAutomator</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Back to Home
            </Link>
            <Link href="/signup" className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-700">
            <div 
              className="h-full bg-green-500 transition-all duration-500 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">{step.title}</h1>
            <p className="text-gray-300 text-lg mb-8">{step.description}</p>
            
            {step.image && (
              <div className="mb-8 bg-gray-900 rounded-lg p-4 flex justify-center">
                {/* This would be an actual image in production */}
                <div className="w-full h-64 bg-gray-700 rounded flex items-center justify-center">
                  <p className="text-gray-400">Demo Image: {step.image}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Step {currentStep + 1} of {DEMO_STEPS.length}
              </div>
              
              <button
                onClick={handleNextStep}
                disabled={loading}
                className={`py-3 px-6 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  step.action
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Skip demo link */}
        <div className="mt-6">
          <Link href="/signup" className="text-gray-400 hover:text-white transition-colors">
            Skip demo and sign up now
          </Link>
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          &copy; 2025 TubeAutomator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
