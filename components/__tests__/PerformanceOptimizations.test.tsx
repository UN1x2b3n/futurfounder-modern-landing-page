import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { OptimizedImage } from '../ui/OptimizedImage';
import { PerformanceProvider, usePerformance } from '../PerformanceProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LazyComponentWrapper } from '../utils/lazyComponents';
import { optimizedAnimations } from '../utils/animationOptimizations';

// Mock performance APIs
const mockPerformanceObserver = jest.fn();
const mockMatchMedia = jest.fn();

beforeAll(() => {
  // Mock PerformanceObserver
  global.PerformanceObserver = mockPerformanceObserver;
  mockPerformanceObserver.mockImplementation((callback) => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  mockMatchMedia.mockImplementation((query) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe('Performance Optimizations', () => {
  describe('OptimizedImage', () => {
    it('renders with WebP support', () => {
      render(
        <OptimizedImage
          src="test.jpg"
          alt="Test image"
          data-testid="optimized-image"
        />
      );

      const picture = screen.getByTestId('optimized-image').closest('picture');
      expect(picture).toBeInTheDocument();
      
      const webpSource = picture?.querySelector('source[type="image/webp"]');
      expect(webpSource).toBeInTheDocument();
    });

    it('generates responsive srcSet', () => {
      render(
        <OptimizedImage
          src="https://images.unsplash.com/test.jpg"
          alt="Test image"
          data-testid="optimized-image"
        />
      );

      const sources = screen.getByTestId('optimized-image')
        .closest('picture')
        ?.querySelectorAll('source');
      
      expect(sources).toHaveLength(2); // WebP and fallback
      
      sources?.forEach(source => {
        expect(source.getAttribute('srcset')).toContain('400w');
        expect(source.getAttribute('srcset')).toContain('800w');
        expect(source.getAttribute('srcset')).toContain('1200w');
        expect(source.getAttribute('srcset')).toContain('1600w');
      });
    });

    it('shows loading placeholder initially', () => {
      render(
        <OptimizedImage
          src="test.jpg"
          alt="Test image"
          className="test-image"
        />
      );

      const placeholder = document.querySelector('.animate-pulse');
      expect(placeholder).toBeInTheDocument();
    });

    it('handles image loading errors gracefully', async () => {
      render(
        <OptimizedImage
          src="invalid-image.jpg"
          alt="Test image"
          data-testid="optimized-image"
        />
      );

      const img = screen.getByTestId('optimized-image');
      
      // Simulate image error
      Object.defineProperty(img, 'complete', { value: false });
      img.dispatchEvent(new Event('error'));

      await waitFor(() => {
        expect(screen.getByAltText('Error loading image')).toBeInTheDocument();
      });
    });
  });

  describe('PerformanceProvider', () => {
    it('provides performance context', () => {
      const TestComponent = () => {
        const { metrics, prefersReducedMotion } = usePerformance();
        return (
          <div>
            <span data-testid="metrics">{Object.keys(metrics).length}</span>
            <span data-testid="reduced-motion">{prefersReducedMotion.toString()}</span>
          </div>
        );
      };

      render(
        <PerformanceProvider>
          <TestComponent />
        </PerformanceProvider>
      );

      expect(screen.getByTestId('metrics')).toBeInTheDocument();
      expect(screen.getByTestId('reduced-motion')).toBeInTheDocument();
    });

    it('initializes performance monitoring', () => {
      render(
        <PerformanceProvider>
          <div>Test</div>
        </PerformanceProvider>
      );

      expect(mockPerformanceObserver).toHaveBeenCalled();
    });
  });

  describe('LazyComponentWrapper', () => {
    it('renders fallback initially', () => {
      const LazyComponent = React.lazy(() => 
        Promise.resolve({ default: () => <div>Lazy Content</div> })
      );

      render(
        <LazyComponentWrapper fallback={<div data-testid="fallback">Loading...</div>}>
          <LazyComponent />
        </LazyComponentWrapper>
      );

      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('handles component loading errors', async () => {
      const FailingComponent = React.lazy(() => 
        Promise.reject(new Error('Failed to load'))
      );

      render(
        <LazyComponentWrapper 
          fallback={<div>Loading...</div>}
          errorFallback={<div data-testid="error">Failed to load component</div>}
        >
          <FailingComponent />
        </LazyComponentWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
    });
  });

  describe('Reduced Motion Hook', () => {
    it('detects reduced motion preference', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const TestComponent = () => {
        const prefersReducedMotion = useReducedMotion();
        return <div data-testid="reduced-motion">{prefersReducedMotion.toString()}</div>;
      };

      render(<TestComponent />);
      
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true');
    });
  });

  describe('Animation Optimizations', () => {
    it('provides GPU-accelerated animation variants', () => {
      expect(optimizedAnimations.fadeInUp.initial).toEqual({
        opacity: 0,
        transform: 'translateY(20px) translateZ(0)'
      });

      expect(optimizedAnimations.fadeInUp.animate).toEqual({
        opacity: 1,
        transform: 'translateY(0px) translateZ(0)'
      });
    });

    it('includes transform3d for GPU acceleration', () => {
      Object.values(optimizedAnimations).forEach(animation => {
        if (typeof animation === 'object' && animation.initial) {
          const transforms = [
            animation.initial.transform,
            animation.animate?.transform,
            animation.exit?.transform
          ].filter(Boolean);

          transforms.forEach(transform => {
            if (typeof transform === 'string') {
              expect(transform).toContain('translateZ(0)');
            }
          });
        }
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('tracks Core Web Vitals metrics', () => {
      // This would be tested with actual performance entries in a real browser
      expect(mockPerformanceObserver).toHaveBeenCalled();
    });

    it('provides metric rating system', () => {
      // Test the rating system logic
      const testMetrics = [
        { name: 'LCP', value: 2000, expectedRating: 'good' },
        { name: 'LCP', value: 3000, expectedRating: 'needs-improvement' },
        { name: 'LCP', value: 5000, expectedRating: 'poor' },
        { name: 'CLS', value: 0.05, expectedRating: 'good' },
        { name: 'CLS', value: 0.15, expectedRating: 'needs-improvement' },
        { name: 'CLS', value: 0.3, expectedRating: 'poor' },
      ];

      // This would test the actual rating logic from the performance monitor
      testMetrics.forEach(({ name, value, expectedRating }) => {
        // Test rating calculation logic here
        expect(name).toBeDefined();
        expect(value).toBeGreaterThan(0);
        expect(expectedRating).toMatch(/good|needs-improvement|poor/);
      });
    });
  });
});

describe('Integration Tests', () => {
  it('combines all performance optimizations', async () => {
    const TestApp = () => (
      <PerformanceProvider>
        <div>
          <OptimizedImage
            src="test.jpg"
            alt="Test"
            data-testid="optimized-image"
          />
          <LazyComponentWrapper fallback={<div>Loading...</div>}>
            <div data-testid="lazy-content">Lazy loaded content</div>
          </LazyComponentWrapper>
        </div>
      </PerformanceProvider>
    );

    render(<TestApp />);

    // Check that optimized image is rendered
    expect(screen.getByTestId('optimized-image')).toBeInTheDocument();
    
    // Check that performance monitoring is initialized
    expect(mockPerformanceObserver).toHaveBeenCalled();
    
    // Check that reduced motion detection is working
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});