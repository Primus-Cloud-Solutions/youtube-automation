import { processViralVideo } from './processor';
import { searchViralVideos, checkVideoSuitability } from './video-search';

// Helper functions for API responses
const createApiResponse = (data) => {
  return Response.json({ success: true, ...data });
};

const createApiError = (message, status = 400) => {
  return Response.json({ success: false, error: message }, { status });
};

// Error handling wrapper
const withErrorHandling = (handler) => {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('Viral video API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};

// Check if user has enterprise subscription
async function checkEnterpriseAccess(userId) {
  try {
    // In a real implementation, you would check the user's subscription in the database
    // For now, we'll simulate this with a mock response
    
    // This would be replaced with actual database query
    const mockSubscription = {
      planName: 'Enterprise',
      planId: 'enterprise',
      limits: {
        videosPerMonth: 100,
        storageGB: 500,
        schedulingFrequency: 'hourly'
      },
      features: {
        scheduling: true,
        analytics: true,
        viralVideoRebranding: true
      }
    };
    
    return { 
      hasAccess: mockSubscription.features.viralVideoRebranding, 
      subscription: mockSubscription 
    };
  } catch (error) {
    console.error('Error checking enterprise access:', error);
    throw error;
  }
}

// API route handler
export const POST = withErrorHandling(async (request) => {
  const { action, userId, accessToken, category, options } = await request.json();
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  if (!userId) {
    return createApiError('User ID is required', 400);
  }
  
  // Check enterprise access
  const accessResult = await checkEnterpriseAccess(userId);
  
  if (!accessResult.hasAccess) {
    return createApiError('This feature requires an Enterprise subscription', 403);
  }
  
  // Search for viral videos
  if (action === 'search-viral-videos') {
    if (!category) {
      return createApiError('Category is required', 400);
    }
    
    try {
      const videos = await searchViralVideos(category, options?.minViews, options?.maxResults);
      return createApiResponse({ videos });
    } catch (error) {
      return createApiError(`Error searching viral videos: ${error.message}`, 500);
    }
  }
  
  // Check video suitability
  if (action === 'check-suitability') {
    if (!options?.video) {
      return createApiError('Video data is required', 400);
    }
    
    try {
      const result = await checkVideoSuitability(options.video);
      return createApiResponse(result);
    } catch (error) {
      return createApiError(`Error checking video suitability: ${error.message}`, 500);
    }
  }
  
  // Process viral video
  if (action === 'process-viral-video') {
    if (!category) {
      return createApiError('Category is required', 400);
    }
    
    if (!accessToken) {
      return createApiError('YouTube access token is required', 400);
    }
    
    if (!options?.branding) {
      return createApiError('Branding options are required', 400);
    }
    
    try {
      const processingOptions = {
        category,
        userId,
        accessToken,
        branding: options.branding,
        textOverlays: options.textOverlays,
        metadata: options.metadata,
        trimStart: options.trimStart,
        trimDuration: options.trimDuration,
        thumbnailTime: options.thumbnailTime
      };
      
      const result = await processViralVideo(processingOptions);
      
      if (!result.success) {
        return createApiError(result.error, 400, {
          complianceIssues: result.complianceIssues,
          recommendations: result.recommendations,
          suitabilityIssues: result.suitabilityIssues
        });
      }
      
      return createApiResponse({
        videoId: result.videoId,
        url: result.url
      });
    } catch (error) {
      return createApiError(`Error processing viral video: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});

export const GET = withErrorHandling(async (request) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');
  const category = searchParams.get('category');
  
  if (!action) {
    return createApiError('Action is required', 400);
  }
  
  if (!userId) {
    return createApiError('User ID is required', 400);
  }
  
  // Check enterprise access
  const accessResult = await checkEnterpriseAccess(userId);
  
  if (!accessResult.hasAccess) {
    return createApiError('This feature requires an Enterprise subscription', 403);
  }
  
  // Get feature status
  if (action === 'get-feature-status') {
    return createApiResponse({
      enabled: true,
      subscription: accessResult.subscription
    });
  }
  
  // Get trending categories
  if (action === 'get-trending-categories') {
    const trendingCategories = [
      { id: 'technology', name: 'Technology', description: 'Tech news, gadgets, software, and digital transformation' },
      { id: 'gaming', name: 'Gaming', description: 'Video games, esports, gaming hardware, and industry trends' },
      { id: 'finance', name: 'Finance', description: 'Personal finance, investing, cryptocurrency, and economic trends' },
      { id: 'health', name: 'Health & Wellness', description: 'Fitness, nutrition, mental health, and medical advances' },
      { id: 'entertainment', name: 'Entertainment', description: 'Movies, TV shows, music, celebrities, and streaming content' },
      { id: 'education', name: 'Education', description: 'Learning resources, academic topics, and educational trends' },
      { id: 'business', name: 'Business', description: 'Entrepreneurship, marketing, management, and business strategies' },
      { id: 'travel', name: 'Travel', description: 'Destinations, travel tips, adventures, and cultural experiences' },
      { id: 'fashion', name: 'Fashion & Beauty', description: 'Style trends, beauty products, fashion industry news' },
      { id: 'food', name: 'Food & Cooking', description: 'Recipes, cooking techniques, food trends, and culinary experiences' }
    ];
    
    return createApiResponse({ categories: trendingCategories });
  }
  
  // Search for viral videos (GET method)
  if (action === 'search-viral-videos') {
    if (!category) {
      return createApiError('Category is required', 400);
    }
    
    const minViews = parseInt(searchParams.get('minViews') || '100000');
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    
    try {
      const videos = await searchViralVideos(category, minViews, maxResults);
      return createApiResponse({ videos });
    } catch (error) {
      return createApiError(`Error searching viral videos: ${error.message}`, 500);
    }
  }
  
  return createApiError('Invalid action', 400);
});
