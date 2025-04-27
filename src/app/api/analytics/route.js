import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request) {
  try {
    const { action, userId, videoId, data } = await request.json()
    
    if (!userId) {
      return Response.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }
    
    if (action === 'get-analytics') {
      // Get user's YouTube API key
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('youtube_api_key')
        .eq('user_id', userId)
        .single()
      
      if (userError) throw userError
      
      if (!userData.youtube_api_key) {
        return Response.json({ success: false, error: 'YouTube API key is required' }, { status: 400 })
      }
      
      // Get analytics from YouTube API
      const { youtubeApi } = await import('../youtube-api')
      const result = await youtubeApi.getVideoStats(userData.youtube_api_key, videoId)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      return Response.json({ success: true, stats: result.stats })
    } 
    else if (action === 'get-channel-videos') {
      // Get user's YouTube API key
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('youtube_api_key')
        .eq('user_id', userId)
        .single()
      
      if (userError) throw userError
      
      if (!userData.youtube_api_key) {
        return Response.json({ success: false, error: 'YouTube API key is required' }, { status: 400 })
      }
      
      const { channelId, maxResults } = data
      
      // Get channel videos from YouTube API
      const { youtubeApi } = await import('../youtube-api')
      const result = await youtubeApi.getChannelVideos(userData.youtube_api_key, channelId, maxResults)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      return Response.json({ success: true, videos: result.videos })
    }
    else if (action === 'get-trending-topics') {
      // Get user's YouTube API key
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('youtube_api_key')
        .eq('user_id', userId)
        .single()
      
      if (userError) throw userError
      
      if (!userData.youtube_api_key) {
        return Response.json({ success: false, error: 'YouTube API key is required' }, { status: 400 })
      }
      
      const { category } = data
      
      // Get trending topics from YouTube API
      const { youtubeApi } = await import('../youtube-api')
      const result = await youtubeApi.getTrendingTopics(userData.youtube_api_key, category)
      
      if (!result.success) {
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
      
      return Response.json({ success: true, topics: result.topics })
    }
    
    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Analytics API error:', error)
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
    
    // Get user's scheduled videos
    const { data, error } = await supabase
      .from('scheduled_videos')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_time', { ascending: true })
    
    if (error) throw error
    
    return Response.json({ success: true, videos: data })
  } catch (error) {
    console.error('Analytics API error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
