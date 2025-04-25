'use server';

import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function generateScript(topic, length = 'medium', tone = 'informative') {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional YouTube script writer. Create a ${length} length script in a ${tone} tone.`
        },
        {
          role: "user",
          content: `Write a YouTube script about: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}