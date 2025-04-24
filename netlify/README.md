# Netlify Configuration for Next.js API Routes

This file contains important configuration settings to ensure that Next.js API routes work correctly when deployed to Netlify.

## Key Configuration Points

1. **Build Settings**
   - Build command: `npm install && npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NODE_OPTIONS: --max-old-space-size=4096

3. **Plugins**
   - @netlify/plugin-nextjs: Required for proper Next.js serverless functions

4. **Redirects**
   - API routes: `/api/*` → `/.netlify/functions/api/:splat`
   - Next.js data: `/_next/data/*` → `/_next/data/:splat`
   - Static assets: `/_next/static/*` → `/_next/static/:splat`

## Important Notes

- Do not use static export (`next export`) as it breaks API routes
- Ensure the Next.js plugin is enabled
- API routes must return proper JSON responses with correct Content-Type headers
