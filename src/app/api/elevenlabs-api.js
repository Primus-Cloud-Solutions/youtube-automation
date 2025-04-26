// ElevenLabs API integration for text-to-speech conversion

/**
 * Convert text to speech using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - The voice ID to use (default: 'EXAVITQu4vr4xnSDxMaL')
 * @param {number} stability - Voice stability (0-1, default: 0.5)
 * @param {number} similarityBoost - Voice similarity boost (0-1, default: 0.75)
 * @returns {Promise<{success: boolean, audioUrl: string|null, error: string|null}>}
 */
export const textToSpeech = async (text, voiceId = 'EXAVITQu4vr4xnSDxMaL', stability = 0.5, similarityBoost = 0.75) => {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.ELEVENLABS_API_KEY) {
      console.warn('ElevenLabs API key not available during build, returning mock data');
      return { 
        success: true, 
        audioUrl: 'https://example.com/mock-audio.mp3',
        duration: 30
      };
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return { 
        success: false, 
        audioUrl: null, 
        error: 'ElevenLabs API key not configured' 
      };
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || `Failed with status: ${response.status}`);
    }

    // In a real implementation, we would save this audio file to S3
    // For now, we'll create a mock URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Calculate approximate duration (1 second per 15 characters is a rough estimate)
    const estimatedDuration = Math.ceil(text.length / 15);

    return {
      success: true,
      audioUrl,
      duration: estimatedDuration
    };
  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error);
    return {
      success: false,
      audioUrl: null,
      error: error.message || 'Failed to generate speech'
    };
  }
};

/**
 * Get available voices from ElevenLabs
 * @returns {Promise<{success: boolean, voices: Array|null, error: string|null}>}
 */
export const getVoices = async () => {
  try {
    // Check if we're in a build/SSG environment
    if (process.env.NODE_ENV === 'production' && !process.env.ELEVENLABS_API_KEY) {
      console.warn('ElevenLabs API key not available during build, returning mock data');
      return { 
        success: true, 
        voices: [
          { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Daniel', preview_url: 'https://example.com/preview1.mp3' },
          { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', preview_url: 'https://example.com/preview2.mp3' },
          { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Michael', preview_url: 'https://example.com/preview3.mp3' }
        ]
      };
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return { 
        success: false, 
        voices: null, 
        error: 'ElevenLabs API key not configured' 
      };
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || `Failed with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      voices: data.voices
    };
  } catch (error) {
    console.error('Error fetching voices from ElevenLabs:', error);
    return {
      success: false,
      voices: null,
      error: error.message || 'Failed to fetch voices'
    };
  }
};

/**
 * Generate a voiceover for a video script
 * @param {string} script - The script to convert to speech
 * @param {string} voiceId - The voice ID to use
 * @returns {Promise<{success: boolean, audioUrl: string|null, duration: number|null, error: string|null}>}
 */
export const generateVoiceover = async (script, voiceId = 'EXAVITQu4vr4xnSDxMaL') => {
  // Clean up the script for better TTS results
  const cleanScript = script
    .replace(/\[VISUAL NOTES\].*?\n/g, '') // Remove visual notes
    .replace(/\n\n+/g, '\n\n') // Normalize line breaks
    .trim();
  
  const result = await textToSpeech(cleanScript, voiceId);
  
  if (!result.success) {
    return {
      success: false,
      audioUrl: null,
      duration: null,
      error: result.error
    };
  }
  
  return {
    success: true,
    audioUrl: result.audioUrl,
    duration: result.duration
  };
};

// Export API functions
export default {
  textToSpeech,
  getVoices,
  generateVoiceover
};
