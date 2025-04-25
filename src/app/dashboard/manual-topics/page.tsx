'use client';

import React, { useState } from 'react';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';
import { useAuth } from '../../../lib/auth-context';

function ManualTopicsPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  
  const handleGenerateTopics = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock generated topics based on prompt
      const mockTopics = [
        `How to Use AI for ${prompt} Creation`,
        `10 Best Practices for ${prompt} in 2025`,
        `The Future of ${prompt}: Trends and Predictions`,
        `${prompt} for Beginners: A Complete Guide`,
        `Advanced ${prompt} Techniques for Content Creators`,
        `Why ${prompt} is Changing the Industry`,
        `${prompt} vs Traditional Methods: A Comparison`,
        `Optimize Your Workflow with ${prompt} Tools`,
        `The Ultimate ${prompt} Tutorial for YouTube`,
        `How Top Creators Use ${prompt} to Grow Their Channel`
      ];
      
      setGeneratedTopics(mockTopics);
      setIsGenerating(false);
    }, 2000);
  };
  
  const toggleTopicSelection = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  const handleSaveTopics = () => {
    alert(`${selectedTopics.length} topics saved successfully!`);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Generate Video Topics</h1>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Topic Generator</h2>
            <p className="text-gray-300 mb-6">
              Enter a keyword or topic area, and our AI will generate engaging video topic ideas for your YouTube channel.
            </p>
            
            <form onSubmit={handleGenerateTopics} className="mb-6">
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  Keyword or Topic Area
                </label>
                <input
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Video Editing, Cryptocurrency, Fitness, etc."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isGenerating || !prompt}
                className="py-3 px-6 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Topics'}
              </button>
            </form>
            
            {generatedTopics.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Generated Topics</h3>
                <p className="text-gray-300 mb-4">
                  Select the topics you'd like to save for your content calendar.
                </p>
                
                <div className="space-y-3 mb-6">
                  {generatedTopics.map((topic, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedTopics.includes(topic)
                          ? 'bg-green-900/30 border border-green-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => toggleTopicSelection(topic)}
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(topic)}
                          onChange={() => {}}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <p className="font-medium">{topic}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Estimated engagement: {Math.floor(Math.random() * 30) + 70}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">
                    {selectedTopics.length} topics selected
                  </p>
                  <button
                    onClick={handleSaveTopics}
                    disabled={selectedTopics.length === 0}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Save Selected Topics
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
            <p className="text-gray-300 mb-6">
              Based on current YouTube trends, these topics are likely to perform well.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">AI Tools for Content Creators</h3>
                <p className="text-gray-300 mb-2">Trending in Technology category</p>
                <div className="flex justify-between">
                  <span className="text-green-500">High engagement potential</span>
                  <button className="text-blue-400 hover:text-blue-300">Use</button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Passive Income Strategies 2025</h3>
                <p className="text-gray-300 mb-2">Trending in Finance category</p>
                <div className="flex justify-between">
                  <span className="text-green-500">High engagement potential</span>
                  <button className="text-blue-400 hover:text-blue-300">Use</button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Home Office Setup Guide</h3>
                <p className="text-gray-300 mb-2">Trending in Lifestyle category</p>
                <div className="flex justify-between">
                  <span className="text-yellow-500">Medium engagement potential</span>
                  <button className="text-blue-400 hover:text-blue-300">Use</button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">YouTube Algorithm Explained</h3>
                <p className="text-gray-300 mb-2">Trending in Education category</p>
                <div className="flex justify-between">
                  <span className="text-green-500">High engagement potential</span>
                  <button className="text-blue-400 hover:text-blue-300">Use</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(ManualTopicsPage);
