'use client';

import { useState, useEffect } from 'react';

/**
 * Client-side YouTube API wrapper
 * This module provides client-side functions for interacting with the YouTube API
 * via the server-side API routes
 */

// Get user's YouTube channels
export async function getUserChannels(apiKey) {
  try {
    const response = await fetch(`/api/youtube?action=getUserChannels&apiKey=${encodeURIComponent(apiKey)}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting user channels:', error);
    return { success: false, error: error.message || 'Failed to get user channels' };
  }
}

// Create a new YouTube channel
export async function createYouTubeChannel(oauthToken, channelData) {
  try {
    const response = await fetch('/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createYouTubeChannel',
        oauthToken,
        channelData
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating YouTube channel:', error);
    return { success: false, error: error.message || 'Failed to create YouTube channel' };
  }
}

// Update channel branding
export async function updateChannelBranding(apiKey, channelId, brandingData) {
  try {
    const response = await fetch('/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateChannelBranding',
        apiKey,
        channelId,
        brandingData
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating channel branding:', error);
    return { success: false, error: error.message || 'Failed to update channel branding' };
  }
}

// Get trending videos
export async function getTrendingVideos(apiKey, regionCode = 'US', categoryId = '', maxResults = 10) {
  try {
    const url = `/api/youtube?action=getTrendingVideos&apiKey=${encodeURIComponent(apiKey)}&regionCode=${encodeURIComponent(regionCode)}&maxResults=${maxResults}${categoryId ? `&categoryId=${encodeURIComponent(categoryId)}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error getting trending videos:', error);
    return { success: false, error: error.message || 'Failed to get trending videos' };
  }
}

// Search for videos
export async function searchVideos(apiKey, query, maxResults = 10) {
  try {
    const url = `/api/youtube?action=searchVideos&apiKey=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error searching videos:', error);
    return { success: false, error: error.message || 'Failed to search videos' };
  }
}

// Upload a video to YouTube
export async function uploadVideo(apiKey, videoData) {
  try {
    const response = await fetch('/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'uploadVideo',
        apiKey,
        videoData
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error uploading video:', error);
    return { success: false, error: error.message || 'Failed to upload video' };
  }
}

// Get video analytics
export async function getVideoAnalytics(apiKey, videoId) {
  try {
    const url = `/api/youtube?action=getVideoAnalytics&apiKey=${encodeURIComponent(apiKey)}&videoId=${encodeURIComponent(videoId)}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error getting video analytics:', error);
    return { success: false, error: error.message || 'Failed to get video analytics' };
  }
}

// Validate YouTube API key
export async function validateApiKey(apiKey) {
  try {
    const response = await fetch('/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'validateApiKey',
        apiKey
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error validating YouTube API key:', error);
    return { success: false, error: error.message || 'Invalid YouTube API key' };
  }
}

// Hook for YouTube API key validation
export function useYouTubeApiKeyValidation(apiKey) {
  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const validate = async () => {
      if (!apiKey) {
        setIsValid(false);
        setError('');
        return;
      }

      setIsValidating(true);
      setError('');

      try {
        const result = await validateApiKey(apiKey);
        setIsValid(result.success);
        if (!result.success) {
          setError(result.error || 'Invalid API key');
        }
      } catch (err) {
        setIsValid(false);
        setError(err.message || 'Error validating API key');
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [apiKey]);

  return { isValid, isValidating, error };
}
