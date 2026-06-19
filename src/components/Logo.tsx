import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'light',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const bgColor = variant === 'light' 
    ? 'bg-gradient-to-br from-purple-400 to-purple-700' 
    : 'bg-gradient-to-br from-purple-600 to-purple-900';

  const textColor = variant === 'light' ? 'text-white' : 'text-purple-900';

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} ${bgColor} rounded-lg flex items-center justify-center shadow-lg`}>
        <span className={`${textSizeClasses[size]} font-bold text-white`}>
          SL
        </span>
      </div>
      {showText && (
        <div className={`font-bold ${textColor}`}>
          <div className="text-sm font-semibold">Smart Line</div>
          <div className="text-xs opacity-75">User</div>
        </div>
      )}
    </div>
  );
};

export default Logo;