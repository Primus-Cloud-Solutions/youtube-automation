# Vercel Deployment Troubleshooting Guide

This guide addresses common deployment issues with Next.js applications on Vercel.

## Issue: Warning about uploading .next directory

If you see this warning during deployment:
```
WARNING: You should not upload the `.next` directory.
```

### Why this happens
The `.next` directory contains build artifacts that should be generated during Vercel's build process, not uploaded from your local environment. Uploading this directory can cause deployment failures and inconsistencies.

### Solution

1. **Remove the .next directory from your project before deploying**
   - The `.next` directory has been removed from the project in this updated zip file

2. **Add a proper .gitignore file**
   - A `.gitignore` file has been added to the project with the following entries:
     ```
     # next.js
     /.next/
     /out/
     ```

3. **Use proper deployment methods**
   - Deploy directly from a Git repository (GitHub, GitLab, Bitbucket)
   - If uploading a zip file, ensure it doesn't contain the `.next` directory

## Other Common Deployment Issues

### Environment Variables
- Ensure all required environment variables are set in your Vercel project settings:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`

### Build Failures
- Check your `package.json` for correct build scripts
- Ensure all dependencies are properly listed
- Review build logs for specific error messages

### API Routes Not Working
- Verify your `next.config.js` has the correct configuration
- Check that API routes follow the correct pattern in `/api` directory

## Testing Your Deployment

After deploying, test the following functionality:
1. Authentication (login and signup)
2. Home page rendering with all sections
3. Navigation between pages
4. Payment system integration (if applicable)

If you encounter any issues, check the Vercel deployment logs for specific error messages.
