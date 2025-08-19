/**
 * Analytics-enabled Button Component
 * Automatically tracks CTA clicks and conversions
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics, useInteractionTracking } from '../hooks/useAnalytics';

export interface AnalyticsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  ctaName: string;
  ctaLocation: string;
  conversionValue?: number;
  trackAsConversion?: boolean;
  additionalAnalyticsData?: Record<string, any>;
  className?: string;
}

export const AnalyticsButton = forwardRef<HTMLButtonElement, AnalyticsButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    ctaName,
    ctaLocation,
    conversionValue,
    trackAsConversion = true,
    additionalAnalyticsData = {},
    className = '',
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...props
  }, ref) => {
    const { trackCTAClick, trackConversion } = useAnalytics({ 
      trackPageView: false, 
      trackScrollDepth: false 
    });
    const { trackClick, trackHover } = useInteractionTracking();

    // Base styles for different variants
    const variantStyles = {
      primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl',
      secondary: 'bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 shadow-md hover:shadow-lg',
      outline: 'border-2 border-white text-white hover:bg-white hover:text-orange-600 shadow-md hover:shadow-lg',
      ghost: 'text-orange-600 hover:bg-orange-50 hover:text-orange-700',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Track CTA click
      trackCTAClick(ctaName, ctaLocation, {
        variant,
        size,
        timestamp: Date.now(),
        ...additionalAnalyticsData,
      });

      // Track as conversion if enabled
      if (trackAsConversion) {
        trackConversion({
          eventName: 'cta_conversion',
          conversionValue,
          customParameters: {
            cta_name: ctaName,
            cta_location: ctaLocation,
            variant,
            size,
            ...additionalAnalyticsData,
          },
        });
      }

      // Track generic click interaction
      trackClick(`${ctaName}_button`, {
        location: ctaLocation,
        variant,
        size,
      });

      // Call original onClick handler
      if (onClick) {
        onClick(event);
      }
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
      const hoverStartTime = Date.now();
      
      // Store hover start time for duration calculation
      (event.currentTarget as any)._hoverStartTime = hoverStartTime;

      if (onMouseEnter) {
        onMouseEnter(event);
      }
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
      const hoverStartTime = (event.currentTarget as any)._hoverStartTime;
      if (hoverStartTime) {
        const hoverDuration = Date.now() - hoverStartTime;
        trackHover(`${ctaName}_button`, hoverDuration);
      }

      if (onMouseLeave) {
        onMouseLeave(event);
      }
    };

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnalyticsButton.displayName = 'AnalyticsButton';