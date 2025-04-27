# YouTube Automation Platform

A Next.js application for automating YouTube content creation, scheduling, and optimization.

## Features

- AI-powered video topic generation
- Content creation tools
- Video scheduling and optimization
- Storage management
- YouTube API integration
- Analytics dashboard
- Subscription management

## Deployment Instructions

### Prerequisites

- Node.js 16+ and npm
- Netlify account
- Stripe account (for payment processing)
- YouTube API credentials

### Environment Variables

Create a `.env` file with the following variables:

```
# Authentication
JWT_SECRET=your_jwt_secret_here

# Stripe
NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# S3 Storage (optional)
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key
S3_BUCKET=your_s3_bucket_name
S3_REGION=your_s3_region
```

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Netlify Deployment

1. Push the code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Netlify

3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `out`

4. Add the environment variables in the Netlify dashboard

5. Deploy the site

### Important Notes

- The application uses Netlify Functions for serverless API endpoints
- All API routes are configured in the `netlify/functions` directory
- Authentication is handled through JWT tokens
- The application includes fallback functionality for demo purposes

## Troubleshooting

### API Endpoints Not Working

If API endpoints return HTML instead of JSON:

1. Check that the `netlify.toml` file has the correct redirects configured
2. Verify that the Netlify Functions are properly deployed
3. Ensure CORS headers are properly set in the API responses

### Authentication Issues

If login or registration fails:

1. Check browser console for specific error messages
2. Verify that cookies are being properly set and read
3. Ensure the JWT secret is properly configured

### Payment Processing Issues

If subscription management fails:

1. Verify Stripe API keys are correctly set
2. Check webhook configurations in the Stripe dashboard
3. Test with Stripe test mode before going to production

## License

This project is licensed under the MIT License - see the LICENSE file for details.
