'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoVideos = [
    {
      id: 1,
      title: "Topic Generation with AI",
      description: "See how TubeAutomator analyzes trending content and your channel's performance to suggest high-performing video topics.",
      duration: "2:45",
      thumbnail: "/demo-thumbnail-1.jpg" // This would be replaced with actual thumbnail
    },
    {
      id: 2,
      title: "Content Creation Workflow",
      description: "Watch how you can generate scripts, storyboards, and complete videos with our advanced AI tools.",
      duration: "3:20",
      thumbnail: "/demo-thumbnail-2.jpg"
    },
    {
      id: 3,
      title: "Scheduling and Optimization",
      description: "Learn how to schedule your content for optimal posting times and get AI-powered SEO recommendations.",
      duration: "2:15",
      thumbnail: "/demo-thumbnail-3.jpg"
    }
  ];

  const handlePlayVideo = (videoId) => {
    setCurrentVideo(videoId);
    setIsPlaying(true);
    // In a real implementation, this would play the actual video
  };

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
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">TubeAutomator Demo</h1>
            <p className="text-gray-300">
              Watch these short videos to see how TubeAutomator can transform your YouTube content creation process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Player */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg overflow-hidden">
              {isPlaying ? (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">
                      {demoVideos.find(v => v.id === currentVideo)?.title}
                    </h3>
                    <p className="text-gray-300 mb-6">
                      {demoVideos.find(v => v.id === currentVideo)?.description}
                    </p>
                    <div className="inline-block bg-green-600 text-white py-3 px-6 rounded-md">
                      Video Player Simulation
                    </div>
                    <p className="mt-4 text-gray-400">
                      In the actual application, this would be a real video player.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Welcome to TubeAutomator Demo</h3>
                    <p className="text-gray-300 mb-6">
                      Select a video from the playlist to see TubeAutomator in action.
                    </p>
                    <button 
                      onClick={() => handlePlayVideo(1)}
                      className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors"
                    >
                      Start Demo
                    </button>
                  </div>
                </div>
              )}
              
              {isPlaying && (
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">
                    {demoVideos.find(v => v.id === currentVideo)?.title}
                  </h2>
                  <p className="text-gray-300">
                    {demoVideos.find(v => v.id === currentVideo)?.description}
                  </p>
                </div>
              )}
            </div>
            
            {/* Playlist */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold">Demo Videos</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {demoVideos.map((video) => (
                  <div 
                    key={video.id}
                    className={`p-4 hover:bg-gray-700 cursor-pointer transition-colors ${currentVideo === video.id ? 'bg-gray-700' : ''}`}
                    onClick={() => handlePlayVideo(video.id)}
                  >
                    <div className="flex">
                      <div className="w-24 h-16 bg-gray-600 rounded mr-3 flex-shrink-0 flex items-center justify-center">
                        {currentVideo === video.id && isPlaying ? (
                          <span className="text-green-500">▶ Playing</span>
                        ) : (
                          <span className="text-white opacity-70">▶</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{video.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-12 bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Try TubeAutomator?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Start your free 14-day trial today and experience how TubeAutomator can help you create better content faster.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="py-3 px-8 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors">
                Start Free Trial
              </Link>
              <Link href="/pricing" className="py-3 px-8 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
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
