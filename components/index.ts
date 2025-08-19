// Feature Card System Exports
export { FeatureCard } from './FeatureCard';
export { FeatureGrid } from './FeatureGrid';
export { FeatureGridDemo } from './FeatureGridDemo';
export { featuresData } from './data/features';

// Contact and CTA Components
export { ContactForm } from './ContactForm';
export { ContactMethods } from './ContactMethods';
export { ContactSection } from './ContactSection';
export { FinalCTASection } from './FinalCTASection';

// Core Components
export { Navigation } from './Navigation';
export { ParticleBackground } from './ParticleBackground';
export { TestimonialsSection } from './TestimonialsSection';
export { AnimatedStats } from './AnimatedStats';

// Example components
export { 
  FeatureGridExample, 
  SimpleFeatureGrid, 
  CustomFeatureGrid 
} from './examples/FeatureGridExample';

// UI Components
export * from './ui';

// Hooks
export { useResponsive, useBreakpoint, useMinBreakpoint } from './hooks/useResponsive';
export { useReducedMotion } from './hooks/useReducedMotion';
export { useIntersectionObserver } from './hooks/useIntersectionObserver';

// Types
export type { FeatureItem, FeatureCardProps, FeatureGridProps } from './types/feature';