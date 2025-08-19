import React, { useState, useCallback } from 'react';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  webpSrc?: string;
  fallbackSrc?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

/**
 * Generate WebP URL from original image URL
 */
function generateWebPUrl(originalUrl: string): string {
  // For external URLs, try to append format parameter or replace extension
  if (originalUrl.includes('unsplash.com')) {
    return originalUrl.includes('?') 
      ? `${originalUrl}&fm=webp`
      : `${originalUrl}?fm=webp`;
  }
  
  // For local images, replace extension with .webp
  return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

/**
 * Generate responsive image URLs with different sizes
 */
function generateSrcSet(baseUrl: string, isWebP: boolean = false): string {
  const sizes = [400, 800, 1200, 1600];
  const format = isWebP ? '&fm=webp' : '';
  
  if (baseUrl.includes('unsplash.com')) {
    return sizes
      .map(size => `${baseUrl}&w=${size}${format} ${size}w`)
      .join(', ');
  }
  
  // For local images, assume different size variants exist
  const extension = isWebP ? '.webp' : baseUrl.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
  const baseName = baseUrl.replace(/\.(jpg|jpeg|png)$/i, '');
  
  return sizes
    .map(size => `${baseName}-${size}w${extension} ${size}w`)
    .join(', ');
}

export function OptimizedImage({
  src,
  alt,
  webpSrc,
  fallbackSrc,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  className = '',
  style,
  onLoad,
  onError,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const webpUrl = webpSrc || generateWebPUrl(src);
  const webpSrcSet = generateSrcSet(src, true);
  const fallbackSrcSet = generateSrcSet(src, false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);

  // If there's an error, show fallback
  if (imageError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={fallbackSrc || ERROR_IMG_SRC} 
            alt="Error loading image" 
            className="opacity-50"
            {...rest} 
            data-original-url={src} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse ${className}`}
          style={style}
        />
      )}
      
      <picture>
        {/* WebP source with responsive sizes */}
        <source
          srcSet={webpSrcSet}
          sizes={sizes}
          type="image/webp"
        />
        
        {/* Fallback source with responsive sizes */}
        <source
          srcSet={fallbackSrcSet}
          sizes={sizes}
          type="image/jpeg"
        />
        
        {/* Fallback img element */}
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={style}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : loading}
          decoding={decoding}
          sizes={sizes}
          {...rest}
        />
      </picture>
    </div>
  );
}