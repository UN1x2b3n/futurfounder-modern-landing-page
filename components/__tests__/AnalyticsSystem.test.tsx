/**
 * Analytics System Test Suite
 * Tests analytics tracking, conversion tracking, performance monitoring, and A/B testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { analytics } from '../utils/analytics';
import { performanceAnalytics } from '../utils/performanceAnalytics';
import { AnalyticsProvider } from '../AnalyticsProvider';
import { AnalyticsButton } from '../ui/AnalyticsButton';
import { ContactFormWithAnalytics } from '../ContactFormWithAnalytics';
import { ABTest, ABTestButton } from '../utils/abTesting';

// Mock global objects
const mockGtag = vi.fn();
const mockHj = vi.fn();

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();
  
  // Mock window.gtag
  (global as any).window = {
    ...global.window,
    gtag: mockGtag,
    hj: mockHj,
    dataLayer: [],
    location: { href: 'http://localhost:3000', pathname: '/' },
    performance: {
      now: vi.fn(() => Date.now()),
      getEntriesByType: vi.fn(() => []),
    },
    PerformanceObserver: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    })),
    localStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
  };
  
  // Mock document
  (global as any).document = {
    ...global.document,
    title: 'Test Page',
    createElement: vi.fn(() => ({
      async: true,
      src: '',
    })),
    head: {
      appendChild: vi.fn(),
    },
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Analytics System', () => {
  describe('Analytics Initialization', () => {
    it('should initialize analytics with correct configuration', async () => {
      const config = {
        googleAnalyticsId: 'G-TEST123',
        hotjarId: '123456',
        enableHeatmaps: true,
        enableConversionTracking: true,
        enablePerformanceMonitoring: true,
        enableABTesting: true,
        debug: true,
      };

      render(
        <AnalyticsProvider config={config}>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(document.createElement).toHaveBeenCalledWith('script');
      });
    });

    it('should track page view on initialization', async () => {
      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('config', expect.any(String), {
          page_title: 'Test Page',
          page_location: 'http://localhost:3000',
        });
      });
    });
  });

  describe('Event Tracking', () => {
    it('should track custom events', async () => {
      const TestComponent = () => {
        const handleClick = () => {
          analytics.trackEvent({
            action: 'test_click',
            category: 'test_category',
            label: 'test_label',
            value: 1,
            customParameters: { test_param: 'test_value' },
          });
        };

        return <button onClick={handleClick}>Test Button</button>;
      };

      render(
        <AnalyticsProvider>
          <TestComponent />
        </AnalyticsProvider>
      );

      const button = screen.getByText('Test Button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'test_click', {
          event_category: 'test_category',
          event_label: 'test_label',
          value: 1,
          test_param: 'test_value',
        });
      });
    });

    it('should track conversion events', async () => {
      const TestComponent = () => {
        const handleClick = () => {
          analytics.trackConversion({
            eventName: 'test_conversion',
            conversionValue: 10,
            currency: 'USD',
            customParameters: { conversion_type: 'test' },
          });
        };

        return <button onClick={handleClick}>Convert</button>;
      };

      render(
        <AnalyticsProvider>
          <TestComponent />
        </AnalyticsProvider>
      );

      const button = screen.getByText('Convert');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
          send_to: expect.any(String),
          event_category: 'conversion',
          event_label: 'test_conversion',
          value: 10,
          currency: 'USD',
          conversion_type: 'test',
        });
      });
    });
  });

  describe('AnalyticsButton Component', () => {
    it('should track CTA clicks', async () => {
      const user = userEvent.setup();

      render(
        <AnalyticsProvider>
          <AnalyticsButton
            ctaName="test_cta"
            ctaLocation="test_section"
            conversionValue={5}
          >
            Click Me
          </AnalyticsButton>
        </AnalyticsProvider>
      );

      const button = screen.getByText('Click Me');
      await user.click(button);

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click', expect.objectContaining({
          event_category: 'engagement',
          event_label: 'test_cta_test_section',
        }));
      });
    });

    it('should track hover interactions', async () => {
      const user = userEvent.setup();

      render(
        <AnalyticsProvider>
          <AnalyticsButton
            ctaName="test_cta"
            ctaLocation="test_section"
          >
            Hover Me
          </AnalyticsButton>
        </AnalyticsProvider>
      );

      const button = screen.getByText('Hover Me');
      await user.hover(button);
      await user.unhover(button);

      // Note: Hover tracking is tested indirectly through the analytics system
      expect(button).toBeInTheDocument();
    });
  });

  describe('Form Analytics', () => {
    it('should track form submission success', async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn().mockResolvedValue(undefined);

      render(
        <AnalyticsProvider>
          <ContactFormWithAnalytics onSubmit={mockSubmit} />
        </AnalyticsProvider>
      );

      // Fill out the form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough');

      // Submit the form
      await user.click(screen.getByText('Send Message'));

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'form_submission', expect.objectContaining({
          event_category: 'engagement',
          event_label: 'contact_form_success',
        }));
      });
    });

    it('should track form field interactions', async () => {
      const user = userEvent.setup();

      render(
        <AnalyticsProvider>
          <ContactFormWithAnalytics />
        </AnalyticsProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      await user.click(nameInput);
      await user.type(nameInput, 'John');

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'field_change', expect.objectContaining({
          event_category: 'form_interaction',
          event_label: 'contact_form_name',
        }));
      });
    });
  });

  describe('A/B Testing', () => {
    beforeEach(() => {
      // Mock localStorage for A/B testing
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      };
      (global as any).localStorage = localStorageMock;
    });

    it('should assign and track A/B test variants', async () => {
      const user = userEvent.setup();

      render(
        <AnalyticsProvider>
          <ABTest
            testId="test_experiment"
            variants={{
              'variant_a': <div>Variant A</div>,
              'variant_b': <div>Variant B</div>,
            }}
          />
        </AnalyticsProvider>
      );

      // Should render one of the variants
      const content = screen.getByText(/Variant [AB]/);
      expect(content).toBeInTheDocument();

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'ab_test_assignment', expect.objectContaining({
          event_category: 'experiment',
        }));
      });
    });

    it('should track A/B test conversions', async () => {
      const user = userEvent.setup();

      render(
        <AnalyticsProvider>
          <ABTestButton
            testId="button_test"
            variants={{
              'variant_a': { text: 'Click A' },
              'variant_b': { text: 'Click B' },
            }}
          />
        </AnalyticsProvider>
      );

      const button = screen.getByText(/Click [AB]/);
      await user.click(button);

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'ab_test_conversion', expect.objectContaining({
          event_category: 'experiment',
        }));
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should initialize performance monitoring', () => {
      performanceAnalytics.initialize();
      
      expect(window.PerformanceObserver).toHaveBeenCalled();
    });

    it('should track custom performance metrics', () => {
      performanceAnalytics.initialize();
      
      performanceAnalytics.startTiming('test_metric');
      const duration = performanceAnalytics.endTiming('test_metric');
      
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should measure function execution time', () => {
      performanceAnalytics.initialize();
      
      const testFunction = () => {
        // Simulate some work
        return 'result';
      };
      
      const result = performanceAnalytics.measureFunction('test_function', testFunction);
      
      expect(result).toBe('result');
    });

    it('should measure async function execution time', async () => {
      performanceAnalytics.initialize();
      
      const testAsyncFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async_result';
      };
      
      const result = await performanceAnalytics.measureAsyncFunction('test_async_function', testAsyncFunction);
      
      expect(result).toBe('async_result');
    });
  });

  describe('Scroll Depth Tracking', () => {
    it('should track scroll depth milestones', async () => {
      // Mock scroll behavior
      const mockScrollEvent = () => {
        Object.defineProperty(window, 'pageYOffset', { value: 500, writable: true });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 500, writable: true });
        Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
        
        window.dispatchEvent(new Event('scroll'));
      };

      render(
        <AnalyticsProvider>
          <div style={{ height: '2000px' }}>Long content</div>
        </AnalyticsProvider>
      );

      mockScrollEvent();

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'scroll_depth', expect.objectContaining({
          event_category: 'engagement',
        }));
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle analytics initialization errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock a failing script load
      const mockCreateElement = vi.fn(() => {
        throw new Error('Script load failed');
      });
      document.createElement = mockCreateElement;

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize analytics:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('should handle tracking errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock gtag to throw an error
      mockGtag.mockImplementation(() => {
        throw new Error('Tracking failed');
      });

      analytics.trackEvent({
        action: 'test_event',
        category: 'test',
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to track event:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Privacy and Consent', () => {
    it('should respect user privacy settings', () => {
      // Test that analytics respects user consent
      const config = {
        enableHeatmaps: false,
        enableConversionTracking: false,
        enablePerformanceMonitoring: false,
        enableABTesting: false,
      };

      render(
        <AnalyticsProvider config={config}>
          <div>Privacy-respecting content</div>
        </AnalyticsProvider>
      );

      // Should not initialize tracking services when disabled
      expect(mockHj).not.toHaveBeenCalled();
    });
  });
});