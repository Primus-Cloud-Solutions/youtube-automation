import React from 'react';

// Simple dashboard header component with improved styling
const DashboardHeader = ({ title, description }) => {
  return (
    <div className="header-container">
      <h1 className="gradient-text text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      
      <style jsx>{`
        .header-container {
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }
        .gradient-text {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default DashboardHeader;
