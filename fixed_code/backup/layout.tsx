import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TubeAutomator - AI-Powered YouTube Content Creation",
  description: "Create, schedule, and optimize YouTube videos with our AI-powered platform. Save time and grow your channel faster.",
  keywords: "YouTube automation, AI content creation, video generation, content scheduling",
  authors: [{ name: "TubeAutomator Team" }],
  openGraph: {
    title: "TubeAutomator - AI-Powered YouTube Content Creation",
    description: "Create, schedule, and optimize YouTube videos with our AI-powered platform. Save time and grow your channel faster.",
    url: "https://video-automation.netlify.app/",
    siteName: "TubeAutomator",
    images: [
      {
        url: "https://video-automation.netlify.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TubeAutomator - AI-Powered YouTube Content Creation"
      }
    ],
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-gray-900 text-white`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
