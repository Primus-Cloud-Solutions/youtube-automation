'use client'

import { createContext, useContext, useState } from 'react'
import { useAuth } from './auth-context'

// Create YouTube API context
const YouTubeApiContext = createContext(null)

export function YouTubeApiProvider({ children }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState({
    youtube: '',
    openai: '',
    elevenlabs: ''
  })
  
  // Save API keys
  const saveApiKeys = async (keys) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    try {
      setLoading(true)
      
      // Update API keys in user profile
      const response = await fetch('/api/save-api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeApiKey: keys.youtube,
          openaiApiKey: keys.openai,
          elevenlabsApiKey: keys.elevenlabs
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save API keys')
      }
      
      // Update local state
      setApiKeys(keys)
      
      return { success: true }
    } catch (error) {
      console.error('Error saving API keys:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Load API keys
  const loadApiKeys = async () => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    try {
      setLoading(true)
      
      const response = await fetch('/api/get-api-keys')
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to load API keys')
      }
      
      const data = await response.json()
      
      setApiKeys({
        youtube: data.youtubeApiKey || '',
        openai: data.openaiApiKey || '',
        elevenlabs: data.elevenlabsApiKey || ''
      })
      
      return { success: true, keys: data }
    } catch (error) {
      console.error('Error loading API keys:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Test YouTube API key
  const testYouTubeApiKey = async (key) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/test-youtube-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key || apiKeys.youtube }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'YouTube API key test failed')
      }
      
      return { success: true }
    } catch (error) {
      console.error('YouTube API key test error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Test OpenAI API key
  const testOpenAIApiKey = async (key) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/test-openai-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key || apiKeys.openai }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'OpenAI API key test failed')
      }
      
      return { success: true }
    } catch (error) {
      console.error('OpenAI API key test error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Test ElevenLabs API key
  const testElevenLabsApiKey = async (key) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/test-elevenlabs-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key || apiKeys.elevenlabs }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'ElevenLabs API key test failed')
      }
      
      return { success: true }
    } catch (error) {
      console.error('ElevenLabs API key test error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // YouTube API context value
  const value = {
    apiKeys,
    loading,
    saveApiKeys,
    loadApiKeys,
    testYouTubeApiKey,
    testOpenAIApiKey,
    testElevenLabsApiKey
  }
  
  return <YouTubeApiContext.Provider value={value}>{children}</YouTubeApiContext.Provider>
}

// YouTube API hook
export function useYouTubeApi() {
  const context = useContext(YouTubeApiContext)
  if (!context) {
    throw new Error('useYouTubeApi must be used within a YouTubeApiProvider')
  }
  return context
}
