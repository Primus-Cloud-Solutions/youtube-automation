# YouTube Automation Platform - README

## Overview

This is a modern, space-themed YouTube automation platform that allows users to create and schedule videos automatically. The platform supports both automated content generation based on trending topics and manual topic submission, with a focus on producing human-like, high-quality content.

## Features

- **User Authentication System**: Secure login and account management
- **API Key Management**: Securely store and manage YouTube, OpenAI, and ElevenLabs API keys
- **Automated Video Scheduling**: Schedule videos to be created and uploaded automatically
- **Manual Topic Submission**: Submit specific topics for video creation
- **Video Analytics**: Track performance of your automated videos
- **Human-like Content Settings**: Adjust settings to ensure content feels natural and engaging
- **Trending Topic Detection**: Automatically identify viral-potential topics in selected categories
- **Compliance Verification**: Ensure all content meets YouTube's community guidelines

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS with custom space theme
- **UI Components**: Shadcn UI component library
- **Charts**: Recharts for analytics visualization
- **Deployment**: Multiple options (Vercel, AWS Amplify, Cloudflare Pages)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/youtube-automation-platform.git
cd youtube-automation-platform
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file with your environment variables
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-connection-string
```

4. Start the development server
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

This platform integrates with three key APIs:

1. **YouTube API**: For uploading videos and managing your channel
2. **OpenAI API**: For generating video scripts and content
3. **ElevenLabs API**: For creating natural-sounding voiceovers

You'll need to obtain API keys from each service and configure them in the platform settings.

## Deployment

See the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on deploying this application to various cloud providers.

## Project Structure

```
youtube-automation-interface/
├── migrations/              # Database migration files
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   ├── automated-scheduling.tsx
│   │   ├── manual-topic-submission.tsx
│   │   ├── api-key-setup.tsx
│   │   ├── dashboard-header.tsx
│   │   └── video-analytics.tsx
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility functions
├── .env.local               # Environment variables (create this)
├── next.config.ts           # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Customization

### Theme

The application uses a space-themed dark mode by default. You can customize the theme by modifying:

- `src/app/globals.css` - Contains theme variables and space effects
- `tailwind.config.ts` - Configure Tailwind theme settings

### Adding New Features

The modular component structure makes it easy to add new features:

1. Create a new component in `src/components/`
2. Import and use it in the relevant page
3. Add any necessary API endpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
