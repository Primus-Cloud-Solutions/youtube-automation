'use server';

import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function getVoices() {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
}

export async function generateSpeech(text, voiceId) {
  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      { text, model_id: 'eleven_monolingual_v1' },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}