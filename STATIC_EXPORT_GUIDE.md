# Static Export Deployment Guide for YouTube Automation Platform

This guide provides instructions for deploying the YouTube Automation Platform using Next.js static export mode, which resolves the server-side rendering issues encountered with client components.

## What is Static Export?

Static export generates HTML, CSS, and JavaScript files that can be deployed to any static hosting service without requiring a Node.js server. This approach:

- Eliminates server-side rendering errors with client components
- Provides faster page loads
- Works with any static hosting service (Netlify, Vercel, GitHub Pages, etc.)
- Simplifies deployment and reduces costs

## Deployment Steps

### 1. Prepare Your Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
YOUTUBE_API_KEY=your-youtube-api-key
```

### 2. Build the Project Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

This will generate the static files in the `out` directory.

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify UI

1. Log in to your Netlify account
2. Go to "Sites" and click "Add new site" > "Import an existing project"
3. Connect to your GitHub repository
4. Configure the build settings:
   - Build command: `npm install && npm run build`
   - Publish directory: `out`
5. Add your environment variables in the "Environment" section
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Log in to Netlify: `netlify login`
3. Initialize your site: `netlify init`
4. Deploy your site: `netlify deploy --prod`

### 4. Verify Your Deployment

After deployment, verify that:
- The home page loads correctly
- Authentication works (login/signup)
- The pricing page displays properly
- All API functionality works as expected

## Troubleshooting

### Issue: API Routes Not Working

Since static export doesn't support API routes, you'll need to use external services for API functionality:

- Use Supabase Edge Functions for authentication
- Use Netlify Functions or Vercel Edge Functions for other API needs
- Consider using a separate backend service for complex API requirements

### Issue: Environment Variables Not Available

Make sure your environment variables are properly set in your hosting provider's dashboard.

### Issue: Routing Problems

If you encounter routing issues, make sure your hosting provider is configured to handle client-side routing:

For Netlify, add a `_redirects` file in the `public` directory with:
```
/*    /index.html   200
```

## Need Help?

If you encounter any issues with your deployment, please contact our support team with:
- The specific error message
- Your deployment URL
- Steps to reproduce the issue
