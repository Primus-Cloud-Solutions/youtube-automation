# YouTube Automation Platform

This is a Next.js application for YouTube content automation with Netlify deployment configuration.

## Features

- YouTube content automation
- Viral video search, editing, and rebranding
- Content scheduling
- Analytics dashboard
- S3 storage integration
- Authentication system with email/password and social login
- Subscription management with different pricing plans

## Deployment Instructions for Netlify

### Prerequisites

- A Netlify account
- Git repository with this code (optional, you can also deploy directly from the zip file)

### Environment Variables

The following environment variables need to be set in your Netlify project settings:

```
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-netlify-domain.netlify.app/api/auth/callback/google

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# AWS S3 Storage
S3_BUCKET_NAME=your_s3_bucket_name
YOUTUBE_AWS_ACCESS_KEY=your_aws_access_key
YOUTUBE_AWS_SECRET_KEY=your_aws_secret_key
YOUTUBE_AWS_REGION=your_aws_region

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs API
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_sendgrid_from_email

# App Settings
NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
```

### Deployment Steps

1. **Deploy to Netlify**:
   - Log in to your Netlify account
   - Click "New site from Git" or upload this zip file directly
   - Connect to your Git repository if using Git
   - Set the build command to: `npm install && npm run build`
   - Set the publish directory to: `out`
   - Add all the environment variables listed above
   - Click "Deploy site"

2. **Verify Functions**:
   - After deployment, check the Functions tab in your Netlify dashboard
   - Ensure all functions are deployed correctly
   - Test the authentication endpoints

3. **Set up Redirects**:
   - The netlify.toml file already includes the necessary redirects
   - Verify they are working by testing the API endpoints

## Local Development

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with the environment variables listed above

3. Run the development server:
```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```
npm run build
```

This will create a static export in the `out` directory that can be deployed to Netlify.

## Project Structure

- `src/app`: Next.js App Router pages and components
- `pages`: Next.js Pages Router (minimal, just for compatibility)
- `public`: Static assets
- `netlify/functions`: Netlify serverless functions for API endpoints
- `netlify.toml`: Netlify configuration file with redirects and build settings

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Netlify build logs for errors
2. Verify all environment variables are set correctly
3. Ensure the Netlify functions are deployed properly
4. Check the browser console for any client-side errors
5. Test the API endpoints using the Netlify Functions UI

For any other issues, please refer to the Netlify documentation or contact support.
