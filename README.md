# YouTube Automation Platform

This is a Next.js application for automating YouTube content creation, scheduling, and optimization.

## Features

- Authentication system with email/password and social login options
- Subscription management with different pricing tiers
- YouTube video generation and management
- Content scheduling and optimization
- Analytics dashboard
- Storage management for video assets
- Viral video discovery and rebranding

## Deployment Instructions

### Prerequisites

- Node.js 16+ and npm
- Netlify account for deployment

### Environment Variables

Create a `.env` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_API_URL=your_api_url_or_empty_for_relative_paths
```

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Netlify Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add the environment variables in the Netlify dashboard
5. Deploy the site

## Project Structure

- `src/app/` - Next.js pages and components
- `src/lib/` - Utility functions and context providers
- `src/app/api/` - API route handlers
- `netlify/functions/` - Netlify serverless functions
- `public/` - Static assets

## Authentication System

The authentication system uses Netlify Functions to handle user authentication. It supports:

- Email/password login
- Google and GitHub social login
- Session management with cookies

## API Structure

The API is structured around Netlify Functions:

- `auth-*.js` - Authentication-related endpoints
- `api.js` - Main API router that handles various functionality

## Troubleshooting

If you encounter CORS issues:
- Check that all API responses include proper CORS headers
- Ensure OPTIONS requests are handled correctly

If authentication fails:
- Verify that cookies are being set correctly
- Check browser console for any errors
- Ensure the auth-check.js function is working properly

## License

This project is licensed under the MIT License.
