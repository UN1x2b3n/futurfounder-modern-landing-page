/**
 * Performance Analytics Utilities
 * Monitors and tracks Core Web Vitals and custom performance metrics
 */

import { analytics } from './analytics';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface CustomPerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceAnalytics {
  private customMetrics: Map<string, CustomPerformanceMetric> = new Map();
  private isInitialized = false;

  /**
   * Initialize performance monitoring
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor navigation timing
    this.monitorNavigationTiming();
    
    // Monitor memory usage (if available)
    this.monitorMemoryUsage();

    this.isInitialized = true;
    console.log('[Performance Analytics] Initialized');
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      
      this.trackPerformanceMetric({
        name: 'LCP',
        value: lcp,
        rating: this.getLCPRating(lcp),
        timestamp: Date.now(),
      });
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entries) => {
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        
        this.trackPerformanceMetric({
          name: 'FID',
          value: fid,
          rating: this.getFIDRating(fid),
          timestamp: Date.now(),
        });
      });
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entries) => {
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.trackPerformanceMetric({
        name: 'CLS',
        value: clsValue,
        rating: this.getCLSRating(clsValue),
        timestamp: Date.now(),
      });
    });

    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', (entries) => {
      const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.trackPerformanceMetric({
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: this.getFCPRating(fcpEntry.startTime),
          timestamp: Date.now(),
        });
      }
    });
  }

  /**
   * Monitor resource loading performance
   */
  private monitorResourceLoading(): void {
    // Monitor image loading
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach((entry: any) => {
        if (entry.initiatorType === 'img') {
          const loadTime = entry.responseEnd - entry.startTime;
          
          analytics.trackEvent({
            action: 'image_load_time',
            category: 'performance',
            label: entry.name,
            value: Math.round(loadTime),
            customParameters: {
              resource_url: entry.name,
              load_time: loadTime,
              transfer_size: entry.transferSize,
              encoded_body_size: entry.encodedBodySize,
            },
          });
        }
      });
    });

    // Monitor script loading
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach((entry: any) => {
        if (entry.initiatorType === 'script') {
          const loadTime = entry.responseEnd - entry.startTime;
          
          analytics.trackEvent({
            action: 'script_load_time',
            category: 'performance',
            label: entry.name,
            value: Math.round(loadTime),
            customParameters: {
              resource_url: entry.name,
              load_time: loadTime,
              transfer_size: entry.transferSize,
            },
          });
        }
      });
    });
  }

  /**
   * Monitor navigation timing
   */
  private monitorNavigationTiming(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // DNS lookup time
        const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;
        this.trackCustomMetric('dns_lookup_time', dnsTime);
        
        // TCP connection time
        const tcpTime = navigation.connectEnd - navigation.connectStart;
        this.trackCustomMetric('tcp_connection_time', tcpTime);
        
        // Server response time
        const serverTime = navigation.responseEnd - navigation.requestStart;
        this.trackCustomMetric('server_response_time', serverTime);
        
        // DOM processing time
        const domTime = navigation.domComplete - navigation.domLoading;
        this.trackCustomMetric('dom_processing_time', domTime);
        
        // Page load time
        const loadTime = navigation.loadEventEnd - navigation.navigationStart;
        this.trackCustomMetric('page_load_time', loadTime);
      }
    });
  }

  /**
   * Monitor memory usage (if available)
   */
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      setInterval(() => {
        analytics.trackEvent({
          action: 'memory_usage',
          category: 'performance',
          label: 'heap_usage',
          value: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
          customParameters: {
            used_heap_size: memory.usedJSHeapSize,
            total_heap_size: memory.totalJSHeapSize,
            heap_size_limit: memory.jsHeapSizeLimit,
          },
        });
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Observe performance entries
   */
  private observePerformanceEntry(entryType: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
    } catch (error) {
      console.warn(`Failed to observe ${entryType} entries:`, error);
    }
  }

  /**
   * Track performance metric
   */
  private trackPerformanceMetric(metric: PerformanceMetric): void {
    analytics.trackEvent({
      action: 'core_web_vital',
      category: 'performance',
      label: metric.name,
      value: Math.round(metric.value),
      customParameters: {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        timestamp: metric.timestamp,
      },
    });

    console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }

  /**
   * Track custom performance metric
   */
  private trackCustomMetric(name: string, value: number, metadata?: Record<string, any>): void {
    analytics.trackEvent({
      action: 'custom_performance_metric',
      category: 'performance',
      label: name,
      value: Math.round(value),
      customParameters: {
        metric_name: name,
        metric_value: value,
        ...metadata,
      },
    });
  }

  /**
   * Start timing a custom metric
   */
  startTiming(name: string, metadata?: Record<string, any>): void {
    this.customMetrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * End timing a custom metric
   */
  endTiming(name: string): number | null {
    const metric = this.customMetrics.get(name);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    this.trackCustomMetric(name, duration, metric.metadata);
    this.customMetrics.delete(name);

    return duration;
  }

  /**
   * Measure function execution time
   */
  measureFunction<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startTiming(name, metadata);
    const result = fn();
    this.endTiming(name);
    return result;
  }

  /**
   * Measure async function execution time
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    this.startTiming(name, metadata);
    const result = await fn();
    this.endTiming(name);
    return result;
  }

  /**
   * Get LCP rating
   */
  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get FID rating
   */
  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get CLS rating
   */
  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get FCP rating
   */
  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }
}

// Create and export performance analytics instance
export const performanceAnalytics = new PerformanceAnalytics();

// Export utility functions
export const startTiming = (name: string, metadata?: Record<string, any>) => 
  performanceAnalytics.startTiming(name, metadata);
export const endTiming = (name: string) => performanceAnalytics.endTiming(name);
export const measureFunction = <T>(name: string, fn: () => T, metadata?: Record<string, any>) => 
  performanceAnalytics.measureFunction(name, fn, metadata);
export const measureAsyncFunction = <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => 
  performanceAnalytics.measureAsyncFunction(name, fn, metadata);