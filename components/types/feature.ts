import { LucideIcon } from 'lucide-react';

/**
 * Interface for a single feature item
 */
export interface FeatureItem {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Tailwind gradient classes (e.g., "from-orange-500 to-pink-600") */
  gradient: string;
}

/**
 * Props for the FeatureCard component
 */
export interface FeatureCardProps extends FeatureItem {
  /** Animation delay in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for the FeatureGrid component
 */
export interface FeatureGridProps {
  /** Array of feature items to display */
  features: FeatureItem[];
  /** Optional section title */
  title?: string;
  /** Optional section subtitle */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}