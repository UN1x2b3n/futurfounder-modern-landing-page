import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  priority?: boolean;
}

export function LazyLoad({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  priority = false,
}: LazyLoadProps) {
  const [shouldRender, setShouldRender] = useState(priority);
  
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  React.useEffect(() => {
    if (isIntersecting && !shouldRender) {
      setShouldRender(true);
    }
  }, [isIntersecting, shouldRender]);

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
}

/**
 * Higher-order component for lazy loading
 */
export function withLazyLoad<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<LazyLoadProps, 'children'> = {}
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyLoad {...options}>
        <Component {...props} />
      </LazyLoad>
    );
  };
}