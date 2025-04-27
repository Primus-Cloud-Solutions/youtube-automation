/**
 * YouTube Compliance Checker Module
 * 
 * This module provides functions for checking if edited videos comply with
 * YouTube's policies on reused content.
 * 
 * YouTube's reused content policies require:
 * 1. Adding significant original content or commentary
 * 2. Transformative changes to the original
 * 3. Proper attribution to original sources
 * 4. Not reusing content that's already been extensively reused
 */

/**
 * Check if content complies with YouTube's policies on reused content
 * @param {Object} videoData - Video data
 * @returns {Promise<{compliant: boolean, issues: Array, recommendations: Array}>} - Compliance result
 */
export async function checkYouTubeCompliance(videoData) {
  try {
    const issues = [];
    const recommendations = [];
    let compliant = true;
    
    // Check for potential copyright issues
    if (videoData.originalTitle && videoData.title === videoData.originalTitle) {
      issues.push('Using the exact same title as the original video may violate YouTube policies');
      recommendations.push('Create a unique title that reflects your added value');
      compliant = false;
    }
    
    // Check for transformative content
    if (!videoData.hasWatermark && !videoData.hasIntroOutro && !videoData.hasTextOverlay) {
      issues.push('Content does not appear to be sufficiently transformative');
      recommendations.push('Add commentary, educational context, or creative elements');
      recommendations.push('Include a branded intro and outro');
      recommendations.push('Add your watermark to establish your brand');
      compliant = false;
    }
    
    // Check for proper attribution
    if (!videoData.description.includes('Original video:') && !videoData.description.includes('Source:')) {
      issues.push('Missing proper attribution to the original content');
      recommendations.push('Include attribution to the original creator in the description');
      compliant = false;
    }
    
    // Check for educational or commentary context
    if (!videoData.description.includes('analysis') && 
        !videoData.description.includes('review') && 
        !videoData.description.includes('commentary') && 
        !videoData.description.includes('educational')) {
      issues.push('Content may not have clear educational or commentary purpose');
      recommendations.push('Add educational context or commentary to make the content transformative');
      compliant = false;
    }
    
    // Check for content length
    if (videoData.originalDuration && videoData.duration && 
        videoData.duration > videoData.originalDuration * 0.9) {
      issues.push('Using too much of the original content without significant transformation');
      recommendations.push('Trim the video to include only the most relevant parts');
      recommendations.push('Add more original content to balance the reused content');
      compliant = false;
    }
    
    return { compliant, issues, recommendations };
  } catch (error) {
    console.error('Error checking YouTube compliance:', error);
    throw error;
  }
}

/**
 * Generate compliant video description
 * @param {Object} videoData - Original video data
 * @param {string} brandName - Brand name
 * @param {string} additionalContext - Additional context or commentary
 * @returns {string} - Compliant video description
 */
export function generateCompliantDescription(videoData, brandName, additionalContext = '') {
  const description = `
${brandName} Analysis: "${videoData.snippet.title}"

${additionalContext || 'This video provides analysis and commentary on the trending topic.'}

This content explores the viral trend: ${videoData.trendTopic || 'trending content'}

Original video by ${videoData.snippet.channelTitle}
Source: https://youtube.com/watch?v=${videoData.id}

#analysis #commentary #${videoData.trendTopic?.replace(/\s+/g, '') || 'trending'}

© ${new Date().getFullYear()} ${brandName} - Educational commentary and analysis
`.trim();

  return description;
}

/**
 * Generate compliant video title
 * @param {Object} videoData - Original video data
 * @param {string} brandName - Brand name
 * @returns {string} - Compliant video title
 */
export function generateCompliantTitle(videoData, brandName) {
  // Create a title that's different from the original but references it
  const originalTitle = videoData.snippet.title;
  
  // Remove any special characters that might be in the title
  const cleanTitle = originalTitle.replace(/[^\w\s]/gi, '');
  
  // Limit to first 5-7 words to keep it concise
  const words = cleanTitle.split(' ');
  const shortTitle = words.slice(0, Math.min(7, words.length)).join(' ');
  
  // Add brand name and context
  return `${brandName} Analysis: ${shortTitle}`;
}

/**
 * Check if video editing is sufficiently transformative
 * @param {Object} editingOptions - Editing options applied to the video
 * @returns {{transformative: boolean, score: number, recommendations: Array}} - Transformation assessment
 */
export function assessTransformation(editingOptions) {
  let score = 0;
  const recommendations = [];
  
  // Check for watermark
  if (editingOptions.watermark) {
    score += 10;
  } else {
    recommendations.push('Add a watermark to establish your brand identity');
  }
  
  // Check for intro/outro
  if (editingOptions.hasIntroOutro) {
    score += 25;
  } else {
    recommendations.push('Add branded intro and outro segments');
  }
  
  // Check for text overlays
  if (editingOptions.textOverlays && editingOptions.textOverlays.length > 0) {
    score += 15 * Math.min(editingOptions.textOverlays.length, 3);
  } else {
    recommendations.push('Add text overlays with commentary or educational content');
  }
  
  // Check for trimming
  if (editingOptions.trimming) {
    score += 20;
  } else {
    recommendations.push('Trim the video to focus on the most relevant parts');
  }
  
  // Check for visual effects
  if (editingOptions.visualEffects) {
    score += 15;
  } else {
    recommendations.push('Consider adding visual effects to transform the content');
  }
  
  // Determine if sufficiently transformative (score of 50 or higher)
  const transformative = score >= 50;
  
  return {
    transformative,
    score,
    recommendations: transformative ? [] : recommendations
  };
}

/**
 * Generate compliant tags for the video
 * @param {Object} videoData - Original video data
 * @param {string} brandName - Brand name
 * @returns {string} - Comma-separated tags
 */
export function generateCompliantTags(videoData, brandName) {
  const baseTags = [
    brandName,
    'analysis',
    'commentary',
    'educational',
    videoData.trendTopic || 'trending'
  ];
  
  // Add category-specific tags
  const categoryTags = {
    'technology': ['tech', 'technology news', 'tech analysis'],
    'gaming': ['gaming', 'video games', 'game review'],
    'finance': ['finance', 'money', 'financial education'],
    'health': ['health', 'wellness', 'health tips'],
    'entertainment': ['entertainment', 'media analysis', 'entertainment news'],
    'education': ['learning', 'educational content', 'knowledge'],
    'business': ['business', 'entrepreneurship', 'business strategy'],
    'travel': ['travel', 'destinations', 'travel guide'],
    'fashion': ['fashion', 'style', 'fashion trends'],
    'food': ['food', 'cooking', 'recipes']
  };
  
  // Get category-specific tags if available
  const category = videoData.snippet?.categoryId || '';
  const additionalTags = categoryTags[category] || [];
  
  // Combine all tags and return as comma-separated string
  return [...baseTags, ...additionalTags].join(', ');
}
