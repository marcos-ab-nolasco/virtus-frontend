import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'neutral';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full font-medium';

  const variantStyles = {
    success: 'bg-secondary-100 text-secondary-800',
    error: 'bg-error-100 text-error-800',
    warning: 'bg-warning-100 text-warning-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
  };

  return (
    <span
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
