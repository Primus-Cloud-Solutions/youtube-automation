'use server';

import fetch from 'node-fetch';

/**
 * Trend Analyzer Module
 * 
 * This module provides functions for analyzing content trends and predicting viral potential.
 * It uses a combination of data sources to identify trending topics and calculate viral scores.
 */

// Content categories
const CATEGORIES = [
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

// Mock trending topics by category for fallback/development
const MOCK_TRENDS = {
  technology: [
    { title: 'The Future of AI in 2025', description: 'Exploring how artificial intelligence will transform industries in the coming year.', score: 92 },
    { title: 'Web3 Development Guide', description: 'A comprehensive guide to building decentralized applications.', score: 88 },
    { title: 'Quantum Computing Breakthroughs', description: 'Recent advances in quantum computing and what they mean for technology.', score: 85 },
    { title: '5G Revolution: Beyond Mobile', description: 'How 5G technology is transforming more than just smartphones.', score: 82 },
    { title: 'Cybersecurity Essentials for 2025', description: 'Protecting your digital assets in an increasingly vulnerable online world.', score: 79 }
  ],
  gaming: [
    { title: 'Next-Gen Console Comparison', description: 'A detailed analysis of the latest gaming consoles and their capabilities.', score: 94 },
    { title: 'Indie Games That Are Changing the Industry', description: 'How independent developers are innovating in the gaming space.', score: 89 },
    { title: 'The Rise of Cloud Gaming', description: 'Exploring the technology and platforms making game streaming possible.', score: 86 },
    { title: 'Esports Career Opportunities', description: 'Professional paths in the growing competitive gaming industry.', score: 83 },
    { title: 'Game Development with Unreal Engine 5', description: 'Creating stunning visuals with the latest game engine technology.', score: 80 }
  ],
  finance: [
    { title: 'Cryptocurrency Investment Strategies', description: 'Smart approaches to investing in digital currencies in 2025.', score: 91 },
    { title: 'Passive Income Ideas That Actually Work', description: 'Realistic ways to generate income streams with minimal ongoing effort.', score: 87 },
    { title: 'Retirement Planning for Millennials', description: 'How younger generations can prepare for financial security later in life.', score: 84 },
    { title: 'Stock Market Trends to Watch', description: 'Emerging patterns and opportunities in equity markets.', score: 81 },
    { title: 'Personal Finance Apps Review', description: 'The best digital tools for managing your money and investments.', score: 78 }
  ],
  health: [
    { title: 'Nutrition Myths Debunked', description: 'Scientific facts behind common misconceptions about diet and nutrition.', score: 93 },
    { title: 'Mental Health Practices for Daily Life', description: 'Simple techniques to maintain psychological wellbeing.', score: 90 },
    { title: 'The Science of Sleep Optimization', description: 'Research-backed methods to improve sleep quality and duration.', score: 86 },
    { title: 'Home Workout Revolution', description: 'Effective exercise routines that require minimal equipment.', score: 82 },
    { title: 'Longevity Research Breakthroughs', description: 'Recent scientific advances in extending healthy human lifespan.', score: 79 }
  ],
  entertainment: [
    { title: 'Streaming Wars: Platform Comparison', description: 'Analyzing the major content streaming services and their offerings.', score: 95 },
    { title: 'Behind the Scenes: Blockbuster Production', description: 'The making of recent hit movies and shows.', score: 91 },
    { title: 'Rising Stars to Watch', description: 'Emerging talent in film, music, and television.', score: 87 },
    { title: 'Evolution of Content Creation', description: 'How digital media has transformed entertainment production and consumption.', score: 84 },
    { title: 'Music Industry Transformation', description: 'How streaming and social media have changed how music is made and distributed.', score: 81 }
  ],
  education: [
    { title: 'The Future of Online Learning', description: 'How digital platforms are transforming education worldwide.', score: 90 },
    { title: 'Learning Techniques Based on Neuroscience', description: 'Scientific approaches to improve knowledge retention and skill acquisition.', score: 87 },
    { title: 'Alternative Education Paths', description: 'Non-traditional routes to career success beyond traditional degrees.', score: 84 },
    { title: 'Teaching in the Digital Age', description: 'How educators are adapting to technology-driven classrooms.', score: 81 },
    { title: 'Global Education Innovations', description: 'Revolutionary approaches to learning from around the world.', score: 78 }
  ],
  business: [
    { title: 'Remote Work Strategies for Teams', description: 'Building effective collaboration in distributed workforces.', score: 92 },
    { title: 'Small Business Digital Transformation', description: 'How local businesses can thrive in the online marketplace.', score: 89 },
    { title: 'Sustainable Business Practices', description: 'Eco-friendly approaches that improve both planet and profit.', score: 86 },
    { title: 'AI for Business Automation', description: 'Implementing artificial intelligence to streamline operations.', score: 83 },
    { title: 'Customer Experience Innovations', description: 'New approaches to delighting customers in the digital era.', score: 80 }
  ],
  travel: [
    { title: 'Hidden Gems: Underrated Destinations', description: 'Spectacular locations that are not overrun with tourists.', score: 93 },
    { title: 'Sustainable Travel Guide', description: 'How to explore the world while minimizing environmental impact.', score: 90 },
    { title: 'Digital Nomad Lifestyle', description: 'Working remotely while traveling the world.', score: 87 },
    { title: 'Budget Travel Hacks', description: 'See more of the world without breaking the bank.', score: 84 },
    { title: 'Cultural Immersion Experiences', description: 'Going beyond tourism to truly understand local cultures.', score: 81 }
  ],
  fashion: [
    { title: 'Sustainable Fashion Brands', description: 'Eco-friendly clothing companies changing the industry.', score: 91 },
    { title: 'Capsule Wardrobe Guide', description: 'Building a versatile collection with fewer, better pieces.', score: 88 },
    { title: 'Fashion Technology Innovations', description: 'How tech is transforming clothing design and retail.', score: 85 },
    { title: 'Vintage Style Revival', description: 'Classic looks making a comeback in modern wardrobes.', score: 82 },
    { title: 'Inclusive Beauty Trends', description: 'The movement toward representation in the beauty industry.', score: 79 }
  ],
  food: [
    { title: 'Plant-Based Cooking Revolution', description: 'Delicious meat-free recipes even carnivores will love.', score: 94 },
    { title: 'Global Cuisine Fusion', description: 'Innovative combinations of international cooking styles.', score: 91 },
    { title: 'Fermentation Techniques for Home Cooks', description: 'Creating probiotic-rich foods in your own kitchen.', score: 88 },
    { title: 'Restaurant-Quality Meals at Home', description: 'Chef techniques adapted for home cooking.', score: 85 },
    { title: 'Food Sustainability Practices', description: 'Reducing waste and environmental impact in your kitchen.', score: 82 }
  ]
};

/**
 * Fetch trending topics from YouTube API
 * @param {string} category - Content category
 * @param {string} apiKey - YouTube API key
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} - Array of trending videos
 */
async function fetchYouTubeTrends(category, apiKey, maxResults = 10) {
  try {
    // Map our category to YouTube category ID
    const categoryMap = {
      'technology': '28',
      'gaming': '20',
      'finance': '27', // Using Education as closest match
      'health': '26', // Using Howto & Style as closest match
      'entertainment': '24',
      'education': '27',
      'business': '28', // Using Science & Technology as closest match
      'travel': '19',
      'fashion': '26', // Using Howto & Style as closest match
      'food': '26' // Using Howto & Style as closest match
    };
    
    const videoCategoryId = categoryMap[category.toLowerCase()] || '0';
    
    // Build the API URL
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=${videoCategoryId}&maxResults=${maxResults}&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the response into our trend format
    return data.items.map(item => {
      // Calculate a score based on views, likes, and comments
      const views = parseInt(item.statistics.viewCount) || 0;
      const likes = parseInt(item.statistics.likeCount) || 0;
      const comments = parseInt(item.statistics.commentCount) || 0;
      
      // Simple algorithm to calculate viral potential score (0-100)
      // This could be refined with more sophisticated algorithms
      const viewScore = Math.min(views / 10000, 50); // Max 50 points for views
      const engagementScore = Math.min((likes + comments) / 1000, 30); // Max 30 points for engagement
      const recencyScore = 20; // Assuming these are recent, give 20 points
      
      const score = Math.round(viewScore + engagementScore + recencyScore);
      
      return {
        title: item.snippet.title,
        description: item.snippet.description.substring(0, 200) + (item.snippet.description.length > 200 ? '...' : ''),
        score: score,
        videoId: item.id,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        statistics: {
          viewCount: item.statistics.viewCount,
          likeCount: item.statistics.likeCount,
          commentCount: item.statistics.commentCount
        }
      };
    });
  } catch (error) {
    console.error('Error fetching YouTube trends:', error);
    throw error;
  }
}

/**
 * Fetch trending topics from Google Trends API
 * @param {string} category - Content category
 * @returns {Promise<Array>} - Array of trending topics
 */
async function fetchGoogleTrends(category) {
  try {
    // In a real implementation, you would use a Google Trends API
    // For now, we'll simulate this with a mock response
    
    // This would be replaced with actual API call
    const mockTrends = [
      { title: `${category} Trend 1`, score: Math.floor(Math.random() * 20) + 80 },
      { title: `${category} Trend 2`, score: Math.floor(Math.random() * 20) + 70 },
      { title: `${category} Trend 3`, score: Math.floor(Math.random() * 20) + 60 },
      { title: `${category} Trend 4`, score: Math.floor(Math.random() * 20) + 50 },
      { title: `${category} Trend 5`, score: Math.floor(Math.random() * 20) + 40 }
    ];
    
    return mockTrends;
  } catch (error) {
    console.error('Error fetching Google trends:', error);
    throw error;
  }
}

/**
 * Analyze trends in a specific content category
 * @param {string} category - Content category to analyze
 * @param {number} count - Number of trends to return (default: 5)
 * @param {string} apiKey - YouTube API key (optional)
 * @returns {Promise<{success: boolean, trends: Array|null, error: string|null}>} - Trend analysis result
 */
export async function analyzeTrends(category, count = 5, apiKey = null) {
  try {
    // If no API key is provided or we're in a build/SSG environment, use mock data
    if (!apiKey || process.env.NODE_ENV === 'production') {
      console.warn('Using mock trend data (no API key or production environment)');
      
      // Return mock data for the specified category
      const mockData = MOCK_TRENDS[category.toLowerCase()] || MOCK_TRENDS.technology;
      return { 
        success: true, 
        trends: mockData.slice(0, count)
      };
    }
    
    // Fetch trends from YouTube API
    let youtubeTrends = [];
    try {
      youtubeTrends = await fetchYouTubeTrends(category, apiKey, count * 2);
    } catch (error) {
      console.warn('Error fetching YouTube trends, falling back to mock data:', error);
      youtubeTrends = MOCK_TRENDS[category.toLowerCase()] || MOCK_TRENDS.technology;
    }
    
    // Fetch trends from Google Trends API
    let googleTrends = [];
    try {
      googleTrends = await fetchGoogleTrends(category);
    } catch (error) {
      console.warn('Error fetching Google trends, skipping:', error);
    }
    
    // Combine and deduplicate trends
    const allTrends = [...youtubeTrends];
    
    // Add Google trends that don't overlap with YouTube trends
    googleTrends.forEach(gTrend => {
      if (!allTrends.some(yTrend => yTrend.title.toLowerCase().includes(gTrend.title.toLowerCase()))) {
        allTrends.push({
          title: gTrend.title,
          description: `Trending topic in ${category}`,
          score: gTrend.score
        });
      }
    });
    
    // Sort by score (descending) and take the requested number
    const sortedTrends = allTrends.sort((a, b) => b.score - a.score).slice(0, count);
    
    return { 
      success: true, 
      trends: sortedTrends
    };
  } catch (error) {
    console.error('Error analyzing trends:', error);
    return { success: false, trends: null, error: error.message || 'Failed to analyze trends' };
  }
}

/**
 * Predict the viral potential of a specific topic
 * @param {string} topic - Content topic to analyze
 * @param {string} category - Content category
 * @param {Array} keywords - Additional keywords for analysis
 * @returns {Promise<{success: boolean, score: number|null, insights: Array|null, error: string|null}>} - Viral potential result
 */
export async function predictViralPotential(topic, category, keywords = []) {
  try {
    // In a real implementation, you would:
    // 1. Analyze the topic against current trends
    // 2. Check search volume and growth
    // 3. Evaluate social media engagement for similar content
    // 4. Apply ML models to predict performance
    
    // For now, we'll generate a score based on the topic and category
    let baseScore = 70; // Start with a base score
    
    // Adjust score based on category popularity
    const categoryBonus = {
      technology: 5,
      gaming: 8,
      finance: 3,
      health: 4,
      entertainment: 10,
      education: 2,
      business: 4,
      travel: 6,
      fashion: 5,
      food: 7
    };
    
    baseScore += categoryBonus[category.toLowerCase()] || 0;
    
    // Adjust score based on topic length (shorter titles tend to perform better)
    const words = topic.split(' ').length;
    if (words <= 5) baseScore += 5;
    else if (words >= 10) baseScore -= 5;
    
    // Adjust score based on keywords
    const trendyKeywords = ['AI', 'guide', 'how to', 'best', 'top', 'review', '2025', 'future', 'secrets', 'revealed'];
    const keywordMatches = trendyKeywords.filter(kw => 
      topic.toLowerCase().includes(kw.toLowerCase()) || 
      keywords.some(k => k.toLowerCase().includes(kw.toLowerCase()))
    );
    
    baseScore += keywordMatches.length * 2;
    
    // Cap the score at 100
    const finalScore = Math.min(Math.round(baseScore), 100);
    
    // Generate insights
    const insights = [
      {
        factor: 'Category Popularity',
        impact: categoryBonus[category.toLowerCase()] || 0,
        description: `The ${category} category has ${categoryBonus[category.toLowerCase()] > 5 ? 'high' : 'moderate'} viral potential.`
      },
      {
        factor: 'Title Length',
        impact: words <= 5 ? 5 : (words >= 10 ? -5 : 0),
        description: `Your title has ${words} words, which is ${words <= 5 ? 'optimal' : (words >= 10 ? 'too long' : 'good')}.`
      },
      {
        factor: 'Trending Keywords',
        impact: keywordMatches.length * 2,
        description: keywordMatches.length > 0 
          ? `Your topic contains ${keywordMatches.length} trending keywords: ${keywordMatches.join(', ')}.`
          : 'Your topic does not contain any trending keywords.'
      }
    ];
    
    return {
      success: true,
      score: finalScore,
      insights
    };
  } catch (error) {
    console.error('Error predicting viral potential:', error);
    return { success: false, score: null, insights: null, error: error.message || 'Failed to predict viral potential' };
  }
}

/**
 * Get available content categories
 * @returns {Promise<{success: boolean, categories: Array|null, error: string|null}>} - Categories result
 */
export async function getCategories() {
  try {
    return {
      success: true,
      categories: CATEGORIES
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    return { success: false, categories: null, error: error.message || 'Failed to get categories' };
  }
}
