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
    primary: 'bg-aqua-50 text-aqua-800 border-aqua-200/80',
    coral: 'bg-coral-50 text-coral-600 border-coral-200/80',
    gold: 'bg-amber-50 text-amber-800 border-amber-200/80',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    specimen: 'bg-gradient-to-r from-ocean-900 to-ocean-800 text-aqua-300 border-aqua-400/40 shadow-sm',
    dark: 'bg-ocean-950 text-white border-ocean-800',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium rounded',
    sm: 'text-xs px-2 py-0.5 font-semibold rounded-md',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-lg',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
