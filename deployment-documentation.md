# YouTube Platform Deployment Documentation

## Environment Variables

The application requires the following environment variables to be set in your deployment environment:

### Required Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key for content generation
- `YOUTUBE_API_KEY`: Your YouTube API key for accessing YouTube Data API
- `STRIPE_SECRET_KEY`: Your Stripe secret key for payment processing
- `STRIPE_MONTHLY_PRICE_ID`: Your Stripe price ID for monthly subscription
- `ELEVENLABS_API_KEY`: Your ElevenLabs API key for voice generation

### S3 Storage Configuration (Required for file storage)
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_REGION`: AWS region for S3 bucket (defaults to 'us-east-1')
- `S3_BUCKET_NAME`: Name of your S3 bucket for storing videos and assets

## Deployment Instructions

### Netlify Deployment

1. **Set up environment variables**:
   - Go to your Netlify site dashboard
   - Navigate to Site settings > Build & deploy > Environment
   - Add all required environment variables listed above

2. **Update netlify.toml**:
   - Ensure your netlify.toml file contains the following configuration:
   ```toml
   [build]
     command = "npm install && npm run build"
     publish = ".next"

   [build.environment]
     NETLIFY_NEXT_PLUGIN_SKIP = "true"
     NEXT_USE_NETLIFY_EDGE = "true"
     NEXT_IGNORE_PAGES_FOLDER = "true"

   [[headers]]
     for = "/*"
     [headers.values]
       Referrer-Policy = "strict-origin-when-cross-origin"
       X-Content-Type-Options = "nosniff"
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
   ```

3. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Use the build settings from netlify.toml
   - Trigger a deploy

## Common Deployment Issues and Solutions

### 1. Duplicate Page Errors

**Issue**: Build fails with "Duplicate page detected" errors.

**Solution**: 
- Ensure `NEXT_IGNORE_PAGES_FOLDER = "true"` is set in your netlify.toml
- This prevents conflicts between the app directory and pages directory

### 2. Module Not Found Errors

**Issue**: Build fails with "Module not found: Can't resolve './brand-generator'" or similar errors.

**Solution**:
- Check import paths in your code
- Ensure all imported modules exist at the specified paths
- For the specific brand-generator issue, ensure the file exists at src/app/api/channel-creator/brand-generator.js

### 3. Supabase Initialization Errors

**Issue**: Build fails with "supabaseUrl is required" error.

**Solution**:
- Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your environment
- The code now includes fallbacks for build environments, but these variables are required for production

### 4. S3 Storage Issues

**Issue**: S3 storage operations fail with "AWS credentials not configured" error.

**Solution**:
- Ensure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME are set in your environment
- The code includes proper error handling for missing credentials

### 5. OpenAI API Issues

**Issue**: Channel branding generation fails with OpenAI API errors.

**Solution**:
- Ensure OPENAI_API_KEY is set in your environment
- The code includes fallbacks to placeholder images when the API key is not available

## Testing Your Deployment

After deploying, test the following functionality:

1. **User Authentication**:
   - Test user registration and login
   - Verify email confirmation works with correct redirect URLs

2. **YouTube Channel Connection**:
   - Test connecting to a YouTube channel with an API key
   - Verify channel information is displayed correctly

3. **Video Creation**:
   - Test creating and uploading videos
   - Verify videos appear on the connected YouTube channel

4. **Storage Functionality**:
   - Test viewing and downloading stored videos
   - Verify storage usage information is displayed correctly

5. **Subscription Payments**:
   - Test subscribing to different plans
   - Verify premium features are accessible after subscription

## Troubleshooting

If you encounter issues after deployment:

1. **Check Environment Variables**:
   - Verify all required environment variables are set correctly
   - Check for typos or missing values

2. **Check Logs**:
   - Review Netlify deployment logs for errors
   - Look for specific error messages that might indicate the issue

3. **Test Locally**:
   - Run the application locally with the same environment variables
   - Verify functionality works as expected before deploying

4. **Incremental Deployment**:
   - If you're updating an existing deployment, consider deploying changes incrementally
   - Test each major feature after deployment before moving to the next
