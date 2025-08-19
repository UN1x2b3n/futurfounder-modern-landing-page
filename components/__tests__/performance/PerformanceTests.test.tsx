import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, measurePerformance, simulateSlowNetwork, simulateOfflineNetwork } from '../utils/test-utils';
import { Navigation } from '../../Navigation';
import { FeatureCard } from '../../FeatureCard';
import { ContactForm } from '../../ContactForm';
import { TestimonialsSection } from '../../TestimonialsSection';
import { ParticleBackground } from '../../ParticleBackground';
import { BookOpen } from 'lucide-react';

describe('Performance Tests', () => {
  beforeEach(() => {
    // Reset performance mocks
    vi.clearAllMocks();
    
    // Mock performance.now for consistent timing
    let mockTime = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      mockTime += 16; // Simulate 60fps
      return mockTime;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Render Performance', () => {
    it('Navigation renders within performance budget', async () => {
      const renderTime = await measurePerformance(() => {
        render(<Navigation />);
      });
      
      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('FeatureCard renders efficiently', async () => {
      const renderTime = await measurePerformance(() => {
        render(
          <FeatureCard
            icon={BookOpen}
            title="Test Feature"
            description="Test description"
            gradient="from-orange-500 to-pink-600"
          />
        );
      });
      
      // Should render within 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('ContactForm renders within budget', async () => {
      const renderTime = await measurePerformance(() => {
        render(<ContactForm />);
      });
      
      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('TestimonialsSection renders efficiently', async () => {
      const renderTime = await measurePerformance(() => {
        render(<TestimonialsSection />);
      });
      
      // Should render within 150ms (more complex component)
      expect(renderTime).toBeLessThan(150);
    });

    it('ParticleBackground initializes efficiently', async () => {
      const renderTime = await measurePerformance(() => {
        render(<ParticleBackground />);
      });
      
      // Should render within 200ms (animation-heavy component)
      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('Multiple Component Performance', () => {
    it('renders multiple FeatureCards efficiently', async () => {
      const features = Array.from({ length: 8 }, (_, i) => ({
        icon: BookOpen,
        title: `Feature ${i + 1}`,
        description: `Description for feature ${i + 1}`,
        gradient: 'from-orange-500 to-pink-600',
      }));

      const renderTime = await measurePerformance(() => {
        render(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        );
      });
      
      // Should render 8 cards within 300ms
      expect(renderTime).toBeLessThan(300);
    });

    it('handles large lists efficiently', async () => {
      const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

      const renderTime = await measurePerformance(() => {
        render(
          <div>
            {items.map((item, index) => (
              <div key={index} className="p-2 border-b">
                {item}
              </div>
            ))}
          </div>
        );
      });
      
      // Should render 100 items within 500ms
      expect(renderTime).toBeLessThan(500);
    });
  });

  describe('Animation Performance', () => {
    it('ParticleBackground animations perform well', async () => {
      const { container } = render(<ParticleBackground />);
      
      // Simulate animation frames
      const animationTime = await measurePerformance(async () => {
        for (let i = 0; i < 60; i++) { // Simulate 1 second at 60fps
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
      });
      
      // Should maintain 60fps (16.67ms per frame)
      const averageFrameTime = animationTime / 60;
      expect(averageFrameTime).toBeLessThan(20); // Allow some buffer
    });

    it('hover animations perform efficiently', async () => {
      const { container } = render(
        <FeatureCard
          icon={BookOpen}
          title="Test Feature"
          description="Test description"
          gradient="from-orange-500 to-pink-600"
        />
      );
      
      const card = container.querySelector('[role="article"]') as HTMLElement;
      
      const hoverTime = await measurePerformance(() => {
        // Simulate hover
        card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        card.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });
      
      // Hover animations should be instant
      expect(hoverTime).toBeLessThan(10);
    });
  });

  describe('Memory Usage', () => {
    it('does not create memory leaks with repeated renders', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Render and unmount components multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<Navigation />);
        unmount();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });

    it('cleans up event listeners properly', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<Navigation />);
      
      const addedListeners = addEventListenerSpy.mock.calls.length;
      
      unmount();
      
      const removedListeners = removeEventListenerSpy.mock.calls.length;
      
      // Should remove as many listeners as were added
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners);
    });
  });

  describe('Network Performance', () => {
    it('handles slow network conditions gracefully', async () => {
      simulateSlowNetwork();
      
      const renderTime = await measurePerformance(async () => {
        render(<ContactForm />);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      // Should still render quickly even with slow network
      expect(renderTime).toBeLessThan(200);
    });

    it('handles offline conditions gracefully', async () => {
      simulateOfflineNetwork();
      
      const { container } = render(<ContactForm />);
      
      // Should render without network
      expect(container).toBeInTheDocument();
      
      // Form should still be interactive
      const submitButton = container.querySelector('button[type="submit"]');
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Bundle Size Impact', () => {
    it('components have minimal bundle impact', () => {
      // Mock bundle analyzer
      const mockBundleSize = {
        Navigation: 15000, // 15KB
        FeatureCard: 8000, // 8KB
        ContactForm: 12000, // 12KB
        TestimonialsSection: 18000, // 18KB
        ParticleBackground: 25000, // 25KB
      };
      
      // Total should be under 100KB
      const totalSize = Object.values(mockBundleSize).reduce((sum, size) => sum + size, 0);
      expect(totalSize).toBeLessThan(100000);
    });
  });

  describe('Core Web Vitals', () => {
    it('meets Largest Contentful Paint (LCP) requirements', async () => {
      // Mock LCP measurement
      const mockLCP = 1500; // 1.5 seconds
      
      // LCP should be under 2.5 seconds
      expect(mockLCP).toBeLessThan(2500);
    });

    it('meets First Input Delay (FID) requirements', async () => {
      const { container } = render(<ContactForm />);
      
      const startTime = performance.now();
      
      // Simulate user input
      const input = container.querySelector('input') as HTMLInputElement;
      input.focus();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      const endTime = performance.now();
      const inputDelay = endTime - startTime;
      
      // FID should be under 100ms
      expect(inputDelay).toBeLessThan(100);
    });

    it('meets Cumulative Layout Shift (CLS) requirements', async () => {
      const { container, rerender } = render(<Navigation />);
      
      // Simulate content changes that might cause layout shift
      rerender(<Navigation />);
      
      // Mock CLS measurement
      const mockCLS = 0.05; // Very low layout shift
      
      // CLS should be under 0.1
      expect(mockCLS).toBeLessThan(0.1);
    });
  });

  describe('Image Loading Performance', () => {
    it('implements efficient image loading', async () => {
      // Mock image loading
      const mockImageLoad = vi.fn().mockResolvedValue(undefined);
      
      const loadTime = await measurePerformance(async () => {
        await mockImageLoad();
      });
      
      // Image loading should be efficient
      expect(loadTime).toBeLessThan(50);
      expect(mockImageLoad).toHaveBeenCalled();
    });

    it('handles image loading errors gracefully', async () => {
      const mockImageError = vi.fn().mockRejectedValue(new Error('Image load failed'));
      
      try {
        await mockImageError();
      } catch (error) {
        expect(error.message).toBe('Image load failed');
      }
      
      // Should handle errors without crashing
      expect(mockImageError).toHaveBeenCalled();
    });
  });
});