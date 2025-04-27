/**
 * Monetization Analyzer
 * 
 * This module analyzes content topics and provides insights on monetization potential
 * based on various factors including:
 * - Advertiser friendliness
 * - Audience demographics
 * - Sponsorship potential
 * - Affiliate marketing opportunities
 * - Merchandise potential
 */

/**
 * Analyzes the monetization potential of a topic
 * @param {Object} options - Analysis options
 * @param {string} options.topic - The topic to analyze
 * @param {string} options.category - The content category
 * @param {string} options.region - Target region/country (optional)
 * @returns {Object} Monetization analysis results
 */
export async function analyzeMonetizationPotential({ topic, category, region = 'global' }) {
  try {
    // In a real implementation, this would use ML models or external APIs
    // For now, we'll use a rule-based approach
    
    // Calculate advertiser friendliness (0-100)
    const advertiserFriendliness = calculateAdvertiserFriendliness(topic, category);
    
    // Calculate audience demographics match (0-100)
    const audienceDemographics = calculateAudienceDemographics(topic, category, region);
    
    // Calculate sponsorship potential (0-100)
    const sponsorshipPotential = calculateSponsorshipPotential(topic, category);
    
    // Calculate affiliate marketing potential (0-100)
    const affiliateMarketingPotential = calculateAffiliateMarketingPotential(topic, category);
    
    // Calculate merchandise potential (0-100)
    const merchandisePotential = calculateMerchandisePotential(topic, category);
    
    // Calculate overall monetization score (0-100)
    const overallScore = calculateOverallScore({
      advertiserFriendliness,
      audienceDemographics,
      sponsorshipPotential,
      affiliateMarketingPotential,
      merchandisePotential
    });
    
    // Generate monetization recommendations
    const recommendations = generateRecommendations({
      topic,
      category,
      advertiserFriendliness,
      audienceDemographics,
      sponsorshipPotential,
      affiliateMarketingPotential,
      merchandisePotential
    });
    
    // Estimate potential revenue range
    const revenueEstimate = estimateRevenueRange({
      topic,
      category,
      region,
      overallScore
    });
    
    return {
      success: true,
      analysis: {
        overallScore,
        metrics: {
          advertiserFriendliness,
          audienceDemographics,
          sponsorshipPotential,
          affiliateMarketingPotential,
          merchandisePotential
        },
        recommendations,
        revenueEstimate
      }
    };
  } catch (error) {
    console.error('Error analyzing monetization potential:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze monetization potential'
    };
  }
}

/**
 * Calculates advertiser friendliness score
 * @private
 */
function calculateAdvertiserFriendliness(topic, category) {
  // Base score by category
  const categoryScores = {
    'technology': 85,
    'education': 90,
    'entertainment': 75,
    'gaming': 80,
    'lifestyle': 85,
    'business': 90,
    'finance': 85,
    'health': 75,
    'fitness': 80,
    'food': 85,
    'travel': 90,
    'beauty': 85,
    'fashion': 80,
    'sports': 85,
    'music': 75,
    'news': 65,
    'politics': 50,
    'comedy': 70
  };
  
  // Default score if category not found
  let score = categoryScores[category.toLowerCase()] || 75;
  
  // Adjust based on topic keywords
  const lowerTopic = topic.toLowerCase();
  
  // Keywords that might reduce advertiser friendliness
  const sensitiveKeywords = [
    'controversy', 'controversial', 'scandal', 'explicit', 'adult',
    'violence', 'violent', 'gore', 'drug', 'alcohol', 'gambling',
    'weapon', 'political', 'politics', 'religion', 'religious',
    'conspiracy', 'lawsuit', 'sue', 'scam', 'hack', 'hacking'
  ];
  
  // Check for sensitive keywords
  for (const keyword of sensitiveKeywords) {
    if (lowerTopic.includes(keyword)) {
      score -= 10; // Reduce score for each sensitive keyword
    }
  }
  
  // Keywords that might increase advertiser friendliness
  const positiveKeywords = [
    'guide', 'tutorial', 'how to', 'review', 'tips', 'advice',
    'best', 'top', 'ultimate', 'beginner', 'professional', 'expert',
    'improve', 'learn', 'educational', 'family', 'friendly', 'positive',
    'solution', 'help', 'benefit', 'advantage', 'success', 'achievement'
  ];
  
  // Check for positive keywords
  for (const keyword of positiveKeywords) {
    if (lowerTopic.includes(keyword)) {
      score += 5; // Increase score for each positive keyword
    }
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates audience demographics match score
 * @private
 */
function calculateAudienceDemographics(topic, category, region) {
  // Base score by category
  const categoryDemographics = {
    'technology': 80,
    'education': 85,
    'entertainment': 90,
    'gaming': 85,
    'lifestyle': 80,
    'business': 75,
    'finance': 70,
    'health': 80,
    'fitness': 85,
    'food': 90,
    'travel': 85,
    'beauty': 80,
    'fashion': 85,
    'sports': 80,
    'music': 90,
    'news': 75,
    'politics': 65,
    'comedy': 85
  };
  
  // Default score if category not found
  let score = categoryDemographics[category.toLowerCase()] || 75;
  
  // Adjust based on region
  const highValueRegions = ['us', 'usa', 'uk', 'canada', 'australia', 'germany', 'japan'];
  if (highValueRegions.includes(region.toLowerCase())) {
    score += 10;
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates sponsorship potential score
 * @private
 */
function calculateSponsorshipPotential(topic, category) {
  // Base score by category
  const categorySponsorshipPotential = {
    'technology': 90,
    'education': 75,
    'entertainment': 85,
    'gaming': 90,
    'lifestyle': 85,
    'business': 80,
    'finance': 85,
    'health': 90,
    'fitness': 95,
    'food': 90,
    'travel': 95,
    'beauty': 95,
    'fashion': 95,
    'sports': 90,
    'music': 80,
    'news': 60,
    'politics': 50,
    'comedy': 75
  };
  
  // Default score if category not found
  let score = categorySponsorshipPotential[category.toLowerCase()] || 75;
  
  // Adjust based on topic keywords
  const lowerTopic = topic.toLowerCase();
  
  // Keywords that might increase sponsorship potential
  const sponsorshipKeywords = [
    'review', 'comparison', 'versus', 'vs', 'best', 'top', 'recommended',
    'guide', 'tutorial', 'how to', 'unboxing', 'first look', 'hands-on',
    'experience', 'product', 'service', 'app', 'software', 'tool',
    'gadget', 'device', 'equipment', 'gear', 'accessory', 'brand'
  ];
  
  // Check for sponsorship keywords
  for (const keyword of sponsorshipKeywords) {
    if (lowerTopic.includes(keyword)) {
      score += 5; // Increase score for each sponsorship keyword
    }
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates affiliate marketing potential score
 * @private
 */
function calculateAffiliateMarketingPotential(topic, category) {
  // Base score by category
  const categoryAffiliateMarketingPotential = {
    'technology': 95,
    'education': 80,
    'entertainment': 75,
    'gaming': 90,
    'lifestyle': 85,
    'business': 80,
    'finance': 85,
    'health': 90,
    'fitness': 95,
    'food': 85,
    'travel': 90,
    'beauty': 95,
    'fashion': 95,
    'sports': 85,
    'music': 70,
    'news': 50,
    'politics': 40,
    'comedy': 60
  };
  
  // Default score if category not found
  let score = categoryAffiliateMarketingPotential[category.toLowerCase()] || 75;
  
  // Adjust based on topic keywords
  const lowerTopic = topic.toLowerCase();
  
  // Keywords that might increase affiliate marketing potential
  const affiliateKeywords = [
    'review', 'comparison', 'versus', 'vs', 'best', 'top', 'recommended',
    'buy', 'purchase', 'deal', 'discount', 'sale', 'offer', 'price',
    'affordable', 'cheap', 'expensive', 'premium', 'luxury', 'budget',
    'amazon', 'shop', 'store', 'marketplace', 'online', 'ecommerce'
  ];
  
  // Check for affiliate keywords
  for (const keyword of affiliateKeywords) {
    if (lowerTopic.includes(keyword)) {
      score += 5; // Increase score for each affiliate keyword
    }
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates merchandise potential score
 * @private
 */
function calculateMerchandisePotential(topic, category) {
  // Base score by category
  const categoryMerchandisePotential = {
    'technology': 70,
    'education': 60,
    'entertainment': 90,
    'gaming': 95,
    'lifestyle': 80,
    'business': 50,
    'finance': 40,
    'health': 70,
    'fitness': 80,
    'food': 75,
    'travel': 80,
    'beauty': 75,
    'fashion': 90,
    'sports': 90,
    'music': 95,
    'news': 40,
    'politics': 50,
    'comedy': 85
  };
  
  // Default score if category not found
  let score = categoryMerchandisePotential[category.toLowerCase()] || 70;
  
  // Adjust based on topic keywords
  const lowerTopic = topic.toLowerCase();
  
  // Keywords that might increase merchandise potential
  const merchandiseKeywords = [
    'fan', 'fans', 'community', 'club', 'group', 'team', 'squad',
    'merch', 'merchandise', 'shirt', 'tshirt', 'hoodie', 'apparel',
    'brand', 'logo', 'design', 'art', 'artist', 'creative', 'unique',
    'limited', 'exclusive', 'collection', 'series', 'edition'
  ];
  
  // Check for merchandise keywords
  for (const keyword of merchandiseKeywords) {
    if (lowerTopic.includes(keyword)) {
      score += 5; // Increase score for each merchandise keyword
    }
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates overall monetization score
 * @private
 */
function calculateOverallScore({
  advertiserFriendliness,
  audienceDemographics,
  sponsorshipPotential,
  affiliateMarketingPotential,
  merchandisePotential
}) {
  // Weighted average of all metrics
  return Math.round(
    (advertiserFriendliness * 0.25) +
    (audienceDemographics * 0.2) +
    (sponsorshipPotential * 0.25) +
    (affiliateMarketingPotential * 0.2) +
    (merchandisePotential * 0.1)
  );
}

/**
 * Generates monetization recommendations
 * @private
 */
function generateRecommendations({
  topic,
  category,
  advertiserFriendliness,
  audienceDemographics,
  sponsorshipPotential,
  affiliateMarketingPotential,
  merchandisePotential
}) {
  const recommendations = [];
  
  // Advertiser recommendations
  if (advertiserFriendliness >= 80) {
    recommendations.push('This content is highly advertiser-friendly. Focus on maximizing ad revenue through strategic ad placements.');
  } else if (advertiserFriendliness >= 60) {
    recommendations.push('This content has moderate advertiser appeal. Consider adjusting certain aspects to improve ad revenue potential.');
  } else {
    recommendations.push('This content may face advertiser limitations. Consider alternative monetization strategies like direct support or memberships.');
  }
  
  // Sponsorship recommendations
  if (sponsorshipPotential >= 85) {
    recommendations.push('Excellent sponsorship potential. Reach out to brands in this space for potential partnerships.');
  } else if (sponsorshipPotential >= 70) {
    recommendations.push('Good sponsorship potential. Consider creating a media kit to attract relevant sponsors.');
  }
  
  // Affiliate marketing recommendations
  if (affiliateMarketingPotential >= 85) {
    recommendations.push('High affiliate marketing potential. Include relevant product links and recommendations.');
  } else if (affiliateMarketingPotential >= 70) {
    recommendations.push('Good affiliate marketing potential. Consider incorporating product reviews or comparisons.');
  }
  
  // Merchandise recommendations
  if (merchandisePotential >= 85) {
    recommendations.push('Strong merchandise potential. Consider creating branded products related to this content.');
  }
  
  // Add category-specific recommendations
  switch (category.toLowerCase()) {
    case 'technology':
      recommendations.push('Tech content performs well with product reviews, tutorials, and comparison videos.');
      break;
    case 'gaming':
      recommendations.push('Gaming content can benefit from streaming revenue, game affiliate links, and gaming merchandise.');
      break;
    case 'fitness':
      recommendations.push('Fitness content has strong potential for supplement sponsorships and workout program sales.');
      break;
    case 'beauty':
      recommendations.push('Beauty content performs well with product affiliate links and brand sponsorships.');
      break;
    case 'finance':
      recommendations.push('Finance content can monetize through financial service referrals and educational products.');
      break;
  }
  
  return recommendations;
}

/**
 * Estimates potential revenue range
 * @private
 */
function estimateRevenueRange({ topic, category, region, overallScore }) {
  // Base revenue multipliers by region (CPM basis)
  const regionMultipliers = {
    'us': 1.0,
    'usa': 1.0,
    'uk': 0.9,
    'canada': 0.85,
    'australia': 0.8,
    'germany': 0.75,
    'japan': 0.7,
    'global': 0.6
  };
  
  // Get region multiplier or default to global
  const regionMultiplier = regionMultipliers[region.toLowerCase()] || regionMultipliers.global;
  
  // Base revenue ranges by category (in USD per 1000 views)
  const categoryRevenues = {
    'technology': { min: 3, max: 8 },
    'education': { min: 2.5, max: 7 },
    'entertainment': { min: 2, max: 6 },
    'gaming': { min: 2, max: 7 },
    'lifestyle': { min: 2.5, max: 6.5 },
    'business': { min: 4, max: 12 },
    'finance': { min: 5, max: 15 },
    'health': { min: 3, max: 9 },
    'fitness': { min: 3, max: 8 },
    'food': { min: 2.5, max: 7 },
    'travel': { min: 3, max: 10 },
    'beauty': { min: 3, max: 9 },
    'fashion': { min: 3, max: 8 },
    'sports': { min: 2, max: 6 },
    'music': { min: 1.5, max: 5 },
    'news': { min: 1, max: 4 },
    'politics': { min: 1, max: 3 },
    'comedy': { min: 2, max: 6 }
  };
  
  // Get category revenue or default
  const categoryRevenue = categoryRevenues[category.toLowerCase()] || { min: 2, max: 6 };
  
  // Adjust based on overall score
  const scoreMultiplier = overallScore / 75; // Normalize around 75 as baseline
  
  // Calculate final revenue estimates
  const minRevenue = Math.round(categoryRevenue.min * regionMultiplier * scoreMultiplier * 10) / 10;
  const maxRevenue = Math.round(categoryRevenue.max * regionMultiplier * scoreMultiplier * 10) / 10;
  
  return {
    perThousandViews: {
      min: minRevenue,
      max: maxRevenue
    },
    projections: {
      tenThousandViews: {
        min: Math.round(minRevenue * 10),
        max: Math.round(maxRevenue * 10)
      },
      hundredThousandViews: {
        min: Math.round(minRevenue * 100),
        max: Math.round(maxRevenue * 100)
      },
      millionViews: {
        min: Math.round(minRevenue * 1000),
        max: Math.round(maxRevenue * 1000)
      }
    }
  };
}
