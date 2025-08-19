/**
 * React hook for analytics integration
 * Provides easy-to-use analytics functions for React components
 */

import { useEffect, useCallback, useRef } from 'react';
import { 
  analytics, 
  trackEvent, 
  trackConversion, 
  trackCTAClick, 
  trackFormSubmission,
  trackScrollDepth,
  getABTestVariant,
  trackABTestConversion,
  type AnalyticsEvent,
  type ConversionEvent,
  type ABTestVariant
} from '../utils/analytics';

export interface UseAnalyticsOptions {
  trackPageView?: boolean;
  trackScrollDepth?: boolean;
  scrollDepthThresholds?: number[];
}

export interface UseAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => void;
  trackConversion: (conversion: ConversionEvent) => void;
  trackCTAClick: (ctaName: string, location: string, additionalData?: Record<string, any>) => void;
  trackFormSubmission: (formName: string, success: boolean, additionalData?: Record<string, any>) => void;
  getABTestVariant: (testId: string, variants: string[]) => ABTestVariant;
  trackABTestConversion: (testId: string, conversionType: string) => void;
  isAnalyticsReady: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const {
    trackPageView = true,
    trackScrollDepth = true,
    scrollDepthThresholds = [25, 50, 75, 90, 100]
  } = options;

  const isAnalyticsReady = useRef(false);
  const scrollDepthTracked = useRef(new Set<number>());

  // Initialize analytics on mount
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        await analytics.initialize();
        isAnalyticsReady.current = true;
        
        // Track initial page view
        if (trackPageView) {
          analytics.trackPageView();
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };

    initializeAnalytics();
  }, [trackPageView]);

  // Set up scroll depth tracking
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // Track scroll depth milestones
      scrollDepthThresholds.forEach(threshold => {
        if (scrollPercentage >= threshold && !scrollDepthTracked.current.has(threshold)) {
          scrollDepthTracked.current.add(threshold);
          analytics.trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth, scrollDepthThresholds]);

  // Memoized analytics functions
  const analyticsAPI = {
    trackEvent: useCallback((event: AnalyticsEvent) => {
      trackEvent(event);
    }, []),

    trackConversion: useCallback((conversion: ConversionEvent) => {
      trackConversion(conversion);
    }, []),

    trackCTAClick: useCallback((ctaName: string, location: string, additionalData?: Record<string, any>) => {
      trackCTAClick(ctaName, location, additionalData);
    }, []),

    trackFormSubmission: useCallback((formName: string, success: boolean, additionalData?: Record<string, any>) => {
      trackFormSubmission(formName, success, additionalData);
    }, []),

    getABTestVariant: useCallback((testId: string, variants: string[]) => {
      return getABTestVariant(testId, variants);
    }, []),

    trackABTestConversion: useCallback((testId: string, conversionType: string) => {
      trackABTestConversion(testId, conversionType);
    }, []),

    isAnalyticsReady: isAnalyticsReady.current
  };

  return analyticsAPI;
}

/**
 * Hook for tracking component visibility
 */
export function useVisibilityTracking(
  elementRef: React.RefObject<HTMLElement>,
  eventName: string,
  category: string = 'visibility'
) {
  const { trackEvent } = useAnalytics({ trackPageView: false, trackScrollDepth: false });
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!elementRef.current || hasTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            trackEvent({
              action: 'element_visible',
              category,
              label: eventName,
              customParameters: {
                element_name: eventName,
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
  }, [elementRef, eventName, category, trackEvent]);
}

/**
 * Hook for tracking user interactions with elements
 */
export function useInteractionTracking() {
  const { trackEvent } = useAnalytics({ trackPageView: false, trackScrollDepth: false });

  const trackClick = useCallback((elementName: string, additionalData?: Record<string, any>) => {
    trackEvent({
      action: 'click',
      category: 'interaction',
      label: elementName,
      customParameters: {
        element_name: elementName,
        timestamp: Date.now(),
        ...additionalData,
      },
    });
  }, [trackEvent]);

  const trackHover = useCallback((elementName: string, duration?: number) => {
    trackEvent({
      action: 'hover',
      category: 'interaction',
      label: elementName,
      value: duration,
      customParameters: {
        element_name: elementName,
        hover_duration: duration,
        timestamp: Date.now(),
      },
    });
  }, [trackEvent]);

  const trackFocus = useCallback((elementName: string) => {
    trackEvent({
      action: 'focus',
      category: 'interaction',
      label: elementName,
      customParameters: {
        element_name: elementName,
        timestamp: Date.now(),
      },
    });
  }, [trackEvent]);

  return {
    trackClick,
    trackHover,
    trackFocus,
  };
}

/**
 * Hook for A/B testing
 */
export function useABTest(testId: string, variants: string[]) {
  const { getABTestVariant, trackABTestConversion } = useAnalytics({ 
    trackPageView: false, 
    trackScrollDepth: false 
  });
  
  const variant = getABTestVariant(testId, variants);

  const trackConversion = useCallback((conversionType: string) => {
    trackABTestConversion(testId, conversionType);
  }, [testId, trackABTestConversion]);

  return {
    variant: variant.variantId,
    variantName: variant.variantName,
    trackConversion,
  };
}