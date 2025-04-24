// api/openai-api.js
import OpenAI from 'openai';

// Initialize OpenAI client
export const initializeOpenAIClient = (apiKey) => {
  return new OpenAI({
    apiKey: apiKey,
  });
};

export const openaiApi = {
  // Test OpenAI API key
  testApiKey: async (apiKey) => {
    try {
      const openai = initializeOpenAIClient(apiKey);
      
      // Make a simple request to test the API key
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, this is a test message." }
        ],
        max_tokens: 10
      });
      
      return { success: true, data: response };
    } catch (error) {
      console.error('OpenAI API key test error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to validate OpenAI API key' 
      };
    }
  },
  
  // Generate video script based on topic
  generateVideoScript: async (apiKey, topic, options = {}) => {
    try {
      const openai = initializeOpenAIClient(apiKey);
      
      const {
        style = 'educational',
        length = 'medium',
        tone = 'friendly',
        humanLikeness = 80
      } = options;
      
      // Determine target word count based on length
      const wordCounts = {
        short: 300,
        medium: 600,
        long: 1000
      };
      
      const targetWordCount = wordCounts[length] || 600;
      
      // Adjust system prompt based on humanLikeness
      let systemPrompt = `You are an expert YouTube script writer who creates engaging, natural-sounding scripts.`;
      
      if (humanLikeness > 90) {
        systemPrompt += ` Write in a very conversational, human-like style with natural speech patterns, occasional pauses, and casual language. Include filler words occasionally and vary sentence structure.`;
      } else if (humanLikeness > 70) {
        systemPrompt += ` Write in a natural, conversational style while maintaining good structure and clarity.`;
      } else {
        systemPrompt += ` Focus on clear, well-structured content with good information flow.`;
      }
      
      // Create the user prompt
      const userPrompt = `Create a ${style} YouTube video script about "${topic}". 
The script should be approximately ${targetWordCount} words and use a ${tone} tone.
Format the script with:
1. An attention-grabbing introduction
2. Main content with clear sections
3. A strong call-to-action conclusion

Include [VISUAL CUE: description] markers where specific visuals should appear.
Make the content engaging, factual, and optimized for YouTube audience retention.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: humanLikeness > 80 ? 0.8 : 0.6,
        max_tokens: 2000
      });
      
      const script = response.choices[0].message.content;
      
      // Generate title suggestions
      const titleResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert at creating engaging YouTube titles that get clicks while being accurate." },
          { role: "user", content: `Based on this script, suggest 5 engaging, click-worthy titles for a YouTube video. The titles should be attention-grabbing but not clickbait or misleading.\n\nScript: ${script.substring(0, 500)}...` }
        ],
        temperature: 0.8,
        max_tokens: 200
      });
      
      const titleSuggestions = titleResponse.choices[0].message.content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
      
      // Generate description
      const descriptionResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert at creating SEO-optimized YouTube descriptions." },
          { role: "user", content: `Based on this script, write an engaging YouTube video description with good keywords. Include a brief summary and 3-5 relevant hashtags at the end.\n\nScript: ${script.substring(0, 500)}...` }
        ],
        temperature: 0.7,
        max_tokens: 300
      });
      
      const description = descriptionResponse.choices[0].message.content;
      
      // Generate tags
      const tagsResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert at creating SEO-optimized YouTube tags." },
          { role: "user", content: `Based on this script, suggest 10-15 relevant tags for a YouTube video. Return only the tags separated by commas, no numbering or explanation.\n\nScript: ${script.substring(0, 500)}...` }
        ],
        temperature: 0.7,
        max_tokens: 100
      });
      
      const tags = tagsResponse.choices[0].message.content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      return { 
        success: true, 
        script,
        titleSuggestions,
        description,
        tags
      };
    } catch (error) {
      console.error('Error generating video script:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to generate video script' 
      };
    }
  },
  
  // Generate video outline from topic
  generateVideoOutline: async (apiKey, topic) => {
    try {
      const openai = initializeOpenAIClient(apiKey);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert YouTube content planner." },
          { role: "user", content: `Create a detailed outline for a YouTube video about "${topic}". Include 5-7 main sections with 2-3 bullet points under each. The outline should be structured to maximize viewer engagement and retention.` }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const outline = response.choices[0].message.content;
      
      return { success: true, outline };
    } catch (error) {
      console.error('Error generating video outline:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to generate video outline' 
      };
    }
  },
  
  // Research topic to enhance video content
  researchTopic: async (apiKey, topic) => {
    try {
      const openai = initializeOpenAIClient(apiKey);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a research assistant who provides factual, well-organized information." },
          { role: "user", content: `Research the topic "${topic}" and provide key facts, statistics, and information that would be valuable for creating an informative YouTube video. Include recent developments, interesting angles, and data points that would engage viewers.` }
        ],
        temperature: 0.5,
        max_tokens: 1000
      });
      
      const research = response.choices[0].message.content;
      
      return { success: true, research };
    } catch (error) {
      console.error('Error researching topic:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to research topic' 
      };
    }
  },
  
  // Check content compliance with YouTube policies
  checkContentCompliance: async (apiKey, content) => {
    try {
      const openai = initializeOpenAIClient(apiKey);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a content compliance expert familiar with YouTube's community guidelines and policies." },
          { role: "user", content: `Review the following content and identify any potential issues that might violate YouTube's community guidelines or policies. Check for inappropriate content, hate speech, violence, harassment, dangerous activities, misinformation, copyright concerns, or other policy violations. If issues are found, suggest modifications to make the content compliant.\n\nContent: ${content}` }
        ],
        temperature: 0.3,
        max_tokens: 500
      });
      
      const complianceCheck = response.choices[0].message.content;
      
      // Determine if content passed the check
      const complianceResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a content compliance classifier. Respond with only 'PASS' or 'FAIL'." },
          { role: "user", content: `Based on this compliance review, did the content pass YouTube's community guidelines check? Respond with only 'PASS' if no significant issues were found, or 'FAIL' if serious issues were identified.\n\nCompliance review: ${complianceCheck}` }
        ],
        temperature: 0.1,
        max_tokens: 10
      });
      
      const passed = complianceResponse.choices[0].message.content.includes('PASS');
      
      return { 
        success: true, 
        passed,
        complianceCheck
      };
    } catch (error) {
      console.error('Error checking content compliance:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to check content compliance' 
      };
    }
  }
};
