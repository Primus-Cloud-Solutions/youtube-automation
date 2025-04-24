'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { useContent } from '../../context/content-context';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../app/components/dashboard-header';

function TopicSchedulerPage() {
  const { user } = useAuth();
  const { generateScript, scheduleVideo, loading } = useContent();
  
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [generating, setGenerating] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleGenerateContent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGenerating(true);
    
    try {
      const result = await generateScript(topic);
      
      if (result.success) {
        setGeneratedContent(result.content);
        if (result.content.titleSuggestions && result.content.titleSuggestions.length > 0) {
          setSelectedTitle(result.content.titleSuggestions[0]);
        }
      } else {
        setError(result.error || 'Failed to generate content');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleScheduleVideo = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setScheduling(true);
    
    if (!selectedTitle || !scheduledDate || !scheduledTime) {
      setError('Please fill in all required fields');
      setScheduling(false);
      return;
    }
    
    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      if (isNaN(scheduledDateTime.getTime())) {
        setError('Invalid date or time');
        setScheduling(false);
        return;
      }
      
      const result = await scheduleVideo({
        title: selectedTitle,
        description: generatedContent.description,
        tags: generatedContent.tags,
        scheduledTime: scheduledDateTime.toISOString()
      });
      
      if (result.success) {
        setSuccess('Video scheduled successfully!');
        // Reset form
        setTopic('');
        setGeneratedContent(null);
        setSelectedTitle('');
        setScheduledDate('');
        setScheduledTime('');
      } else {
        setError(result.error || 'Failed to schedule video');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4 fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Topic Scheduler</h1>
          <p className="text-muted-foreground">Generate and schedule content for your YouTube channel</p>
        </div>
        
        {error && (
          <div className="glass-card p-4 mb-6 border border-destructive/30 bg-destructive/10">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="glass-card p-4 mb-6 border border-green-500/30 bg-green-500/10">
            <p className="text-green-400">{success}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic Generation Form */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Content</h2>
            
            <form onSubmit={handleGenerateContent}>
              <div className="mb-4">
                <label htmlFor="topic" className="block text-sm font-medium mb-2">
                  Topic or Keyword
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic or keyword for your video"
                  className="w-full p-2.5 bg-muted border border-border rounded-md"
                  disabled={generating || loading}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Examples: "Latest iPhone features", "Beginner yoga poses", "Crypto investing tips"
                </p>
              </div>
              
              <button
                type="submit"
                disabled={generating || loading || !topic.trim()}
                className="btn w-full py-3"
              >
                {generating ? 'Generating...' : 'Generate Content'}
              </button>
            </form>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Content Generation Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific with your topic for better results</li>
                <li>• Include your target audience (e.g., "for beginners")</li>
                <li>• Specify content type (e.g., "tutorial", "review", "explanation")</li>
                <li>• Add your preferred tone (e.g., "professional", "casual", "funny")</li>
              </ul>
            </div>
          </div>
          
          {/* Generated Content and Scheduling */}
          <div>
            {generatedContent ? (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Schedule Video</h2>
                
                <form onSubmit={handleScheduleVideo}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      Video Title
                    </label>
                    <select
                      id="title"
                      value={selectedTitle}
                      onChange={(e) => setSelectedTitle(e.target.value)}
                      className="w-full p-2.5 bg-muted border border-border rounded-md"
                      disabled={scheduling || loading}
                      required
                    >
                      {generatedContent.titleSuggestions.map((title, index) => (
                        <option key={index} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <div className="w-full p-2.5 bg-muted border border-border rounded-md h-32 overflow-y-auto text-sm">
                      {generatedContent.description}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="scheduledDate" className="block text-sm font-medium mb-2">
                        Scheduled Date
                      </label>
                      <input
                        id="scheduledDate"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full p-2.5 bg-muted border border-border rounded-md"
                        disabled={scheduling || loading}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="scheduledTime" className="block text-sm font-medium mb-2">
                        Scheduled Time
                      </label>
                      <input
                        id="scheduledTime"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full p-2.5 bg-muted border border-border rounded-md"
                        disabled={scheduling || loading}
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={scheduling || loading || !selectedTitle || !scheduledDate || !scheduledTime}
                    className="btn w-full py-3"
                  >
                    {scheduling ? 'Scheduling...' : 'Schedule Video'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass-card p-6 flex flex-col items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-3">No Content Generated Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter a topic and click "Generate Content" to get started.
                  </p>
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📝</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our AI will generate a script, title suggestions, description, and tags for your video.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Script Preview */}
        {generatedContent && (
          <div className="glass-card p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Generated Script</h2>
            <div className="bg-muted/30 border border-border rounded-md p-4 whitespace-pre-line">
              {generatedContent.script}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(TopicSchedulerPage);
