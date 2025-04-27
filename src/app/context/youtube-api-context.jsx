'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

// Create YouTube API context
const YouTubeApiContext = createContext(null);

export function YouTubeApiProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    youtube: '',
    openai: '',
    elevenlabs: ''
  });
  
  // Load API keys when user changes
  useEffect(() => {
    if (user) {
      loadApiKeys();
    } else {
      setApiKeys({
        youtube: '',
        openai: '',
        elevenlabs: ''
      });
    }
  }, [user]);
  
  // Save API keys
  const saveApiKeys = async (keys) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save',
          userId: user.id,
          youtubeApiKey: keys.youtube,
          openaiApiKey: keys.openai,
          elevenlabsApiKey: keys.elevenlabs
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save API keys');
      }
      
      // Update local state
      setApiKeys(keys);
      
      return { success: true };
    } catch (error) {
      console.error('Error saving API keys:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Load API keys
  const loadApiKeys = async () => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/api-keys?userId=${user.id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load API keys');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load API keys');
      }
      
      setApiKeys({
        youtube: data.youtubeApiKey || '',
        openai: data.openaiApiKey || '',
        elevenlabs: data.elevenlabsApiKey || ''
      });
      
      return { success: true, keys: data };
    } catch (error) {
      console.error('Error loading API keys:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Test YouTube API key
  const testYouTubeApiKey = async (key) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'test-youtube', 
          apiKey: key || apiKeys.youtube,
          userId: user?.id
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'YouTube API key test failed');
      }
      
      return { success: true };
    } catch (error) {
      console.error('YouTube API key test error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Test OpenAI API key
  const testOpenAIApiKey = async (key) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'test-openai', 
          apiKey: key || apiKeys.openai,
          userId: user?.id
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'OpenAI API key test failed');
      }
      
      return { success: true };
    } catch (error) {
      console.error('OpenAI API key test error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Test ElevenLabs API key
  const testElevenLabsApiKey = async (key) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'test-elevenlabs', 
          apiKey: key || apiKeys.elevenlabs,
          userId: user?.id
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'ElevenLabs API key test failed');
      }
      
      return { success: true };
    } catch (error) {
      console.error('ElevenLabs API key test error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // YouTube API context value
  const value = {
    apiKeys,
    loading,
    saveApiKeys,
    loadApiKeys,
    testYouTubeApiKey,
    testOpenAIApiKey,
    testElevenLabsApiKey
  };
  
  return <YouTubeApiContext.Provider value={value}>{children}</YouTubeApiContext.Provider>;
}

// YouTube API hook
export function useYouTubeApi() {
  const context = useContext(YouTubeApiContext);
  if (!context) {
    console.warn('useYouTubeApi must be used within a YouTubeApiProvider, returning default context');
    return {
      apiKeys: {
        youtube: '',
        openai: '',
        elevenlabs: ''
      },
      loading: false,
      saveApiKeys: async () => ({ success: false, error: 'YouTubeApiProvider not found' }),
      loadApiKeys: async () => ({ success: false, error: 'YouTubeApiProvider not found' }),
      testYouTubeApiKey: async () => ({ success: false, error: 'YouTubeApiProvider not found' }),
      testOpenAIApiKey: async () => ({ success: false, error: 'YouTubeApiProvider not found' }),
      testElevenLabsApiKey: async () => ({ success: false, error: 'YouTubeApiProvider not found' })
    };
  }
  return context;
}
