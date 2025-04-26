# YouTube Automation Platform Documentation

## Overview

The YouTube Automation Platform is a comprehensive solution for content creators to automate their YouTube channel management, content creation, and publishing workflow. The platform supports multiple social media platforms with a focus on YouTube, and offers tiered pricing plans from free to enterprise level.

## Key Features

- **Authentication System**: Secure user authentication using Supabase
- **Multi-Platform Support**: Extensible architecture supporting YouTube, Facebook, Instagram, and more
- **Content Generation**: AI-powered content research and generation based on trending topics
- **Video Scheduling**: Automated scheduling of content across multiple platforms
- **Multi-Niche Support**: Create content for multiple industries and niches
- **Automated Channel Creation**: Premium feature for creating and branding YouTube channels
- **Enterprise Pricing**: Tiered pricing structure with advanced features for premium users

## System Architecture

The platform is built with a modular, extensible architecture designed to support multiple social media platforms:

- **Frontend**: Next.js with React components and Tailwind CSS
- **Authentication**: Supabase authentication with JWT tokens
- **API Layer**: Server-side API routes for content generation, scheduling, and analytics
- **Platform Abstraction**: Factory pattern for platform-specific implementations
- **Content Adapters**: Transform content between different platform requirements

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Supabase account for authentication
- YouTube API credentials
- OpenAI API key (for content generation)

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```
5. Start the production server:
   ```
   npm start
   ```

## User Guide

### Authentication

- **Sign Up**: Create a new account with email and password
- **Login**: Access your account with credentials
- **Account Management**: Update profile and subscription settings

### Dashboard

The dashboard provides an overview of your content performance and quick access to key features:
- Video creation statistics
- Scheduled content
- Channel performance metrics
- Subscription status

### Content Generation

1. Select content type (auto-generate or manual topics)
2. Choose content niches
3. Select target platforms
4. Configure scheduling frequency
5. Connect YouTube API or create a new channel (premium)
6. Generate content

### Channel Management

For premium users:
1. Create new YouTube channels automatically
2. Generate branding assets (logo, banner)
3. Configure channel settings
4. Manage multiple channels across different niches

### Scheduling

1. View scheduled content across all platforms
2. Edit or cancel scheduled publications
3. Create recurring schedules
4. Optimize posting times

### Analytics

Track performance metrics across all platforms:
- Views by platform
- Subscriber growth
- Top performing content
- Engagement metrics

## API Reference

### Content API

- `POST /api/content` - Content generation and management
  - `get-trending-topics`: Get trending topics in a category
  - `generate-script`: Generate video script
  - `generate-speech`: Generate voiceover
  - `create-video`: Create video from script and audio
  - `schedule-video`: Schedule video for publishing

### Channel Creator API

- `POST /api/channel-creator` - YouTube channel creation and management
  - `create-channel`: Create a new YouTube channel
  - `update-branding`: Update channel branding
  - `get-user-channels`: Get user's YouTube channels

### Brand Generator API

- `POST /api/brand-generator` - Generate branding assets
  - `generate-logo`: Generate channel logo
  - `generate-banner`: Generate channel banner
  - `generate-thumbnail`: Generate video thumbnail
  - `generate-brand-package`: Generate complete branding package

### Pricing API

- `GET /api/pricing` - Get pricing plans
- `POST /api/pricing` - Subscription management
  - `subscribe`: Subscribe to a plan
  - `cancel-subscription`: Cancel subscription
  - `change-plan`: Change subscription plan
  - `apply-coupon`: Apply coupon code

## Extensibility

The platform is designed to be extended with additional social media platforms:

1. Create a new platform implementation in `platform-api-factory.js`
2. Implement required methods for the new platform
3. Add platform-specific content adapters
4. Update UI components to include the new platform

## Troubleshooting

### Common Issues

- **API Key Validation**: Ensure YouTube API key has correct permissions
- **Content Generation Errors**: Check OpenAI API key and quota
- **Authentication Issues**: Verify Supabase configuration
- **Scheduling Problems**: Check timezone settings and platform limits

### Support

For additional support:
- Check the GitHub repository issues
- Contact support at support@tubeautomator.com
- Join our community Discord server

## Future Roadmap

- TikTok integration
- Twitter/X platform support
- Advanced analytics dashboard
- AI-powered content optimization
- Collaborative team features
- White-label solution for agencies
