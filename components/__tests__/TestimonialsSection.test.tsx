import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestimonialsSection } from '../TestimonialsSection';

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ImageWithFallback
jest.mock('../figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

describe('TestimonialsSection', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders testimonials section with initial testimonial', () => {
    render(<TestimonialsSection />);
    
    expect(screen.getByText('Success Stories')).toBeInTheDocument();
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('AI Startup Founder')).toBeInTheDocument();
    expect(screen.getByText('TechVision AI')).toBeInTheDocument();
  });

  it('displays customer photos and ratings', () => {
    render(<TestimonialsSection />);
    
    const customerImage = screen.getByAltText('Sarah Chen');
    expect(customerImage).toBeInTheDocument();
    
    // Check for rating stars (they should be present in the DOM)
    const starsContainer = screen.getByText('Sarah Chen').closest('.flex-1');
    expect(starsContainer).toBeInTheDocument();
  });

  it('shows achievement badges', () => {
    render(<TestimonialsSection />);
    
    expect(screen.getByText('$2M Series A raised')).toBeInTheDocument();
  });

  it('displays trust indicators and statistics', () => {
    render(<TestimonialsSection />);
    
    expect(screen.getByText('Trusted by founders from')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Successful Founders')).toBeInTheDocument();
    expect(screen.getByText('$50M+')).toBeInTheDocument();
    expect(screen.getByText('Total Funding Raised')).toBeInTheDocument();
  });

  it('provides navigation controls', () => {
    render(<TestimonialsSection />);
    
    // Check for navigation dots
    const dots = screen.getAllByLabelText(/Go to testimonial/);
    expect(dots).toHaveLength(5); // 5 testimonials
    
    // Check for arrow controls (desktop only)
    expect(screen.getByLabelText('Previous testimonial')).toBeInTheDocument();
    expect(screen.getByLabelText('Next testimonial')).toBeInTheDocument();
  });

  it('navigates to next testimonial when next button is clicked', async () => {
    render(<TestimonialsSection />);
    
    const nextButton = screen.getByLabelText('Next testimonial');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Marcus Rodriguez')).toBeInTheDocument();
    });
  });

  it('navigates to previous testimonial when previous button is clicked', async () => {
    render(<TestimonialsSection />);
    
    // First go to next testimonial
    const nextButton = screen.getByLabelText('Next testimonial');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Marcus Rodriguez')).toBeInTheDocument();
    });
    
    // Then go back to previous
    const prevButton = screen.getByLabelText('Previous testimonial');
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    });
  });

  it('navigates to specific testimonial when dot is clicked', async () => {
    render(<TestimonialsSection />);
    
    const thirdDot = screen.getByLabelText('Go to testimonial 3');
    fireEvent.click(thirdDot);
    
    await waitFor(() => {
      expect(screen.getByText('Priya Patel')).toBeInTheDocument();
    });
  });

  it('shows mobile swipe indicator on mobile', () => {
    render(<TestimonialsSection />);
    
    expect(screen.getByText('Swipe to navigate')).toBeInTheDocument();
  });

  it('pauses auto-play on mouse enter and resumes on mouse leave', async () => {
    render(<TestimonialsSection />);
    
    const container = screen.getByText('Success Stories').closest('section');
    
    // Mouse enter should pause auto-play
    fireEvent.mouseEnter(container!);
    
    // Auto-play indicator should not be visible when paused
    expect(screen.queryByText('Auto-playing')).not.toBeInTheDocument();
    
    // Mouse leave should resume auto-play
    fireEvent.mouseLeave(container!);
    
    await waitFor(() => {
      expect(screen.getByText('Auto-playing')).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation for accessibility', () => {
    render(<TestimonialsSection />);
    
    const nextButton = screen.getByLabelText('Next testimonial');
    const prevButton = screen.getByLabelText('Previous testimonial');
    const firstDot = screen.getByLabelText('Go to testimonial 1');
    
    // Check that buttons are focusable
    nextButton.focus();
    expect(document.activeElement).toBe(nextButton);
    
    prevButton.focus();
    expect(document.activeElement).toBe(prevButton);
    
    firstDot.focus();
    expect(document.activeElement).toBe(firstDot);
  });
});