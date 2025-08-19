import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface TouchFriendlyProps {
  children: React.ReactNode;
  className?: string;
  minTouchTarget?: number;
  enhanceForMobile?: boolean;
  as?: keyof JSX.IntrinsicElements;
  onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
  onTouchStart?: (event: React.TouchEvent) => void;
  onTouchEnd?: (event: React.TouchEvent) => void;
  disabled?: boolean;
  'aria-label'?: string;
  role?: string;
  tabIndex?: number;
}

export function TouchFriendly({
  children,
  className = '',
  minTouchTarget = 44, // 44px is the minimum recommended touch target size
  enhanceForMobile = true,
  as: Component = 'div',
  onClick,
  onTouchStart,
  onTouchEnd,
  disabled = false,
  'aria-label': ariaLabel,
  role,
  tabIndex,
  ...props
}: TouchFriendlyProps) {
  const { isMobile } = useResponsive();

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(event);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled) return;
    onTouchStart?.(event);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (disabled) return;
    onTouchEnd?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as any);
    }
  };

  const touchFriendlyStyles = enhanceForMobile && isMobile ? {
    minHeight: `${minTouchTarget}px`,
    minWidth: `${minTouchTarget}px`,
    padding: isMobile ? '12px' : undefined,
    cursor: onClick ? 'pointer' : undefined,
  } : {
    cursor: onClick ? 'pointer' : undefined,
  };

  const combinedClassName = [
    className,
    onClick ? 'select-none' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    enhanceForMobile && isMobile ? 'touch-manipulation' : '',
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={combinedClassName}
      style={touchFriendlyStyles}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={onClick ? handleKeyDown : undefined}
      aria-label={ariaLabel}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={onClick ? (tabIndex ?? 0) : tabIndex}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Touch-friendly button component with enhanced mobile interactions
 */
export function TouchButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: TouchFriendlyProps & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const { isMobile } = useResponsive();

  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
    ghost: 'text-orange-500 hover:bg-orange-50',
  };

  const sizeClasses = {
    sm: isMobile ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-sm',
    md: isMobile ? 'px-6 py-4 text-base' : 'px-4 py-2 text-base',
    lg: isMobile ? 'px-8 py-5 text-lg' : 'px-6 py-3 text-lg',
  };

  const buttonClassName = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
    'active:scale-95',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ');

  return (
    <TouchFriendly
      as="button"
      className={buttonClassName}
      enhanceForMobile={true}
      {...props}
    >
      {children}
    </TouchFriendly>
  );
}