import React from 'react';

interface ResponsiveTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'hero' | 'title' | 'subtitle' | 'heading' | 'subheading' | 'body' | 'caption' | 'small';
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const typographyVariants = {
  hero: {
    fontSize: 'clamp(3rem, 8vw, 8rem)',
    lineHeight: 'clamp(3.2rem, 8.5vw, 8.5rem)',
    fontWeight: '700',
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    lineHeight: 'clamp(2.8rem, 6.5vw, 5.5rem)',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
    lineHeight: 'clamp(1.5rem, 3.5vw, 2.5rem)',
    fontWeight: '600',
  },
  heading: {
    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
    lineHeight: 'clamp(1.8rem, 4.5vw, 3.5rem)',
    fontWeight: '600',
  },
  subheading: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    lineHeight: 'clamp(1.4rem, 3vw, 2rem)',
    fontWeight: '500',
  },
  body: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    lineHeight: 'clamp(1.5rem, 3.5vw, 1.875rem)',
    fontWeight: '400',
  },
  caption: {
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    lineHeight: 'clamp(1.25rem, 2.5vw, 1.5rem)',
    fontWeight: '400',
  },
  small: {
    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    lineHeight: 'clamp(1rem, 2vw, 1.25rem)',
    fontWeight: '400',
  },
};

export function ResponsiveText({
  as: Component = 'div',
  variant = 'body',
  className = '',
  children,
  style = {},
  ...props
}: ResponsiveTextProps) {
  const variantStyles = typographyVariants[variant];

  return (
    <Component
      className={className}
      style={{
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}