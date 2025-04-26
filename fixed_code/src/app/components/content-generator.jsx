'use client';

import { useState, useEffect } from 'react';
import { createPlatformAPI, PLATFORM_TYPES } from '../../lib/platform-api-factory';

// Content Generator Component for multi-platform content creation
export default function ContentGenerator({ user, userPlan }) {
  // State for content generation
  const [contentType, setContentType] = useState('auto'); // 'auto' or 'manual'
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [availableNiches, setAvailableNiches] = useState([]);
  const [targetPlatforms, setTargetPlatforms] = useState([PLATFORM_TYPES.YOUTUBE]);
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [error, setError] = useState(null);
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly');
  const [manualTopics, setManualTopics] = useState('');
  
  // Premium features state
  const [createNewChannel, setCreateNewChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  
  // Load available niches on component mount
  useEffect(() => {
    async function fetchNiches() {
      try {
        const response = await fetch('/api/content?action=get-categories');
        const data = await response.json();
        
        if (data.success) {
          setAvailableNiches(data.categories);
        } else {
          setError(data.error || 'Failed to load content categories');
        }
      } catch (error) {
        setError('Error loading content categories: ' + error.message);
      }
    }
    
    fetchNiches();
  }, []);
  
  // Handle niche selection
  const handleNicheToggle = (nicheId) => {
    if (selectedNiches.includes(nicheId)) {
      setSelectedNiches(selectedNiches.filter(id => id !== nicheId));
    } else {
      setSelectedNiches([...selectedNiches, nicheId]);
    }
  };
  
  // Handle platform selection
  const handlePlatformToggle = (platform) => {
    if (targetPlatforms.includes(platform)) {
      setTargetPlatforms(targetPlatforms.filter(p => p !== platform));
    } else {
      setTargetPlatforms([...targetPlatforms, platform]);
    }
  };
  
  // Generate content based on selected options
  const handleGenerateContent = async () => {
    if (selectedNiches.length === 0) {
      setError('Please select at least one content niche');
      return;
    }
    
    if (targetPlatforms.length === 0) {
      setError('Please select at least one target platform');
      return;
    }
    
    if (targetPlatforms.includes(PLATFORM_TYPES.YOUTUBE) && !youtubeApiKey && !createNewChannel) {
      setError('Please enter your YouTube API key or select "Create new channel"');
      return;
    }
    
    if (createNewChannel && !newChannelName) {
      setError('Please enter a name for your new YouTube channel');
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    
    try {
      // First, handle channel creation if needed
      if (createNewChannel && targetPlatforms.includes(PLATFORM_TYPES.YOUTUBE)) {
        const channelResponse = await fetch('/api/channel-creator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'create-channel',
            userId: user.id,
            channelName: newChannelName,
            channelDescription: newChannelDescription,
            niche: selectedNiches[0], // Use first selected niche for channel theme
          }),
        });
        
        const channelData = await channelResponse.json();
        
        if (!channelData.success) {
          throw new Error(channelData.error || 'Failed to create YouTube channel');
        }
        
        // Use the new API key for content generation
        setYoutubeApiKey(channelData.apiKey);
      }
      
      // Generate content for each selected niche and platform
      const contentResults = [];
      
      for (const nicheId of selectedNiches) {
        const niche = availableNiches.find(n => n.id === nicheId);
        
        // Determine topics based on content type
        let topics = [];
        
        if (contentType === 'auto') {
          // Get trending topics for this niche
          const topicsResponse = await fetch('/api/content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'get-trending-topics',
              category: nicheId,
              count: 3,
              apiKey: youtubeApiKey,
            }),
          });
          
          const topicsData = await topicsResponse.json();
          
          if (!topicsData.success) {
            throw new Error(topicsData.error || `Failed to get trending topics for ${niche.name}`);
          }
          
          topics = topicsData.topics;
        } else {
          // Use manually entered topics
          const manualTopicsList = manualTopics.split('\n')
            .map(topic => topic.trim())
            .filter(topic => topic.length > 0)
            .map(topic => ({ title: topic, description: '', score: 80 }));
          
          topics = manualTopicsList.slice(0, 3); // Limit to 3 topics
        }
        
        // Generate content for each topic and platform
        for (const topic of topics) {
          for (const platform of targetPlatforms) {
            // Generate script
            const scriptResponse = await fetch('/api/content', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'generate-script',
                topic: topic.title,
                category: nicheId,
                length: platform === PLATFORM_TYPES.YOUTUBE ? 'medium' : 'short',
              }),
            });
            
            const scriptData = await scriptResponse.json();
            
            if (!scriptData.success) {
              throw new Error(scriptData.error || `Failed to generate script for ${topic.title}`);
            }
            
            // Schedule the content
            const scheduleResponse = await fetch('/api/scheduler', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'schedule-video',
                userId: user.id,
                videoId: `video-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                title: topic.title,
                description: topic.description,
                scheduleDate: getNextScheduleDate(scheduleFrequency),
                scheduleTime: '12:00',
                platform: platform,
                apiKey: youtubeApiKey,
              }),
            });
            
            const scheduleData = await scheduleResponse.json();
            
            if (!scheduleData.success) {
              throw new Error(scheduleData.error || `Failed to schedule content for ${topic.title}`);
            }
            
            // Add to results
            contentResults.push({
              id: scheduleData.scheduleId,
              title: topic.title,
              platform: platform,
              niche: niche.name,
              scheduledAt: scheduleData.scheduledAt,
              status: 'scheduled',
            });
          }
        }
      }
      
      setGeneratedContent(contentResults);
    } catch (error) {
      setError('Error generating content: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Get next schedule date based on frequency
  const getNextScheduleDate = (frequency) => {
    const now = new Date();
    let nextDate = new Date();
    
    switch (frequency) {
      case 'daily':
        nextDate.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(now.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(now.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(now.getMonth() + 1);
        break;
      default:
        nextDate.setDate(now.getDate() + 7); // Default to weekly
    }
    
    return nextDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  // Check if user has premium plan
  const isPremium = userPlan === 'premium' || userPlan === 'enterprise';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Content Generator</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Content Generation Settings</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Content Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="contentType"
                value="auto"
                checked={contentType === 'auto'}
                onChange={() => setContentType('auto')}
              />
              <span className="ml-2">Auto-generate from trending topics</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="contentType"
                value="manual"
                checked={contentType === 'manual'}
                onChange={() => setContentType('manual')}
              />
              <span className="ml-2">Use my own topics</span>
            </label>
          </div>
        </div>
        
        {contentType === 'manual' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Topics (one per line)</label>
            <textarea
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-gray-700 border-gray-600"
              rows="4"
              value={manualTopics}
              onChange={(e) => setManualTopics(e.target.value)}
              placeholder="Enter your content topics here, one per line"
            ></textarea>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Content Niches</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {availableNiches.map((niche) => (
              <label key={niche.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedNiches.includes(niche.id)}
                  onChange={() => handleNicheToggle(niche.id)}
                />
                <span className="ml-2">{niche.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Target Platforms</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={targetPlatforms.includes(PLATFORM_TYPES.YOUTUBE)}
                onChange={() => handlePlatformToggle(PLATFORM_TYPES.YOUTUBE)}
              />
              <span className="ml-2">YouTube</span>
            </label>
            {isPremium && (
              <>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={targetPlatforms.includes(PLATFORM_TYPES.FACEBOOK)}
                    onChange={() => handlePlatformToggle(PLATFORM_TYPES.FACEBOOK)}
                  />
                  <span className="ml-2">Facebook</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={targetPlatforms.includes(PLATFORM_TYPES.INSTAGRAM)}
                    onChange={() => handlePlatformToggle(PLATFORM_TYPES.INSTAGRAM)}
                  />
                  <span className="ml-2">Instagram</span>
                </label>
              </>
            )}
          </div>
          {!isPremium && (
            <p className="text-sm text-gray-400 mt-1">Upgrade to Premium to access additional platforms</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Schedule Frequency</label>
          <select
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-gray-700 border-gray-600"
            value={scheduleFrequency}
            onChange={(e) => setScheduleFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        {targetPlatforms.includes(PLATFORM_TYPES.YOUTUBE) && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">YouTube Channel</label>
            
            {isPremium && (
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={createNewChannel}
                    onChange={() => setCreateNewChannel(!createNewChannel)}
                  />
                  <span className="ml-2">Create a new YouTube channel for me</span>
                </label>
              </div>
            )}
            
            {createNewChannel ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-gray-700 border-gray-600"
                  placeholder="New channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-gray-700 border-gray-600"
                  placeholder="Channel description (optional)"
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                />
              </div>
            ) : (
              <input
                type="text"
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-gray-700 border-gray-600"
                placeholder="Enter your YouTube API key"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
              />
            )}
          </div>
        )}
        
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGenerateContent}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>
      </div>
      
      {generatedContent.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Platform</th>
                  <th className="px-4 py-2 text-left">Niche</th>
                  <th className="px-4 py-2 text-left">Scheduled For</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {generatedContent.map((content) => (
                  <tr key={content.id} className="border-t border-gray-600">
                    <td className="px-4 py-2">{content.title}</td>
                    <td className="px-4 py-2">{content.platform}</td>
                    <td className="px-4 py-2">{content.niche}</td>
                    <td className="px-4 py-2">{new Date(content.scheduledAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                        {content.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
