import React from 'react';
import { Code2 } from 'lucide-react';

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
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const bgColor = 'bg-gradient-to-br from-primary via-primary to-accent';
  const textColor = variant === 'light' ? 'text-white' : 'text-foreground';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${sizeClasses[size]} ${bgColor} rounded-xl flex items-center justify-center shadow-lg shadow-primary/20`}>
        <Code2 className={`${iconSizeClasses[size]} text-white`} />
      </div>
      {showText && (
        <div className={`font-bold leading-tight ${textColor}`}>
          <div className="text-base font-extrabold tracking-wide">أكواد</div>
          <div className="text-[10px] opacity-75 font-medium">منصة التعلم</div>
        </div>
      )}
    </div>
  );
};

export default Logo;