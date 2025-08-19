import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from './utils/test-utils';
import { Navigation } from '../Navigation';

// Mock scroll behavior
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('Navigation', () => {
  beforeEach(() => {
    // Mock getElementById
    const mockElement = {
      offsetTop: 100,
      getBoundingClientRect: () => ({
        top: 50,
        bottom: 150,
      }),
    };
    
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation with default menu items', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Unix²')).toBeInTheDocument();
    expect(screen.getByText('FuturFounder')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Journey')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
  });

  it('handles smooth scroll navigation', async () => {
    render(<Navigation />);
    
    const homeButton = screen.getByText('Home');
    fireEvent.click(homeButton);
    
    await waitFor(() => {
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 20, // 100 - 80 (header offset)
        behavior: 'smooth',
      });
    });
  });

  it('opens and closes mobile menu', () => {
    render(<Navigation />);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    // Mobile menu should be visible
    expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop + mobile
    
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    
    // Mobile menu should be closed
    expect(screen.getAllByText('Home')).toHaveLength(1); // Only desktop
  });

  it('closes mobile menu on escape key', () => {
    render(<Navigation />);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    // Press escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    // Mobile menu should be closed
    expect(screen.getAllByText('Home')).toHaveLength(1);
  });

  it('updates active section on scroll', () => {
    render(<Navigation />);
    
    // Mock scroll event
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    // Should update the navigation state
    expect(document.getElementById).toHaveBeenCalled();
  });

  it('applies scrolled styles when scrolled', () => {
    render(<Navigation />);
    
    // Mock scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    // The header should have scrolled styles applied
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white/95');
  });
});