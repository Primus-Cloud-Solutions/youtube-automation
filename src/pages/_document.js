import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="description" content="Create, schedule, and optimize YouTube videos with our AI-powered platform. Save time and grow your channel faster." />
        <meta name="keywords" content="YouTube automation, AI content creation, video generation, content scheduling" />
        <meta name="author" content="TubeAutomator Team" />
        <meta property="og:title" content="TubeAutomator - AI-Powered YouTube Content Creation" />
        <meta property="og:description" content="Create, schedule, and optimize YouTube videos with our AI-powered platform. Save time and grow your channel faster." />
        <meta property="og:url" content="https://video-automation.netlify.app/" />
        <meta property="og:site_name" content="TubeAutomator" />
        <meta property="og:image" content="https://video-automation.netlify.app/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="TubeAutomator - AI-Powered YouTube Content Creation" />
        <meta property="og:type" content="website" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
