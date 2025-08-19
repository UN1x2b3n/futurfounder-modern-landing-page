import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializePerformanceMonitoring, getPerformanceMetrics, type WebVitalsMetrics } from './utils/performanceMonitor';
import { useReducedMotion, reducedMotionUtils } from './hooks/useReducedMotion';

interface PerformanceContextType {
  metrics: WebVitalsMetrics;
  prefersReducedMotion: boolean;
  isOptimizedMode: boolean;
  toggleOptimizedMode: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: React.ReactNode;
  enableDevTools?: boolean;
  onMetric?: (metric: any) => void;
}

export function PerformanceProvider({ 
  children, 
  enableDevTools = process.env.NODE_ENV === 'development',
  onMetric 
}: PerformanceProviderProps) {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({});
  const [isOptimizedMode, setIsOptimizedMode] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Initialize performance monitoring
    const monitor = initializePerformanceMonitoring((metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric,
      }));
      
      // Call custom callback if provided
      onMetric?.(metric);
      
      // Log poor performance metrics
      if (metric.rating === 'poor') {
        console.warn(`[Performance] Poor ${metric.name}: ${metric.value}ms`);
      }
    });

    // Apply reduced motion styles
    reducedMotionUtils.applyReducedMotionStyles();

    // Cleanup on unmount
    return () => {
      monitor.disconnect();
    };
  }, [onMetric]);

  // Auto-enable optimized mode for poor performance
  useEffect(() => {
    const hasPooreMetrics = Object.values(metrics).some(
      metric => metric?.rating === 'poor'
    );
    
    if (hasPooreMetrics && !isOptimizedMode) {
      console.log('[Performance] Auto-enabling optimized mode due to poor metrics');
      setIsOptimizedMode(true);
    }
  }, [metrics, isOptimizedMode]);

  const toggleOptimizedMode = () => {
    setIsOptimizedMode(prev => !prev);
  };

  const contextValue: PerformanceContextType = {
    metrics,
    prefersReducedMotion,
    isOptimizedMode,
    toggleOptimizedMode,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
      {enableDevTools && <PerformanceDevTools />}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}

/**
 * Development tools for performance monitoring
 */
function PerformanceDevTools() {
  const { metrics, prefersReducedMotion, isOptimizedMode, toggleOptimizedMode } = usePerformance();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        title="Performance Tools"
      >
        ⚡
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 300,
            maxHeight: 400,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            zIndex: 9998,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            overflow: 'auto',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
            Performance Metrics
          </h3>
          
          {/* Metrics display */}
          <div style={{ marginBottom: '16px' }}>
            {Object.entries(metrics).map(([name, metric]) => (
              <div key={name} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500' }}>{name}:</span>
                  <span style={{ 
                    color: metric?.rating === 'good' ? '#10b981' : 
                           metric?.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'
                  }}>
                    {metric?.value.toFixed(2)}ms
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {metric?.rating}
                </div>
              </div>
            ))}
            
            {Object.keys(metrics).length === 0 && (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                No metrics available yet
              </div>
            )}
          </div>

          {/* Settings */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={isOptimizedMode}
                  onChange={toggleOptimizedMode}
                />
                Optimized Mode
              </label>
            </div>
            
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Reduced Motion: {prefersReducedMotion ? 'ON' : 'OFF'}
            </div>
          </div>

          {/* Actions */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
            <button
              onClick={() => {
                console.log('[Performance] Current metrics:', metrics);
                console.log('[Performance] Reduced motion:', prefersReducedMotion);
                console.log('[Performance] Optimized mode:', isOptimizedMode);
              }}
              style={{
                width: '100%',
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Log to Console
            </button>
          </div>
        </div>
      )}
    </>
  );
}