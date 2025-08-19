/**
 * A/B Testing Components and Utilities
 * Provides easy-to-use A/B testing functionality with analytics integration
 */

import React, { useMemo } from 'react';
import { useABTest } from '../hooks/useAnalytics';

export interface ABTestProps {
  testId: string;
  variants: Record<string, React.ReactNode>;
  defaultVariant?: string;
  children?: (variant: string) => React.ReactNode;
}

export interface ABTestButtonProps {
  testId: string;
  variants: Record<string, {
    text: string;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
  }>;
  onClick?: (variant: string) => void;
  className?: string;
}

export interface ABTestContentProps {
  testId: string;
  variants: Record<string, {
    title?: string;
    description?: string;
    content?: React.ReactNode;
  }>;
}

/**
 * Generic A/B Test Component
 * Renders different variants based on the test configuration
 */
export function ABTest({ testId, variants, defaultVariant, children }: ABTestProps) {
  const { variant, trackConversion } = useABTest(testId, Object.keys(variants));

  // Get the content for the current variant
  const content = useMemo(() => {
    if (children) {
      return children(variant);
    }
    
    return variants[variant] || variants[defaultVariant || Object.keys(variants)[0]];
  }, [variant, variants, defaultVariant, children]);

  // Provide conversion tracking function to child components
  const contextValue = {
    variant,
    testId,
    trackConversion,
  };

  return (
    <ABTestContext.Provider value={contextValue}>
      {content}
    </ABTestContext.Provider>
  );
}

/**
 * A/B Test Button Component
 * Tests different button styles and text
 */
export function ABTestButton({ testId, variants, onClick, className = '' }: ABTestButtonProps) {
  const { variant, trackConversion } = useABTest(testId, Object.keys(variants));
  const variantConfig = variants[variant];

  const handleClick = () => {
    // Track conversion for this test
    trackConversion('button_click');
    
    // Call the provided onClick handler
    if (onClick) {
      onClick(variant);
    }
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600',
    secondary: 'bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50',
  };

  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/50';
  const variantStyle = variantStyles[variantConfig.variant || 'primary'];

  return (
    <button
      className={`${baseStyles} ${variantStyle} ${variantConfig.className || ''} ${className}`}
      onClick={handleClick}
    >
      {variantConfig.text}
    </button>
  );
}

/**
 * A/B Test Content Component
 * Tests different content variations
 */
export function ABTestContent({ testId, variants }: ABTestContentProps) {
  const { variant, trackConversion } = useABTest(testId, Object.keys(variants));
  const variantConfig = variants[variant];

  // Track when content is viewed
  React.useEffect(() => {
    trackConversion('content_view');
  }, [trackConversion]);

  return (
    <div className="space-y-4">
      {variantConfig.title && (
        <h3 className="text-2xl font-bold text-gray-900">
          {variantConfig.title}
        </h3>
      )}
      {variantConfig.description && (
        <p className="text-gray-600 leading-relaxed">
          {variantConfig.description}
        </p>
      )}
      {variantConfig.content}
    </div>
  );
}

/**
 * A/B Test Hero Section Component
 * Tests different hero section variations
 */
export interface ABTestHeroProps {
  testId: string;
  variants: Record<string, {
    title: string;
    subtitle?: string;
    description: string;
    ctaText: string;
    ctaVariant?: 'primary' | 'secondary' | 'outline';
    backgroundGradient?: string;
  }>;
  onCTAClick?: (variant: string) => void;
}

export function ABTestHero({ testId, variants, onCTAClick }: ABTestHeroProps) {
  const { variant, trackConversion } = useABTest(testId, Object.keys(variants));
  const variantConfig = variants[variant];

  const handleCTAClick = () => {
    trackConversion('hero_cta_click');
    if (onCTAClick) {
      onCTAClick(variant);
    }
  };

  const backgroundClass = variantConfig.backgroundGradient || 'bg-gradient-to-br from-orange-500 via-pink-500 to-red-600';

  return (
    <section className={`${backgroundClass} text-white min-h-screen flex items-center`}>
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {variantConfig.title}
        </h1>
        
        {variantConfig.subtitle && (
          <p className="text-xl md:text-2xl mb-4 text-orange-100">
            {variantConfig.subtitle}
          </p>
        )}
        
        <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto text-orange-100/90 leading-relaxed">
          {variantConfig.description}
        </p>
        
        <ABTestButton
          testId={`${testId}_cta`}
          variants={{
            [variant]: {
              text: variantConfig.ctaText,
              variant: variantConfig.ctaVariant || 'secondary',
            }
          }}
          onClick={handleCTAClick}
          className="text-lg px-8 py-4"
        />
      </div>
    </section>
  );
}

/**
 * A/B Test Pricing Component
 * Tests different pricing presentations
 */
export interface ABTestPricingProps {
  testId: string;
  variants: Record<string, {
    title: string;
    price: string;
    features: string[];
    ctaText: string;
    highlight?: boolean;
  }>;
  onCTAClick?: (variant: string) => void;
}

export function ABTestPricing({ testId, variants, onCTAClick }: ABTestPricingProps) {
  const { variant, trackConversion } = useABTest(testId, Object.keys(variants));
  const variantConfig = variants[variant];

  const handleCTAClick = () => {
    trackConversion('pricing_cta_click');
    if (onCTAClick) {
      onCTAClick(variant);
    }
  };

  return (
    <div className={`p-8 rounded-2xl border-2 ${variantConfig.highlight ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'} shadow-lg`}>
      <h3 className="text-2xl font-bold mb-4">{variantConfig.title}</h3>
      <div className="text-4xl font-bold text-orange-600 mb-6">{variantConfig.price}</div>
      
      <ul className="space-y-3 mb-8">
        {variantConfig.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <button
        onClick={handleCTAClick}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
          variantConfig.highlight 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {variantConfig.ctaText}
      </button>
    </div>
  );
}

// Context for A/B test data
const ABTestContext = React.createContext<{
  variant: string;
  testId: string;
  trackConversion: (conversionType: string) => void;
} | null>(null);

/**
 * Hook to access A/B test context
 */
export function useABTestContext() {
  const context = React.useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTestContext must be used within an ABTest component');
  }
  return context;
}

/**
 * Higher-order component for A/B testing
 */
export function withABTest<P extends object>(
  testId: string,
  variants: string[],
  WrappedComponent: React.ComponentType<P & { variant: string; trackConversion: (type: string) => void }>
) {
  return function ABTestWrappedComponent(props: P) {
    const { variant, trackConversion } = useABTest(testId, variants);
    
    return (
      <WrappedComponent
        {...props}
        variant={variant}
        trackConversion={trackConversion}
      />
    );
  };
}