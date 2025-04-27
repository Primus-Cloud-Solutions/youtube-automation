import { NextResponse } from 'next/server';
import * as youtubeApi from './youtube-api-server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const apiKey = searchParams.get('apiKey');
  
  if (!action) {
    return NextResponse.json({ success: false, error: 'Action is required' }, { status: 400 });
  }
  
  try {
    switch (action) {
      case 'getUserChannels':
        const channels = await youtubeApi.getUserChannels(apiKey);
        return NextResponse.json(channels);
        
      case 'getTrendingVideos':
        const regionCode = searchParams.get('regionCode') || 'US';
        const categoryId = searchParams.get('categoryId') || '';
        const maxResults = parseInt(searchParams.get('maxResults') || '10');
        const trending = await youtubeApi.getTrendingVideos(apiKey, regionCode, categoryId, maxResults);
        return NextResponse.json(trending);
        
      case 'searchVideos':
        const query = searchParams.get('query');
        const searchMaxResults = parseInt(searchParams.get('maxResults') || '10');
        if (!query) {
          return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
        }
        const search = await youtubeApi.searchVideos(apiKey, query, searchMaxResults);
        return NextResponse.json(search);
        
      case 'getVideoAnalytics':
        const videoId = searchParams.get('videoId');
        if (!videoId) {
          return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 });
        }
        const analytics = await youtubeApi.getVideoAnalytics(apiKey, videoId);
        return NextResponse.json(analytics);
        
      case 'validateApiKey':
        const validation = await youtubeApi.validateApiKey(apiKey);
        return NextResponse.json(validation);
        
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ success: false, error: error.message || 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, apiKey } = body;
    
    if (!action) {
      return NextResponse.json({ success: false, error: 'Action is required' }, { status: 400 });
    }
    
    switch (action) {
      case 'createYouTubeChannel':
        const { oauthToken, channelData } = body;
        if (!oauthToken || !channelData) {
          return NextResponse.json({ success: false, error: 'OAuth token and channel data are required' }, { status: 400 });
        }
        const channel = await youtubeApi.createYouTubeChannel(oauthToken, channelData);
        return NextResponse.json(channel);
        
      case 'updateChannelBranding':
        const { channelId, brandingData } = body;
        if (!apiKey || !channelId || !brandingData) {
          return NextResponse.json({ success: false, error: 'API key, channel ID, and branding data are required' }, { status: 400 });
        }
        const branding = await youtubeApi.updateChannelBranding(apiKey, channelId, brandingData);
        return NextResponse.json(branding);
        
      case 'uploadVideo':
        const { videoData } = body;
        if (!apiKey || !videoData) {
          return NextResponse.json({ success: false, error: 'API key and video data are required' }, { status: 400 });
        }
        const upload = await youtubeApi.uploadVideo(apiKey, videoData);
        return NextResponse.json(upload);
        
      case 'validateApiKey':
        if (!apiKey) {
          return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 });
        }
        const validation = await youtubeApi.validateApiKey(apiKey);
        return NextResponse.json(validation);
        
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ success: false, error: error.message || 'An error occurred' }, { status: 500 });
  }
}
