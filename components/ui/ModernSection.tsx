import React from 'react';
import { motion } from 'motion/react';

interface ModernSectionProps {
  children: React.ReactNode;
  id?: string;
  variant?: 'default' | 'hero' | 'feature' | 'testimonial' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  background?: 'white' | 'gray' | 'gradient' | 'transparent';
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const variantClasses = {
  default: 'section',
  hero: 'section-hero',
  feature: 'section',
  testimonial: 'section bg-gradient-to-b from-orange-50/30 to-pink-50/30',
  cta: 'section bg-gradient-hero text-white'
};

const sizeClasses = {
  sm: 'section-sm',
  md: 'section',
  lg: 'section-lg'
};

const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  gradient: 'bg-gradient-subtle',
  transparent: 'bg-transparent'
};

const containerClasses = {
  sm: 'container container-sm',
  md: 'container container-md',
  lg: 'container container-lg',
  xl: 'container container-xl',
  '2xl': 'container container-2xl',
  full: 'container'
};

export function ModernSection({
  children,
  id,
  variant = 'default',
  size = 'md',
  background = 'transparent',
  className = '',
  containerSize = 'xl',
  ...props
}: ModernSectionProps) {
  const sectionClasses = `
    ${variantClasses[variant]} 
    ${variant === 'default' ? sizeClasses[size] : ''} 
    ${background !== 'transparent' ? backgroundClasses[background] : ''} 
    ${className}
  `.trim();

  return (
    <section
      id={id}
      className={sectionClasses}
      {...props}
    >
      <div className={containerClasses[containerSize]}>
        {children}
      </div>
    </section>
  );
}

interface ModernSectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
}

export function ModernSectionHeader({
  title,
  subtitle,
  description,
  centered = true,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  descriptionClassName = '',
}: ModernSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${centered ? 'text-center' : ''} ${className}`}
    >
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-caption text-primary font-semibold mb-4 ${subtitleClassName}`}
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-title font-bold mb-6 text-gradient ${titleClassName}`}
      >
        {title}
      </motion.h2>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-body text-neutral-600 max-w-3xl ${centered ? 'mx-auto' : ''} ${descriptionClassName}`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

interface ModernSectionGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const gridClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
};

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12'
};

export function ModernSectionGrid({
  children,
  columns = 3,
  gap = 'lg',
  className = '',
  ...props
}: ModernSectionGridProps) {
  return (
    <div
      className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}