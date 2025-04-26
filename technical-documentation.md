# YouTube Automation Platform - Implementation Details

## Technical Architecture

This document provides detailed technical information about the YouTube Automation platform implementation.

## Core Components

### 1. Authentication System
- **Implementation**: Custom JWT-based authentication with localStorage persistence
- **Files**:
  - `/src/lib/auth-context.jsx`: Main authentication context provider
  - `/src/app/utils/with-auth.jsx`: HOC for protected routes
  - `/src/app/login/page.tsx`: Login interface
  - `/src/app/signup/page.tsx`: Registration interface

### 2. Content Generation System
- **Implementation**: OpenAI API integration with trend analysis
- **Files**:
  - `/src/lib/trend-analyzer.js`: Trend detection algorithms
  - `/src/app/api/content/route.js`: Content generation API endpoints
  - `/src/app/dashboard/manual-topics/page.tsx`: Manual content creation UI

### 3. Scheduling System
- **Implementation**: Recurring schedule management with database persistence
- **Files**:
  - `/src/app/api/scheduler/route.js`: Scheduling API endpoints
  - `/src/app/dashboard/topic-scheduler/page.tsx`: Schedule management UI

### 4. Storage Solution
- **Implementation**: AWS S3 integration with client-side upload capabilities
- **Files**:
  - `/src/app/api/storage/route.js`: S3 storage API endpoints
  - `/src/app/dashboard/storage/page.tsx`: Storage management UI

### 5. Subscription System
- **Implementation**: Stripe integration with tiered subscription plans
- **Files**:
  - `/src/app/api/payment/route.js`: Payment and subscription API endpoints
  - `/src/lib/payment-context.jsx`: Subscription management context
  - `/src/app/pricing/page.tsx`: Subscription plan selection UI

### 6. YouTube Integration
- **Implementation**: YouTube Data API v3 integration for uploads and analytics
- **Files**:
  - `/src/lib/youtube-api.js`: YouTube API client
  - `/src/app/api/youtube-api.js`: YouTube API endpoints

## API Endpoints

### Content API
- `POST /api/content`
  - `action: 'get-categories'` - Get available content categories
  - `action: 'generate-topic-ideas'` - Generate trending topic ideas
  - `action: 'generate-script'` - Create a video script
  - `action: 'generate-voiceover'` - Convert script to audio

### Scheduler API
- `POST /api/scheduler`
  - `action: 'create-recurring-schedule'` - Create a new schedule
  - `action: 'get-recurring-schedules'` - Get user's schedules
  - `action: 'cancel-recurring-schedule'` - Cancel a schedule
  - `action: 'get-upcoming-videos'` - Get videos scheduled for creation

### Storage API
- `POST /api/storage`
  - `action: 'get-upload-url'` - Get S3 pre-signed URL for upload
  - `action: 'get-download-url'` - Get S3 pre-signed URL for download
  - `action: 'delete-file'` - Delete a file from S3
  - `action: 'list-files'` - List files in a directory
  - `action: 'get-storage-usage'` - Get user's storage usage

### Payment API
- `POST /api/payment`
  - `action: 'get-plans'` - Get available subscription plans
  - `action: 'start-trial'` - Start a free trial
  - `action: 'create-checkout'` - Create a Stripe checkout session
  - `action: 'get-subscription'` - Get user's subscription details
  - `action: 'cancel-subscription'` - Cancel a subscription
  - `action: 'change-plan'` - Change subscription plan

### YouTube API
- `POST /api/youtube-api`
  - `action: 'validate-api-key'` - Validate YouTube API key
  - `action: 'get-channel-info'` - Get channel information
  - `action: 'get-trending-videos'` - Get trending videos
  - `action: 'upload-video'` - Upload a video to YouTube

## Database Schema

The application uses a serverless database approach with the following collections:

### Users Collection
```
{
  id: string,
  email: string,
  passwordHash: string,
  name: string,
  createdAt: timestamp,
  lastLogin: timestamp,
  youtubeApiKey: string (encrypted),
  youtubeChannelId: string,
  subscription: {
    planId: string,
    status: string,
    currentPeriodEnd: timestamp,
    cancelAtPeriodEnd: boolean
  }
}
```

### Videos Collection
```
{
  id: string,
  userId: string,
  title: string,
  description: string,
  script: string,
  category: string,
  status: string,
  createdAt: timestamp,
  publishedAt: timestamp,
  youtubeVideoId: string,
  storageKey: string,
  thumbnailUrl: string,
  duration: number,
  views: number,
  likes: number
}
```

### Schedules Collection
```
{
  id: string,
  userId: string,
  frequency: string,
  category: string,
  createdAt: timestamp,
  nextGenerationDate: timestamp,
  status: string,
  endDate: timestamp (optional)
}
```

## Environment Variables

The application requires the following environment variables:

```
# Authentication
JWT_SECRET=your_jwt_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_BASIC=price_basic_id
STRIPE_PRICE_PRO=price_pro_id
STRIPE_PRICE_ENTERPRISE=price_enterprise_id

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key (for testing only)
```

## Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- AWS account with S3 bucket created
- Stripe account for payment processing
- OpenAI API key
- ElevenLabs API key

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the required environment variables
4. Run the development server: `npm run dev`
5. Access the application at `http://localhost:3000`

### Production Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform (Vercel, Netlify, AWS, etc.)
3. Set the required environment variables in your hosting platform
4. Configure the Stripe webhook endpoint for subscription management

## Security Considerations

- All API keys are stored securely and never exposed to the client
- User passwords are hashed using bcrypt
- JWT tokens are used for authentication with appropriate expiration
- S3 pre-signed URLs are used for secure file uploads and downloads
- YouTube API keys provided by users are encrypted before storage
- HTTPS is enforced for all API requests
- Input validation is performed on all API endpoints
- Rate limiting is implemented to prevent abuse

## Performance Optimizations

- Static site generation for public pages
- Client-side rendering for dynamic dashboard components
- Image optimization for thumbnails and UI elements
- Code splitting for improved load times
- Caching of API responses where appropriate
- Lazy loading of components and assets
- Efficient database queries with proper indexing
