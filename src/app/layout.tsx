import React from 'react';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>TubeAutomator - YouTube Automation Platform</title>
        <meta name="description" content="Create, schedule, and publish engaging YouTube videos with AI-powered automation" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {/* Stars background animation */}
        <div className="stars" id="stars"></div>
        
        {/* Main content */}
        {children}
        
        {/* Stars animation script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            function createStars() {
              const stars = document.getElementById('stars');
              if (!stars) return;
              
              const count = 100;
              
              for (let i = 0; i < count; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Random position
                star.style.left = \`\${Math.random() * 100}%\`;
                star.style.top = \`\${Math.random() * 100}%\`;
                
                // Random size
                const size = Math.random() * 2 + 1;
                star.style.width = \`\${size}px\`;
                star.style.height = \`\${size}px\`;
                
                // Random animation delay
                star.style.animationDelay = \`\${Math.random() * 4}s\`;
                
                stars.appendChild(star);
              }
            }
            
            // Run on page load
            document.addEventListener('DOMContentLoaded', createStars);
          `
        }} />
      </body>
    </html>
  );
}
