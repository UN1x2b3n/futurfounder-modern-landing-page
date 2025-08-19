import React from 'react';
import { motion } from 'motion/react';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

const variantClasses = {
  default: 'card',
  gradient: 'card card-gradient',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl',
  elevated: 'card shadow-2xl'
};

export function ModernCard({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  delay = 0,
  ...props
}: ModernCardProps) {
  const baseClasses = `${variantClasses[variant]} ${className}`;
  
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { 
      duration: 0.6, 
      delay,
      ease: 'easeOut'
    },
    ...(hover && {
      whileHover: { 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }
    }),
    ...(onClick && {
      whileTap: { scale: 0.98 }
    })
  };

  return (
    <motion.div
      className={`${baseClasses} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ModernCardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12'
};

export function ModernCardContent({
  children,
  className = '',
  padding = 'lg',
  ...props
}: ModernCardContentProps) {
  return (
    <div 
      className={`${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface ModernCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardHeader({
  children,
  className = '',
  ...props
}: ModernCardHeaderProps) {
  return (
    <div 
      className={`px-8 pt-8 pb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface ModernCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardFooter({
  children,
  className = '',
  ...props
}: ModernCardFooterProps) {
  return (
    <div 
      className={`px-8 pb-8 pt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}