import { useState, useEffect } from 'react';

/**
 * Hook to detect and respond to user's reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create event handler
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get motion-safe animation properties
 */
export function useMotionSafe() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    
    // Get animation duration (0 if reduced motion is preferred)
    getDuration: (duration: number) => prefersReducedMotion ? 0 : duration,
    
    // Get animation delay (0 if reduced motion is preferred)
    getDelay: (delay: number) => prefersReducedMotion ? 0 : delay,
    
    // Get transition properties
    getTransition: (transition: any) => 
      prefersReducedMotion 
        ? { ...transition, duration: 0, delay: 0 }
        : transition,
    
    // Get animation variants (static if reduced motion is preferred)
    getVariants: (variants: any) => 
      prefersReducedMotion 
        ? { initial: variants.animate || variants.initial }
        : variants,
    
    // Check if animations should be enabled
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Higher-order component to wrap components with reduced motion support
 */
export function withReducedMotionSupport<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ReducedMotionWrapper(props: P) {
    const { prefersReducedMotion } = useMotionSafe();
    
    return (
      <div data-reduced-motion={prefersReducedMotion}>
        <Component {...props} />
      </div>
    );
  };
}

/**
 * Utility functions for reduced motion
 */
export const reducedMotionUtils = {
  // Apply reduced motion styles globally
  applyReducedMotionStyles: () => {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        [data-reduced-motion="true"] * {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  },

  // Check if reduced motion is preferred (synchronous)
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Create motion-safe CSS classes
  createMotionSafeClasses: () => ({
    'motion-safe:animate-fade-in': !reducedMotionUtils.prefersReducedMotion(),
    'motion-safe:animate-slide-up': !reducedMotionUtils.prefersReducedMotion(),
    'motion-safe:transition-all': !reducedMotionUtils.prefersReducedMotion(),
  }),
};

/**
 * React component for reduced motion indicator (development only)
 */
export function ReducedMotionIndicator() {
  const prefersReducedMotion = useReducedMotion();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        padding: '8px 12px',
        backgroundColor: prefersReducedMotion ? '#ef4444' : '#10b981',
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {prefersReducedMotion ? 'Reduced Motion ON' : 'Animations ON'}
    </div>
  );
}