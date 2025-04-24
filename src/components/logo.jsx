import React from 'react';
import { Youtube } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg flex items-center justify-center">
        <Youtube className="text-white" style={{ width: size * 0.75, height: size * 0.75 }} />
      </div>
    </div>
  );
};

export default Logo;
