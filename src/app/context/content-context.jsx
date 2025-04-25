'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, AuthProvider } from './auth-context';

// Create Content Generation context
const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [scheduledVideos, setScheduledVideos] = useState([]);
  
  // Load scheduled videos when user changes
  useEffect(() => {
    if (user) {
      loadScheduledVideos();
    } else {
      setScheduledVideos([]);
    }
  }, [user]);
  
  // Generate video script
  const generateScript = async (topic, options = {}) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-script',
          userId: user.id,
          topic,
          options
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate script');
      }
      
      const content = {
        script: data.script,
        titleSuggestions: data.titleSuggestions,
        description: data.description,
        tags: data.tags
      };
      
      setGeneratedContent(content);
      
      return { success: true, content };
    } catch (error) {
      console.error('Error generating script:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Generate voice from script
  const generateVoice = async (script, voiceId, options = {}) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-voice',
          userId: user.id,
          script,
          voiceId,
          options
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate voice');
      }
      
      return { 
        success: true, 
        audioBuffer: data.audioBuffer,
        contentType: data.contentType
      };
    } catch (error) {
      console.error('Error generating voice:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Schedule video
  const scheduleVideo = async (videoData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'schedule-video',
          userId: user.id,
          title: videoData.title,
          description: videoData.description,
          tags: videoData.tags,
          scheduledTime: videoData.scheduledTime
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to schedule video');
      }
      
      // Update scheduled videos list
      setScheduledVideos([...scheduledVideos, data.scheduledVideo]);
      
      return { success: true, scheduledVideo: data.scheduledVideo };
    } catch (error) {
      console.error('Error scheduling video:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Load scheduled videos
  const loadScheduledVideos = async () => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/analytics?userId=${user.id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load scheduled videos');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load scheduled videos');
      }
      
      setScheduledVideos(data.videos || []);
      
      return { success: true, videos: data.videos };
    } catch (error) {
      console.error('Error loading scheduled videos:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Content context value
  const value = {
    generatedContent,
    scheduledVideos,
    loading,
    generateScript,
    generateVoice,
    scheduleVideo,
    loadScheduledVideos
  };
  
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// Safe wrapper to ensure ContentProvider is used within AuthProvider
export function SafeContentProvider({ children }) {
  return (
    <AuthProvider>
      <ContentProvider>{children}</ContentProvider>
    </AuthProvider>
  );
}

// Content hook
export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    console.warn('useContent must be used within a ContentProvider, returning default context');
    return {
      generatedContent: null,
      scheduledVideos: [],
      loading: false,
      generateScript: async () => ({ success: false, error: 'ContentProvider not found' }),
      generateVoice: async () => ({ success: false, error: 'ContentProvider not found' }),
      scheduleVideo: async () => ({ success: false, error: 'ContentProvider not found' }),
      loadScheduledVideos: async () => ({ success: false, error: 'ContentProvider not found' })
    };
  }
  return context;
}
