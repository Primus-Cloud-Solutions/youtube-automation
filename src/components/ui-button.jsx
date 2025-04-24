import React from 'react';

// Simple button component with improved styling
const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      case 'outline':
        return 'bg-transparent border border-primary text-primary hover:bg-primary/10';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  return (
    <button 
      onClick={onClick} 
      className={`button ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
      
      <style jsx>{`
        .button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .button:hover {
          transform: translateY(-1px);
        }
        .button:active {
          transform: translateY(0);
        }
        .bg-primary {
          background-color: #3b82f6;
        }
        .text-primary-foreground {
          color: white;
        }
        .bg-secondary {
          background-color: #8b5cf6;
        }
        .text-secondary-foreground {
          color: white;
        }
        .bg-destructive {
          background-color: #ef4444;
        }
        .text-destructive-foreground {
          color: white;
        }
        .border-primary {
          border-color: #3b82f6;
        }
        .text-primary {
          color: #3b82f6;
        }
      `}</style>
    </button>
  );
};

export default Button;
