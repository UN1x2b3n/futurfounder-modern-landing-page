import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { ResponsiveText } from '../ui/ResponsiveText';
import { LazyLoad } from '../ui/LazyLoad';
import { TouchButton } from '../ui/TouchFriendly';
import { useResponsive } from '../hooks/useResponsive';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Responsive Optimizations', () => {
  describe('ResponsiveImage', () => {
    it('renders with lazy loading by default', () => {
      render(
        <ResponsiveImage
          src="test-image.jpg"
          alt="Test image"
          data-testid="responsive-image"
        />
      );
      
      const image = screen.getByTestId('responsive-image').querySelector('img');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('decoding', 'async');
    });

    it('generates responsive srcSet when not provided', () => {
      render(
        <ResponsiveImage
          src="test-image.jpg"
          alt="Test image"
          data-testid="responsive-image"
        />
      );
      
      const image = screen.getByTestId('responsive-image').querySelector('img');
      expect(image).toHaveAttribute('srcset');
      expect(image?.getAttribute('srcset')).toContain('400w');
      expect(image?.getAttribute('srcset')).toContain('800w');
    });

    it('shows loading placeholder initially', () => {
      render(
        <ResponsiveImage
          src="test-image.jpg"
          alt="Test image"
          data-testid="responsive-image"
        />
      );
      
      const placeholder = screen.getByTestId('responsive-image').querySelector('.animate-pulse');
      expect(placeholder).toBeInTheDocument();
    });

    it('handles image load errors gracefully', async () => {
      render(
        <ResponsiveImage
          src="invalid-image.jpg"
          alt="Test image"
          data-testid="responsive-image"
        />
      );
      
      const image = screen.getByTestId('responsive-image').querySelector('img');
      fireEvent.error(image!);
      
      await waitFor(() => {
        expect(screen.getByText('Error loading image')).toBeInTheDocument();
      });
    });
  });

  describe('ResponsiveText', () => {
    it('renders with correct typography variant styles', () => {
      render(
        <ResponsiveText variant="hero" data-testid="hero-text">
          Hero Text
        </ResponsiveText>
      );
      
      const text = screen.getByTestId('hero-text');
      expect(text).toHaveStyle({
        fontSize: 'clamp(3rem, 8vw, 8rem)',
        fontWeight: '700',
      });
    });

    it('renders with custom element type', () => {
      render(
        <ResponsiveText as="h1" variant="title" data-testid="title-text">
          Title Text
        </ResponsiveText>
      );
      
      const text = screen.getByTestId('title-text');
      expect(text.tagName).toBe('H1');
    });

    it('applies custom className and styles', () => {
      render(
        <ResponsiveText 
          className="custom-class" 
          style={{ color: 'red' }}
          data-testid="custom-text"
        >
          Custom Text
        </ResponsiveText>
      );
      
      const text = screen.getByTestId('custom-text');
      expect(text).toHaveClass('custom-class');
      expect(text).toHaveStyle({ color: 'red' });
    });
  });

  describe('LazyLoad', () => {
    it('renders fallback initially when not in viewport', () => {
      render(
        <LazyLoad fallback={<div data-testid="fallback">Loading...</div>}>
          <div data-testid="content">Content</div>
        </LazyLoad>
      );
      
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('renders content immediately when priority is true', () => {
      render(
        <LazyLoad priority fallback={<div data-testid="fallback">Loading...</div>}>
          <div data-testid="content">Content</div>
        </LazyLoad>
      );
      
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
    });
  });

  describe('TouchButton', () => {
    it('renders with touch-friendly styles on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TouchButton data-testid="touch-button">
          Touch Me
        </TouchButton>
      );
      
      const button = screen.getByTestId('touch-button');
      expect(button).toHaveClass('touch-manipulation');
    });

    it('handles click events', () => {
      const handleClick = jest.fn();
      
      render(
        <TouchButton onClick={handleClick} data-testid="touch-button">
          Click Me
        </TouchButton>
      );
      
      const button = screen.getByTestId('touch-button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation', () => {
      const handleClick = jest.fn();
      
      render(
        <TouchButton onClick={handleClick} data-testid="touch-button">
          Click Me
        </TouchButton>
      );
      
      const button = screen.getByTestId('touch-button');
      fireEvent.keyDown(button, { key: 'Enter' });
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies correct variant styles', () => {
      render(
        <TouchButton variant="primary" data-testid="primary-button">
          Primary
        </TouchButton>
      );
      
      const button = screen.getByTestId('primary-button');
      expect(button).toHaveClass('bg-gradient-to-r', 'from-orange-500', 'to-pink-500');
    });
  });
});

// Test component for useResponsive hook
function TestResponsiveComponent() {
  const { isMobile, isTablet, isDesktop, breakpoint, width } = useResponsive();
  
  return (
    <div data-testid="responsive-info">
      <span data-testid="is-mobile">{isMobile.toString()}</span>
      <span data-testid="is-tablet">{isTablet.toString()}</span>
      <span data-testid="is-desktop">{isDesktop.toString()}</span>
      <span data-testid="breakpoint">{breakpoint}</span>
      <span data-testid="width">{width}</span>
    </div>
  );
}

describe('useResponsive hook', () => {
  it('detects mobile viewport correctly', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<TestResponsiveComponent />);
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('false');
    expect(screen.getByTestId('breakpoint')).toHaveTextContent('xs');
  });

  it('detects tablet viewport correctly', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<TestResponsiveComponent />);
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('true');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('false');
    expect(screen.getByTestId('breakpoint')).toHaveTextContent('md');
  });

  it('detects desktop viewport correctly', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(<TestResponsiveComponent />);
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('true');
    expect(screen.getByTestId('breakpoint')).toHaveTextContent('lg');
  });
});