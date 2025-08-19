import React, { lazy, Suspense } from 'react';

/**
 * Lazy load components with error boundaries and loading states
 */

// Lazy load non-critical components
export const LazyTestimonialsSection = lazy(() => 
  import('../TestimonialsSection').then(module => ({ default: module.TestimonialsSection }))
);

export const LazyContactSection = lazy(() => 
  import('../ContactSection').then(module => ({ default: module.ContactSection }))
);

export const LazyFinalCTASection = lazy(() => 
  import('../FinalCTASection').then(module => ({ default: module.FinalCTASection }))
);

export const LazyAnimatedStats = lazy(() => 
  import('../AnimatedStats').then(module => ({ default: module.AnimatedStats }))
);

export const LazyParticleBackground = lazy(() => 
  import('../ParticleBackground').then(module => ({ default: module.ParticleBackground }))
);

/**
 * Higher-order component for lazy loading with error boundary
 */
interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-gray-500">
          <p>Failed to load component</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function LazyComponentWrapper({ 
  children, 
  fallback = <div className="h-32 bg-gray-100 animate-pulse rounded" />,
  errorFallback 
}: LazyComponentWrapperProps) {
  return (
    <LazyErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}

/**
 * Preload components for better UX
 */
export function preloadComponent(componentImport: () => Promise<any>) {
  // Preload on user interaction or after initial load
  const preload = () => {
    componentImport().catch(error => {
      console.warn('Failed to preload component:', error);
    });
  };

  // Preload on hover or focus
  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
}

/**
 * Utility to create lazy components with consistent loading states
 */
export function createLazyComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: T) {
    return (
      <LazyComponentWrapper fallback={fallback}>
        <LazyComponent {...props} />
      </LazyComponentWrapper>
    );
  };
}