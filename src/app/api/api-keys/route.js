'use server'

import { createClient } from '@supabase/supabase-js'
import { youtubeApi } from '../youtube-api'
import { openaiApi } from '../openai-api'
import { elevenlabsApi } from '../elevenlabs-api'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request) {
  try {
    const { action, apiKey, userId } = await request.json()
    
    if (!userId) {
      return Response.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }
    
    if (action === 'save') {
      const { youtubeApiKey, openaiApiKey, elevenlabsApiKey } = await request.json()
      
      // Save API keys to user profile in database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          youtube_api_key: youtubeApiKey,
          openai_api_key: openaiApiKey,
          elevenlabs_api_key: elevenlabsApiKey,
          updated_at: new Date()
        })
        .eq('user_id', userId)
      
      if (error) throw error
      
      return Response.json({ success: true })
    } 
    else if (action === 'test-youtube') {
      // Test YouTube API key
      const result = await youtubeApi.testApiKey(apiKey)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      return Response.json({ success: true, data: result.data })
    }
    else if (action === 'test-openai') {
      // Test OpenAI API key
      const result = await openaiApi.testApiKey(apiKey)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      return Response.json({ success: true, data: result.data })
    }
    else if (action === 'test-elevenlabs') {
      // Test ElevenLabs API key
      const result = await elevenlabsApi.testApiKey(apiKey)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      return Response.json({ success: true, data: result.data })
    }
    
    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API Keys API error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return Response.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }
    
    // Get API keys from user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .select('youtube_api_key, openai_api_key, elevenlabs_api_key')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    
    return Response.json({ 
      success: true, 
      youtubeApiKey: data.youtube_api_key,
      openaiApiKey: data.openai_api_key,
      elevenlabsApiKey: data.elevenlabs_api_key
    })
  } catch (error) {
    console.error('API Keys API error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
