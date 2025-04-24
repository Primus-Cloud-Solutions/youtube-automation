// api/elevenlabs-api.js
import axios from 'axios';

// ElevenLabs API base URL
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export const elevenlabsApi = {
  // Test ElevenLabs API key
  testApiKey: async (apiKey) => {
    try {
      const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
        headers: {
          'xi-api-key': apiKey
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('ElevenLabs API key test error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to validate ElevenLabs API key' 
      };
    }
  },
  
  // Get available voices
  getVoices: async (apiKey) => {
    try {
      const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
        headers: {
          'xi-api-key': apiKey
        }
      });
      
      return { success: true, voices: response.data.voices };
    } catch (error) {
      console.error('Error getting voices:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to get voices' 
      };
    }
  },
  
  // Generate speech from text
  generateSpeech: async (apiKey, text, voiceId, options = {}) => {
    try {
      const {
        stability = 0.5,
        similarityBoost = 0.5,
        style = 0.0,
        speakerBoost = true
      } = options;
      
      const response = await axios.post(
        `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: speakerBoost
          }
        },
        {
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer'
        }
      );
      
      return { 
        success: true, 
        audioBuffer: response.data,
        contentType: response.headers['content-type']
      };
    } catch (error) {
      console.error('Error generating speech:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to generate speech' 
      };
    }
  },
  
  // Convert script to speech with proper pacing and emphasis
  convertScriptToSpeech: async (apiKey, script, voiceId, options = {}) => {
    try {
      // Process script to add SSML tags for better pacing and emphasis
      const processedScript = addSSMLTags(script);
      
      // Split script into manageable chunks (ElevenLabs has a limit)
      const chunks = splitScriptIntoChunks(processedScript);
      
      // Generate speech for each chunk
      const audioChunks = [];
      for (const chunk of chunks) {
        const result = await elevenlabsApi.generateSpeech(apiKey, chunk, voiceId, options);
        if (!result.success) {
          throw new Error(result.error);
        }
        audioChunks.push(result.audioBuffer);
      }
      
      // Combine audio chunks (in a real implementation, you'd use a library to concatenate audio)
      // For this example, we'll just return the first chunk
      return { 
        success: true, 
        audioBuffer: audioChunks[0],
        contentType: 'audio/mpeg'
      };
    } catch (error) {
      console.error('Error converting script to speech:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to convert script to speech' 
      };
    }
  },
  
  // Get user's subscription info
  getUserSubscription: async (apiKey) => {
    try {
      const response = await axios.get(`${ELEVENLABS_API_URL}/user/subscription`, {
        headers: {
          'xi-api-key': apiKey
        }
      });
      
      return { success: true, subscription: response.data };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to get user subscription' 
      };
    }
  },
  
  // Get user's remaining character count
  getRemainingCharacters: async (apiKey) => {
    try {
      const response = await axios.get(`${ELEVENLABS_API_URL}/user`, {
        headers: {
          'xi-api-key': apiKey
        }
      });
      
      return { 
        success: true, 
        characterCount: response.data.subscription.character_count,
        characterLimit: response.data.subscription.character_limit
      };
    } catch (error) {
      console.error('Error getting remaining characters:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to get remaining characters' 
      };
    }
  }
};

// Helper function to add SSML tags for better speech
function addSSMLTags(script) {
  // Replace [VISUAL CUE: ...] with pauses
  let processedScript = script.replace(/\[VISUAL CUE:([^\]]+)\]/g, '<break time="1s"/>');
  
  // Add pauses after paragraphs
  processedScript = processedScript.replace(/\.\s+(?=[A-Z])/g, '.<break time="0.5s"/> ');
  
  // Add emphasis to important phrases (this is a simplified example)
  processedScript = processedScript.replace(
    /(important|crucial|significant|key|essential|critical|vital)/gi, 
    '<emphasis>$1</emphasis>'
  );
  
  return processedScript;
}

// Helper function to split script into manageable chunks
function splitScriptIntoChunks(script, maxChunkSize = 4000) {
  const chunks = [];
  let currentChunk = '';
  
  // Split by sentences
  const sentences = script.split(/(?<=[.!?])\s+/);
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}
