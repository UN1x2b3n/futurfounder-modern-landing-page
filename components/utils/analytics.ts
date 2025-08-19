/**
 * Analytics and Conversion Tracking Utilities
 * Provides comprehensive tracking for user interactions, conversions, and performance
 */

// Analytics configuration interface
export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  hotjarId?: string;
  enableHeatmaps: boolean;
  enableConversionTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableABTesting: boolean;
  debug: boolean;
}

// Event tracking interface
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

// Conversion event interface
export interface ConversionEvent {
  eventName: string;
  conversionValue?: number;
  currency?: string;
  transactionId?: string;
  customParameters?: Record<string, any>;
}

// Performance metrics interface
export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

// A/B test variant interface
export interface ABTestVariant {
  testId: string;
  variantId: string;
  variantName: string;
}

class AnalyticsManager {
  private config: AnalyticsConfig;
  private isInitialized = false;
  private abTestVariants: Map<string, ABTestVariant> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  /**
   * Initialize analytics services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Google Analytics
      if (this.config.googleAnalyticsId) {
        await this.initializeGoogleAnalytics();
      }

      // Initialize Hotjar for heatmaps
      if (this.config.hotjarId && this.config.enableHeatmaps) {
        this.initializeHotjar();
      }

      // Initialize performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        this.initializePerformanceMonitoring();
      }

      // Initialize A/B testing
      if (this.config.enableABTesting) {
        this.initializeABTesting();
      }

      this.isInitialized = true;
      this.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', this.config.googleAnalyticsId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.log('Google Analytics initialized');
  }

  /**
   * Initialize Hotjar for heatmap tracking
   */
  private initializeHotjar(): void {
    (window as any).hj = (window as any).hj || function() {
      ((window as any).hj.q = (window as any).hj.q || []).push(arguments);
    };
    (window as any)._hjSettings = { hjid: this.config.hotjarId, hjsv: 6 };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${this.config.hotjarId}.js?sv=6`;
    document.head.appendChild(script);

    this.log('Hotjar initialized');
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor custom performance metrics
    this.monitorCustomMetrics();

    this.log('Performance monitoring initialized');
  }

  /**
   * Initialize A/B testing framework
   */
  private initializeABTesting(): void {
    // Load A/B test configurations from localStorage or API
    this.loadABTestConfigurations();
    this.log('A/B testing framework initialized');
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      this.log('Analytics not initialized, queuing event:', event);
      return;
    }

    try {
      // Track with Google Analytics
      if (this.config.googleAnalyticsId && (window as any).gtag) {
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          ...event.customParameters,
        });
      }

      // Track with Hotjar
      if (this.config.enableHeatmaps && (window as any).hj) {
        (window as any).hj('event', event.action);
      }

      this.log('Event tracked:', event);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Track conversion events
   */
  trackConversion(conversion: ConversionEvent): void {
    if (!this.isInitialized || !this.config.enableConversionTracking) return;

    try {
      // Track conversion with Google Analytics
      if (this.config.googleAnalyticsId && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: this.config.googleAnalyticsId,
          event_category: 'conversion',
          event_label: conversion.eventName,
          value: conversion.conversionValue,
          currency: conversion.currency || 'USD',
          transaction_id: conversion.transactionId,
          ...conversion.customParameters,
        });
      }

      this.log('Conversion tracked:', conversion);
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  }

  /**
   * Track CTA button clicks
   */
  trackCTAClick(ctaName: string, location: string, additionalData?: Record<string, any>): void {
    this.trackEvent({
      action: 'cta_click',
      category: 'engagement',
      label: `${ctaName}_${location}`,
      customParameters: {
        cta_name: ctaName,
        cta_location: location,
        ...additionalData,
      },
    });

    // Track as conversion
    this.trackConversion({
      eventName: 'cta_click',
      customParameters: {
        cta_name: ctaName,
        cta_location: location,
        ...additionalData,
      },
    });
  }

  /**
   * Track form submissions
   */
  trackFormSubmission(formName: string, success: boolean, additionalData?: Record<string, any>): void {
    this.trackEvent({
      action: 'form_submission',
      category: 'engagement',
      label: `${formName}_${success ? 'success' : 'error'}`,
      value: success ? 1 : 0,
      customParameters: {
        form_name: formName,
        success,
        ...additionalData,
      },
    });

    // Track successful submissions as conversions
    if (success) {
      this.trackConversion({
        eventName: 'form_submission',
        conversionValue: 1,
        customParameters: {
          form_name: formName,
          ...additionalData,
        },
      });
    }
  }

  /**
   * Track page views
   */
  trackPageView(pagePath?: string, pageTitle?: string): void {
    if (!this.isInitialized) return;

    try {
      if (this.config.googleAnalyticsId && (window as any).gtag) {
        (window as any).gtag('config', this.config.googleAnalyticsId, {
          page_path: pagePath || window.location.pathname,
          page_title: pageTitle || document.title,
        });
      }

      this.log('Page view tracked:', { pagePath, pageTitle });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth: number): void {
    this.trackEvent({
      action: 'scroll_depth',
      category: 'engagement',
      label: `${depth}%`,
      value: depth,
    });
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const lcp = entry.startTime;
        this.trackPerformanceMetric('lcp', lcp);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        this.trackPerformanceMetric('fid', fid);
      }
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.trackPerformanceMetric('cls', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Monitor custom performance metrics
   */
  private monitorCustomMetrics(): void {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.trackPerformanceMetric('page_load_time', loadTime);
    });

    // Track DOM content loaded time
    document.addEventListener('DOMContentLoaded', () => {
      const domLoadTime = performance.now();
      this.trackPerformanceMetric('dom_load_time', domLoadTime);
    });
  }

  /**
   * Track performance metrics
   */
  private trackPerformanceMetric(metric: string, value: number): void {
    this.trackEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metric,
      value: Math.round(value),
      customParameters: {
        metric_name: metric,
        metric_value: value,
      },
    });
  }

  /**
   * Load A/B test configurations
   */
  private loadABTestConfigurations(): void {
    // In a real implementation, this would load from an API or configuration service
    // For now, we'll use localStorage for persistence
    const savedTests = localStorage.getItem('ab_test_variants');
    if (savedTests) {
      try {
        const tests = JSON.parse(savedTests);
        Object.entries(tests).forEach(([testId, variant]) => {
          this.abTestVariants.set(testId, variant as ABTestVariant);
        });
      } catch (error) {
        console.error('Failed to load A/B test configurations:', error);
      }
    }
  }

  /**
   * Get A/B test variant for a test
   */
  getABTestVariant(testId: string, variants: string[]): ABTestVariant {
    // Check if user already has a variant assigned
    let existingVariant = this.abTestVariants.get(testId);
    
    if (!existingVariant) {
      // Assign a random variant
      const randomIndex = Math.floor(Math.random() * variants.length);
      const variantId = variants[randomIndex];
      
      existingVariant = {
        testId,
        variantId,
        variantName: variantId,
      };
      
      this.abTestVariants.set(testId, existingVariant);
      
      // Persist to localStorage
      const allVariants = Object.fromEntries(this.abTestVariants);
      localStorage.setItem('ab_test_variants', JSON.stringify(allVariants));
      
      // Track the assignment
      this.trackEvent({
        action: 'ab_test_assignment',
        category: 'experiment',
        label: `${testId}_${variantId}`,
        customParameters: {
          test_id: testId,
          variant_id: variantId,
        },
      });
    }
    
    return existingVariant;
  }

  /**
   * Track A/B test conversion
   */
  trackABTestConversion(testId: string, conversionType: string): void {
    const variant = this.abTestVariants.get(testId);
    if (!variant) return;

    this.trackEvent({
      action: 'ab_test_conversion',
      category: 'experiment',
      label: `${testId}_${variant.variantId}_${conversionType}`,
      customParameters: {
        test_id: testId,
        variant_id: variant.variantId,
        conversion_type: conversionType,
      },
    });
  }

  /**
   * Log debug messages
   */
  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[Analytics] ${message}`, data || '');
    }
  }
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enableHeatmaps: true,
  enableConversionTracking: true,
  enablePerformanceMonitoring: true,
  enableABTesting: true,
  debug: process.env.NODE_ENV === 'development',
};

// Create and export analytics instance
export const analytics = new AnalyticsManager(defaultConfig);

// Export utility functions
export const trackEvent = (event: AnalyticsEvent) => analytics.trackEvent(event);
export const trackConversion = (conversion: ConversionEvent) => analytics.trackConversion(conversion);
export const trackCTAClick = (ctaName: string, location: string, additionalData?: Record<string, any>) => 
  analytics.trackCTAClick(ctaName, location, additionalData);
export const trackFormSubmission = (formName: string, success: boolean, additionalData?: Record<string, any>) => 
  analytics.trackFormSubmission(formName, success, additionalData);
export const trackPageView = (pagePath?: string, pageTitle?: string) => 
  analytics.trackPageView(pagePath, pageTitle);
export const trackScrollDepth = (depth: number) => analytics.trackScrollDepth(depth);
export const getABTestVariant = (testId: string, variants: string[]) => 
  analytics.getABTestVariant(testId, variants);
export const trackABTestConversion = (testId: string, conversionType: string) => 
  analytics.trackABTestConversion(testId, conversionType);