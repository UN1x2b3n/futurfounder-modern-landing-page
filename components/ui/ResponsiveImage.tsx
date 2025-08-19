import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  className?: string;
  priority?: boolean;
}

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export function ResponsiveImage({
  src,
  srcSet,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  alt,
  fallbackSrc,
  lazy = true,
  className = '',
  priority = false,
  ...props
}: ResponsiveImageProps) {
  const [didError, setDidError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority);
  
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Trigger loading when image enters viewport (for lazy loading)
  React.useEffect(() => {
    if (lazy && !priority && isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, lazy, priority, shouldLoad]);

  const handleError = () => {
    setDidError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Generate responsive srcSet if not provided
  const generateSrcSet = (baseSrc: string): string => {
    if (srcSet) return srcSet;
    
    // Extract base URL and add responsive variants
    const baseUrl = baseSrc.split('?')[0];
    const params = baseSrc.includes('?') ? '?' + baseSrc.split('?')[1] : '';
    
    return [
      `${baseUrl}${params}&w=400 400w`,
      `${baseUrl}${params}&w=800 800w`,
      `${baseUrl}${params}&w=1200 1200w`,
      `${baseUrl}${params}&w=1600 1600w`,
    ].join(', ');
  };

  if (didError) {
    return (
      <div
        ref={ref}
        className={`inline-block bg-gray-100 text-center align-middle ${className}`}
        {...props}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={fallbackSrc || ERROR_IMG_SRC} 
            alt="Error loading image" 
            className="opacity-50"
            data-original-url={src}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Loading placeholder */}
      {!isLoaded && shouldLoad && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse ${className}`}
          style={{ aspectRatio: props.style?.aspectRatio }}
        />
      )}
      
      {shouldLoad && (
        <img
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onError={handleError}
          onLoad={handleLoad}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}