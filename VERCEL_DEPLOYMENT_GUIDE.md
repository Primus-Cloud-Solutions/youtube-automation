# Vercel Deployment Guide for YouTube Automation Platform

This guide provides instructions for deploying the YouTube Automation Platform to Vercel.

## Prerequisites

1. A Vercel account (create one at [vercel.com](https://vercel.com) if you don't have one)
2. A Supabase account with a project set up
3. A Stripe account for payment processing

## Environment Variables

Set up the following environment variables in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## Deployment Steps

1. **Install Vercel CLI** (optional, for local testing)
   ```
   npm install -g vercel
   ```

2. **Login to Vercel** (optional, for local testing)
   ```
   vercel login
   ```

3. **Deploy to Vercel**

   ### Option 1: Using Vercel Dashboard
   
   1. Go to [vercel.com](https://vercel.com) and log in
   2. Click "New Project"
   3. Import your GitHub repository or upload the project files
   4. Configure the project:
      - Framework Preset: Next.js
      - Build Command: `next build`
      - Output Directory: `.next`
      - Install Command: `npm install`
   5. Add the environment variables listed above
   6. Click "Deploy"

   ### Option 2: Using Vercel CLI
   
   1. Navigate to your project directory
   2. Run:
      ```
      vercel
      ```
   3. Follow the prompts to configure your project
   4. For production deployment, use:
      ```
      vercel --prod
      ```

## Post-Deployment

1. **Set up Supabase Tables**
   
   Create the necessary tables in your Supabase project:
   
   - `users` table for storing user information
   - `subscriptions` table for tracking subscription status

2. **Configure Stripe Webhooks**
   
   Set up Stripe webhooks to handle subscription events:
   
   1. Go to your Stripe Dashboard > Developers > Webhooks
   2. Add an endpoint with your Vercel deployment URL + `/api/webhooks/stripe`
   3. Add the following events:
      - `customer.subscription.created`
      - `customer.subscription.updated`
      - `customer.subscription.deleted`
      - `checkout.session.completed`

## Troubleshooting

- **API Routes Not Working**: Ensure your `next.config.js` has the correct rewrites configuration
- **Authentication Issues**: Verify your Supabase environment variables are correct
- **Payment Processing Errors**: Check your Stripe configuration and webhook setup

## Support

If you encounter any issues with your deployment, please contact support at support@tubeautomator.com
