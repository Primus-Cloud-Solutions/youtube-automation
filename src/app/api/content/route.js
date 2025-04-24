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
    const { action, topic, options, userId } = await request.json()
    
    if (!userId) {
      return Response.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }
    
    // Get user's API keys
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('openai_api_key, elevenlabs_api_key, youtube_api_key')
      .eq('user_id', userId)
      .single()
    
    if (userError) throw userError
    
    if (action === 'generate-script') {
      if (!userData.openai_api_key) {
        return Response.json({ success: false, error: 'OpenAI API key is required' }, { status: 400 })
      }
      
      // Generate script using OpenAI
      const result = await openaiApi.generateVideoScript(userData.openai_api_key, topic, options)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      // Save generated content to database
      const { error } = await supabase
        .from('generated_content')
        .insert({
          user_id: userId,
          topic,
          script: result.script,
          title_suggestions: result.titleSuggestions,
          description: result.description,
          tags: result.tags,
          created_at: new Date()
        })
      
      if (error) throw error
      
      return Response.json({ 
        success: true, 
        script: result.script,
        titleSuggestions: result.titleSuggestions,
        description: result.description,
        tags: result.tags
      })
    } 
    else if (action === 'generate-voice') {
      const { script, voiceId } = await request.json()
      
      if (!userData.elevenlabs_api_key) {
        return Response.json({ success: false, error: 'ElevenLabs API key is required' }, { status: 400 })
      }
      
      // Generate voice using ElevenLabs
      const result = await elevenlabsApi.convertScriptToSpeech(userData.elevenlabs_api_key, script, voiceId, options)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      // Save audio file reference to database
      // In a real implementation, you would upload the audio to storage
      const { error } = await supabase
        .from('generated_audio')
        .insert({
          user_id: userId,
          script_id: options.scriptId,
          voice_id: voiceId,
          created_at: new Date()
        })
      
      if (error) throw error
      
      return Response.json({ 
        success: true, 
        audioBuffer: result.audioBuffer,
        contentType: result.contentType
      })
    }
    else if (action === 'schedule-video') {
      const { title, description, tags, scheduledTime } = await request.json()
      
      // Save scheduled video to database
      const { data, error } = await supabase
        .from('scheduled_videos')
        .insert({
          user_id: userId,
          title,
          description,
          tags,
          scheduled_time: scheduledTime,
          status: 'scheduled',
          created_at: new Date()
        })
        .select()
      
      if (error) throw error
      
      return Response.json({ success: true, scheduledVideo: data[0] })
    }
    
    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Content Generation API error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
