'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../lib/auth-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../lib/auth-context';

// Create a safe component that uses useAuth inside AuthProvider
function HomeContent() {
  const { user } = useAuth();
  
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <div className="inline-block bg-gradient-to-r from-red-500 to-purple-600 rounded-full px-3 py-1 text-xs font-semibold text-white mb-5">
                AI-POWERED PLATFORM
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Automate Your YouTube Content Creation
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create, schedule, and optimize YouTube videos with our AI-powered platform. Save time and grow your channel faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-6 py-3 rounded-md text-base font-medium hover:from-red-600 hover:to-purple-700 shadow-md"
                >
                  Get Started Free
                </Link>
                <Link 
                  href="/features" 
                  className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-md text-base font-medium hover:bg-gray-50"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <div className="ml-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">500+</span> content creators trust us
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                <div className="aspect-video bg-gray-200 rounded-md mb-4"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies the YouTube content creation process from start to finish
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Generate Content Ideas",
                description: "Our AI analyzes trending topics and your channel's performance to suggest high-potential video ideas."
              },
              {
                title: "Create & Edit Videos",
                description: "Use our AI tools to generate scripts, voiceovers, and edit videos with just a few clicks."
              },
              {
                title: "Schedule & Optimize",
                description: "Schedule uploads at optimal times and get AI-powered suggestions to improve your video's performance."
              }
            ].map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, manage, and grow your YouTube channel
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Content Generator",
                description: "Generate video scripts, descriptions, and titles optimized for engagement."
              },
              {
                title: "Voice Synthesis",
                description: "Convert your scripts to natural-sounding voiceovers in multiple languages."
              },
              {
                title: "Smart Scheduling",
                description: "Schedule uploads at optimal times based on your audience's activity."
              },
              {
                title: "Performance Analytics",
                description: "Track your channel's growth with comprehensive analytics and insights."
              },
              {
                title: "Keyword Research",
                description: "Find high-performing keywords to improve your video's discoverability."
              },
              {
                title: "Thumbnail Generator",
                description: "Create eye-catching thumbnails that drive higher click-through rates."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}

// Wrap the component with AuthProvider
export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
