import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'coral' | 'gold' | 'outline' | 'specimen' | 'dark';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-900 border-blue-200',
    coral: 'bg-red-50 text-red-600 border-red-200',
    gold: 'bg-blue-100 text-blue-900 border-blue-200',
    outline: 'bg-white text-slate-900 border-slate-300',
    specimen: 'bg-blue-900 text-white border-blue-700 shadow-sm',
    dark: 'bg-slate-900 text-white border-slate-800',
  };

  const sizeStyles = {
    xs: 'text-xs px-2 py-0.5 font-medium rounded-xl',
    sm: 'text-xs px-2.5 py-0.5 font-semibold rounded-xl',
    md: 'text-xs px-3 py-1 font-semibold rounded-xl',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
