/**
 * Analytics Provider Component
 * Provides analytics configuration and initialization for the entire app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { analytics, type AnalyticsConfig } from './utils/analytics';

interface AnalyticsContextType {
  isInitialized: boolean;
  config: AnalyticsConfig;
  updateConfig: (newConfig: Partial<AnalyticsConfig>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
}

export function AnalyticsProvider({ children, config = {} }: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig>({
    // Default configuration - these should be set via environment variables in production
    googleAnalyticsId: process.env.REACT_APP_GA_ID || 'G-XXXXXXXXXX',
    hotjarId: process.env.REACT_APP_HOTJAR_ID || '1234567',
    enableHeatmaps: true,
    enableConversionTracking: true,
    enablePerformanceMonitoring: true,
    enableABTesting: true,
    debug: process.env.NODE_ENV === 'development',
    ...config,
  });

  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Update analytics configuration
        (analytics as any).config = analyticsConfig;
        
        // Initialize analytics
        await analytics.initialize();
        setIsInitialized(true);
        
        console.log('Analytics initialized successfully');
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };

    initializeAnalytics();
  }, [analyticsConfig]);

  const updateConfig = (newConfig: Partial<AnalyticsConfig>) => {
    setAnalyticsConfig(prev => ({ ...prev, ...newConfig }));
  };

  const contextValue: AnalyticsContextType = {
    isInitialized,
    config: analyticsConfig,
    updateConfig,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

/**
 * Higher-order component for analytics tracking
 */
export function withAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  trackingOptions?: {
    componentName?: string;
    trackVisibility?: boolean;
    trackInteractions?: boolean;
  }
) {
  const { componentName, trackVisibility = false, trackInteractions = false } = trackingOptions || {};
  
  return function AnalyticsWrappedComponent(props: P) {
    const elementRef = React.useRef<HTMLDivElement>(null);
    const { isInitialized } = useAnalyticsContext();

    // Track component mount
    useEffect(() => {
      if (isInitialized && componentName) {
        analytics.trackEvent({
          action: 'component_mount',
          category: 'component_lifecycle',
          label: componentName,
        });
      }
    }, [isInitialized]);

    // Track component visibility
    useEffect(() => {
      if (!trackVisibility || !isInitialized || !componentName || !elementRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              analytics.trackEvent({
                action: 'component_visible',
                category: 'component_visibility',
                label: componentName,
                customParameters: {
                  visibility_ratio: entry.intersectionRatio,
                },
              });
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(elementRef.current);

      return () => {
        observer.disconnect();
      };
    }, [isInitialized, trackVisibility, componentName]);

    // Track interactions
    const handleClick = (event: React.MouseEvent) => {
      if (trackInteractions && isInitialized && componentName) {
        analytics.trackEvent({
          action: 'component_click',
          category: 'component_interaction',
          label: componentName,
          customParameters: {
            target_element: (event.target as HTMLElement).tagName.toLowerCase(),
          },
        });
      }
    };

    return (
      <div 
        ref={elementRef} 
        onClick={handleClick}
        style={{ display: 'contents' }}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
}