'use server';

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key-for-development'
});

// Initialize Supabase client for storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey) : null;

/**
 * Generate channel branding (logo and banner) using AI
 * @param {string} channelName - Name of the YouTube channel
 * @param {string} channelDescription - Description of the YouTube channel
 * @returns {Promise<{logoUrl: string, bannerUrl: string}>} - URLs to the generated branding assets
 */
export async function generateChannelBranding(channelName, channelDescription) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-mock-key-for-development') {
      console.warn('OpenAI API key not configured, using mock branding');
      return {
        logoUrl: 'https://placehold.co/400x400/4ade80/fff?text=Logo',
        bannerUrl: 'https://placehold.co/2560x1440/4ade80/fff?text=Channel+Banner'
      };
    }
    
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Supabase not configured, using mock branding');
      return {
        logoUrl: 'https://placehold.co/400x400/4ade80/fff?text=Logo',
        bannerUrl: 'https://placehold.co/2560x1440/4ade80/fff?text=Channel+Banner'
      };
    }

    // Generate logo prompt
    const logoPrompt = `Create a modern, professional logo for a YouTube channel named "${channelName}". ${channelDescription || ''}`;
    
    // Generate banner prompt
    const bannerPrompt = `Create a YouTube channel banner for "${channelName}". The banner should be eye-catching and professional. ${channelDescription || ''}`;
    
    // Generate logo image
    const logoResponse = await openai.images.generate({
      prompt: logoPrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url'
    });
    
    // Generate banner image
    const bannerResponse = await openai.images.generate({
      prompt: bannerPrompt,
      n: 1,
      size: '1792x1024',
      response_format: 'url'
    });
    
    // Get image URLs from OpenAI response
    const logoUrl = logoResponse.data[0].url;
    const bannerUrl = bannerResponse.data[0].url;
    
    // Download images and upload to Supabase storage
    const logoBlob = await fetch(logoUrl).then(r => r.blob());
    const bannerBlob = await fetch(bannerUrl).then(r => r.blob());
    
    // Convert blobs to array buffers
    const logoBuffer = await logoBlob.arrayBuffer();
    const bannerBuffer = await bannerBlob.arrayBuffer();
    
    // Generate unique filenames
    const timestamp = Date.now();
    const logoFilename = `channel-logos/${channelName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.png`;
    const bannerFilename = `channel-banners/${channelName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.png`;
    
    // Upload to Supabase storage
    const { data: logoData, error: logoError } = await supabase.storage
      .from('youtube-assets')
      .upload(logoFilename, logoBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (logoError) {
      console.error('Error uploading logo:', logoError);
      throw new Error('Failed to upload logo');
    }
    
    const { data: bannerData, error: bannerError } = await supabase.storage
      .from('youtube-assets')
      .upload(bannerFilename, bannerBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (bannerError) {
      console.error('Error uploading banner:', bannerError);
      throw new Error('Failed to upload banner');
    }
    
    // Get public URLs
    const { data: logoUrlData } = supabase.storage
      .from('youtube-assets')
      .getPublicUrl(logoFilename);
    
    const { data: bannerUrlData } = supabase.storage
      .from('youtube-assets')
      .getPublicUrl(bannerFilename);
    
    return {
      logoUrl: logoUrlData.publicUrl,
      bannerUrl: bannerUrlData.publicUrl
    };
  } catch (error) {
    console.error('Error generating channel branding:', error);
    // Return placeholder images as fallback
    return {
      logoUrl: 'https://placehold.co/400x400/4ade80/fff?text=Logo',
      bannerUrl: 'https://placehold.co/2560x1440/4ade80/fff?text=Channel+Banner'
    };
  }
}
