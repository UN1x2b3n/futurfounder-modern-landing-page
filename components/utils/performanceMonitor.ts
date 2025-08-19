/**
 * Performance monitoring utilities for Core Web Vitals tracking
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsMetrics {
  CLS?: PerformanceMetric;
  FID?: PerformanceMetric;
  FCP?: PerformanceMetric;
  LCP?: PerformanceMetric;
  TTFB?: PerformanceMetric;
  INP?: PerformanceMetric;
}

class PerformanceMonitor {
  private metrics: WebVitalsMetrics = {};
  private observers: PerformanceObserver[] = [];
  private onMetricCallback?: (metric: PerformanceMetric) => void;

  constructor(onMetric?: (metric: PerformanceMetric) => void) {
    this.onMetricCallback = onMetric;
    this.initializeObservers();
  }

  private initializeObservers() {
    // Only initialize if performance API is available
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
    this.observeINP();
  }

  private createMetric(name: string, value: number): PerformanceMetric {
    const rating = this.getRating(name, value);
    return {
      name,
      value,
      rating,
      timestamp: Date.now(),
    };
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
      INP: { good: 200, poor: 500 },
    };

    const threshold = thresholds[metricName as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private reportMetric(metric: PerformanceMetric) {
    this.metrics[metric.name as keyof WebVitalsMetrics] = metric;
    this.onMetricCallback?.(metric);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric.name}: ${metric.value}ms (${metric.rating})`);
    }
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry) {
          const metric = this.createMetric('LCP', lastEntry.startTime);
          this.reportMetric(metric);
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const metric = this.createMetric('FID', entry.processingStart - entry.startTime);
          this.reportMetric(metric);
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      let clsEntries: any[] = [];

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = clsEntries[0];
            const lastSessionEntry = clsEntries[clsEntries.length - 1];

            if (!firstSessionEntry || 
                entry.startTime - lastSessionEntry.startTime < 1000 ||
                entry.startTime - firstSessionEntry.startTime < 5000) {
              clsEntries.push(entry);
              clsValue += entry.value;
            } else {
              clsEntries = [entry];
              clsValue = entry.value;
            }
          }
        });

        const metric = this.createMetric('CLS', clsValue);
        this.reportMetric(metric);
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }
  }

  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            const metric = this.createMetric('FCP', entry.startTime);
            this.reportMetric(metric);
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP observer not supported:', error);
    }
  }

  private observeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            const metric = this.createMetric('TTFB', entry.responseStart - entry.requestStart);
            this.reportMetric(metric);
          }
        });
      });

      observer.observe({ type: 'navigation', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('TTFB observer not supported:', error);
    }
  }

  private observeINP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let maxDuration = 0;

        entries.forEach((entry: any) => {
          if (entry.duration > maxDuration) {
            maxDuration = entry.duration;
          }
        });

        if (maxDuration > 0) {
          const metric = this.createMetric('INP', maxDuration);
          this.reportMetric(metric);
        }
      });

      observer.observe({ type: 'event', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('INP observer not supported:', error);
    }
  }

  public getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  public getMetricSummary(): string {
    const metrics = this.getMetrics();
    const summary = Object.entries(metrics)
      .map(([name, metric]) => `${name}: ${metric?.value.toFixed(2)}ms (${metric?.rating})`)
      .join(', ');
    
    return summary || 'No metrics available';
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initializePerformanceMonitoring(
  onMetric?: (metric: PerformanceMetric) => void
): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(onMetric);
  }
  return performanceMonitor;
}

export function getPerformanceMetrics(): WebVitalsMetrics {
  return performanceMonitor?.getMetrics() || {};
}

export function getPerformanceSummary(): string {
  return performanceMonitor?.getMetricSummary() || 'Performance monitoring not initialized';
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring(
  onMetric?: (metric: PerformanceMetric) => void
) {
  const [metrics, setMetrics] = React.useState<WebVitalsMetrics>({});

  React.useEffect(() => {
    const monitor = initializePerformanceMonitoring((metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric,
      }));
      onMetric?.(metric);
    });

    return () => {
      monitor.disconnect();
    };
  }, [onMetric]);

  return metrics;
}

/**
 * Performance debugging utilities
 */
export const performanceUtils = {
  // Measure function execution time
  measureFunction: <T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    }) as T;
  },

  // Measure component render time
  measureRender: (componentName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`[Performance] ${componentName} render: ${(end - start).toFixed(2)}ms`);
    };
  },

  // Log current performance metrics
  logMetrics: () => {
    console.log('[Performance] Current metrics:', getPerformanceSummary());
  },
};

// Add React import for the hook
import React from 'react';