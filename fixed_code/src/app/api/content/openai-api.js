// OpenAI API integration for content generation

/**
 * Generate content using OpenAI API
 * @param {string} prompt - The prompt to generate content from
 * @param {string} model - The model to use (default: gpt-4)
 * @param {number} maxTokens - Maximum tokens to generate (default: 1000)
 * @param {number} temperature - Randomness of output (0-1, default: 0.7)
 * @returns {Promise<{success: boolean, content: string|null, error: string|null}>}
 */
export const generateContent = async (prompt, model = 'gpt-4', maxTokens = 1000, temperature = 0.7) => {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available during build, returning mock data');
      return { 
        success: true, 
        content: `Mock content for prompt: ${prompt.substring(0, 50)}...` 
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return { 
        success: false, 
        content: null, 
        error: 'OpenAI API key not configured' 
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates high-quality content for YouTube videos.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate content');
    }

    return {
      success: true,
      content: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    return {
      success: false,
      content: null,
      error: error.message || 'Failed to generate content'
    };
  }
};

/**
 * Generate a video script based on a topic
 * @param {string} topic - The topic to create a script about
 * @param {string} style - Content style (educational, entertaining, news, tutorial)
 * @param {string} length - Desired length (short, medium, long)
 * @returns {Promise<{success: boolean, script: string|null, error: string|null}>}
 */
export const generateScript = async (topic, style = 'educational', length = 'medium') => {
  // Define length in words based on parameter
  const wordCounts = {
    short: 300,
    medium: 600,
    long: 1000
  };
  
  const targetWords = wordCounts[length] || 600;
  
  // Create a detailed prompt for script generation
  const prompt = `
    Create a YouTube video script about "${topic}".
    
    Style: ${style}
    Target length: approximately ${targetWords} words
    
    The script should include:
    1. An attention-grabbing introduction
    2. Clear sections with logical flow
    3. Engaging content that keeps viewers watching
    4. A strong call-to-action at the end
    
    Format the script with clear section headings and include [VISUAL NOTES] for suggested visuals.
    
    Make the content factually accurate, engaging, and optimized for YouTube's algorithm.
  `;
  
  const result = await generateContent(prompt, 'gpt-4', Math.max(targetWords * 2, 1000), 0.7);
  
  if (!result.success) {
    return {
      success: false,
      script: null,
      error: result.error
    };
  }
  
  return {
    success: true,
    script: result.content
  };
};

/**
 * Generate topic ideas based on a category
 * @param {string} category - The content category
 * @param {number} count - Number of ideas to generate (default: 5)
 * @returns {Promise<{success: boolean, topics: Array|null, error: string|null}>}
 */
export const generateTopicIdeas = async (category, count = 5) => {
  const prompt = `
    Generate ${count} trending YouTube video topic ideas in the "${category}" category.
    
    For each topic:
    1. Create an attention-grabbing title (max 60 characters)
    2. Write a brief description (1-2 sentences)
    3. Suggest 3-5 relevant keywords or tags
    
    Format each topic as:
    
    Title: [TITLE]
    Description: [DESCRIPTION]
    Keywords: [KEYWORD1], [KEYWORD2], [KEYWORD3]
    
    Make sure the topics are trending, have viral potential, and would perform well on YouTube's algorithm.
  `;
  
  const result = await generateContent(prompt, 'gpt-4', 1000, 0.8);
  
  if (!result.success) {
    return {
      success: false,
      topics: null,
      error: result.error
    };
  }
  
  // Parse the generated content into structured topics
  try {
    const content = result.content;
    const topicBlocks = content.split(/Title: /).filter(block => block.trim().length > 0);
    
    const topics = topicBlocks.map(block => {
      const titleMatch = block.match(/^(.+?)(?=\n|Description:)/s);
      const descriptionMatch = block.match(/Description: (.+?)(?=\n|Keywords:)/s);
      const keywordsMatch = block.match(/Keywords: (.+?)(?=\n|$)/s);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : '',
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : []
      };
    });
    
    return {
      success: true,
      topics: topics.slice(0, count) // Ensure we only return the requested number
    };
  } catch (error) {
    console.error('Error parsing generated topics:', error);
    return {
      success: false,
      topics: null,
      error: 'Failed to parse generated topics'
    };
  }
};

/**
 * Generate video metadata for YouTube upload
 * @param {string} title - Video title
 * @param {string} script - Video script content
 * @returns {Promise<{success: boolean, metadata: Object|null, error: string|null}>}
 */
export const generateVideoMetadata = async (title, script) => {
  const prompt = `
    Based on the following video title and script, generate optimized YouTube metadata:
    
    TITLE: ${title}
    
    SCRIPT: ${script.substring(0, 1000)}...
    
    Generate:
    1. A compelling description (2-3 paragraphs)
    2. 10-15 relevant tags (comma-separated)
    3. The best YouTube category for this content
    4. 3 suggested timestamps for key moments in the video
    
    Format as:
    Description: [DESCRIPTION]
    Tags: [TAG1], [TAG2], [TAG3], ...
    Category: [CATEGORY]
    Timestamps: [TIMESTAMP1]: [LABEL1], [TIMESTAMP2]: [LABEL2], [TIMESTAMP3]: [LABEL3]
  `;
  
  const result = await generateContent(prompt, 'gpt-4', 1000, 0.7);
  
  if (!result.success) {
    return {
      success: false,
      metadata: null,
      error: result.error
    };
  }
  
  // Parse the generated content into structured metadata
  try {
    const content = result.content;
    
    const descriptionMatch = content.match(/Description: (.+?)(?=\nTags:|$)/s);
    const tagsMatch = content.match(/Tags: (.+?)(?=\nCategory:|$)/s);
    const categoryMatch = content.match(/Category: (.+?)(?=\nTimestamps:|$)/s);
    const timestampsMatch = content.match(/Timestamps: (.+?)(?=\n|$)/s);
    
    const metadata = {
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      tags: tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : [],
      category: categoryMatch ? categoryMatch[1].trim() : 'Education',
      timestamps: timestampsMatch ? timestampsMatch[1].trim() : ''
    };
    
    return {
      success: true,
      metadata
    };
  } catch (error) {
    console.error('Error parsing generated metadata:', error);
    return {
      success: false,
      metadata: null,
      error: 'Failed to parse generated metadata'
    };
  }
};

// Export API functions
export default {
  generateContent,
  generateScript,
  generateTopicIdeas,
  generateVideoMetadata
};
