# Vercel Deployment Guide

This guide provides instructions for deploying the YouTube Automation Platform to Vercel.

## Prerequisites

Before deploying, make sure you have:

1. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
2. A Supabase account with a project set up
3. A Stripe account with API keys

## Deployment Steps

### 1. Set Up Environment Variables

You'll need to set the following environment variables in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key

### 2. Deploy to Vercel

#### Option 1: Deploy from GitHub

1. Push your project to a GitHub repository
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Select your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
6. Add the environment variables mentioned above
7. Click "Deploy"

#### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to your project directory
3. Run `vercel login` and follow the prompts
4. Run `vercel` to deploy
5. Follow the prompts to set up your project
6. Add the environment variables when prompted

### 3. Verify Deployment

After deployment:

1. Visit your deployed site
2. Test the authentication flow (login/signup)
3. Test the payment flow
4. Verify all pages are working correctly

## Troubleshooting

If you encounter issues during deployment:

1. **Build Errors**: Check the build logs in Vercel for specific errors
2. **API Routes Not Working**: Ensure your environment variables are set correctly
3. **Authentication Issues**: Verify your Supabase configuration
4. **Payment Issues**: Check your Stripe configuration and webhook setup

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Stripe Documentation](https://stripe.com/docs)

For any other issues, please contact support or open an issue on the project repository.
