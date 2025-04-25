# Netlify Deployment Guide

This guide provides instructions for deploying the YouTube Automation Platform to Netlify.

## Prerequisites

Before deploying, make sure you have:

1. A Netlify account (sign up at [netlify.com](https://netlify.com) if you don't have one)
2. A Supabase account with a project set up
3. A Stripe account with API keys
4. OpenAI, ElevenLabs, and YouTube API keys for the content generation features

## Deployment Steps

### 1. Set Up Environment Variables

You'll need to set the following environment variables in your Netlify project:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `OPENAI_API_KEY`: Your OpenAI API key
- `ELEVENLABS_API_KEY`: Your ElevenLabs API key
- `YOUTUBE_API_KEY`: Your YouTube API key

### 2. Deploy to Netlify

#### Option 1: Deploy from GitHub

1. Push your project to a GitHub repository
2. Log in to your Netlify account
3. Click "Add new site" > "Import an existing project"
4. Select your GitHub repository
5. Configure the project:
   - Build command: `npm install && npm run build`
   - Publish directory: `.next`
6. Add the environment variables mentioned above
7. Click "Deploy site"

#### Option 2: Deploy using Netlify CLI

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Navigate to your project directory
3. Run `netlify login` and follow the prompts
4. Run `netlify deploy` to deploy
5. Follow the prompts to set up your project
6. Add the environment variables when prompted

### 3. Verify Deployment

After deployment:

1. Visit your deployed site
2. Test the authentication flow (login/signup)
3. Test the payment flow
4. Verify all pages are working correctly
5. Test the AI content generation features

## Troubleshooting

If you encounter issues during deployment:

1. **Build Errors**: Check the build logs in Netlify for specific errors
2. **API Routes Not Working**: Ensure your environment variables are set correctly
3. **Authentication Issues**: Verify your Supabase configuration
4. **Payment Issues**: Check your Stripe configuration and webhook setup
5. **Content Generation Issues**: Verify your OpenAI, ElevenLabs, and YouTube API keys

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [ElevenLabs Documentation](https://docs.elevenlabs.io)
- [YouTube API Documentation](https://developers.google.com/youtube/v3/docs)

For any other issues, please contact support or open an issue on the project repository.
