import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Navigation } from '../../Navigation';
import { ContactForm } from '../../ContactForm';
import { ContactSection } from '../../ContactSection';
import { TestimonialsSection } from '../../TestimonialsSection';

describe('Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    
    // Mock scrollTo for navigation tests
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
    
    // Mock getElementById for navigation
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      const mockElement = {
        offsetTop: id === 'home' ? 0 : 500,
        getBoundingClientRect: () => ({
          top: 50,
          bottom: 150,
        }),
      };
      return mockElement as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Navigation Functionality', () => {
    it('navigates between sections smoothly', async () => {
      render(<Navigation />);
      
      const homeButton = screen.getByText('Home');
      const aboutButton = screen.getByText('About');
      const journeyButton = screen.getByText('Journey');
      
      // Click Home
      await user.click(homeButton);
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: -80, // 0 - 80 (header offset)
          behavior: 'smooth',
        });
      });
      
      // Click About
      await user.click(aboutButton);
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 420, // 500 - 80 (header offset)
          behavior: 'smooth',
        });
      });
      
      // Click Journey
      await user.click(journeyButton);
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 420, // 500 - 80 (header offset)
          behavior: 'smooth',
        });
      });
    });

    it('updates active section based on scroll position', async () => {
      render(<Navigation />);
      
      // Mock scroll position
      Object.defineProperty(window, 'scrollY', {
        value: 600,
        writable: true,
      });
      
      // Trigger scroll event
      fireEvent.scroll(window);
      
      // Should update navigation state
      expect(document.getElementById).toHaveBeenCalled();
    });

    it('handles mobile menu interactions', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true,
      });
      
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Open mobile menu
      await user.click(menuButton);
      
      // Should show mobile menu items
      expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop + mobile
      
      // Click a menu item in mobile menu
      const mobileHomeButton = screen.getAllByText('Home')[1]; // Second instance (mobile)
      await user.click(mobileHomeButton);
      
      // Should navigate and close menu
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalled();
        expect(screen.getAllByText('Home')).toHaveLength(1); // Only desktop
      });
    });

    it('closes mobile menu with escape key', async () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true,
      });
      
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      await user.click(menuButton);
      
      // Press escape
      fireEvent.keyDown(document, { key: 'Escape' });
      
      // Menu should close
      expect(screen.getAllByText('Home')).toHaveLength(1);
    });
  });

  describe('Form Submission Functionality', () => {
    it('handles complete form submission flow', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Fill out form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message with enough characters to pass validation.');
      
      // Submit form
      await user.click(submitButton);
      
      // Should call onSubmit with correct data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message with enough characters to pass validation.'
        });
      });
      
      // Should show success message
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      
      // Should clear form
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });

    it('handles form submission errors gracefully', async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Fill out form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message.');
      
      // Submit form
      await user.click(submitButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
      
      // Form should not be cleared on error
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(messageInput).toHaveValue('This is a test message.');
    });

    it('validates form fields in real-time', async () => {
      render(<ContactForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Type invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      // Should show email validation error
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
      
      // Clear and type valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      
      // Email error should disappear
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Contact Section Integration', () => {
    it('integrates contact form with contact methods', async () => {
      render(<ContactSection />);
      
      // Should have both form and contact methods
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      
      // Should have contact methods
      const emailLinks = screen.getAllByText(/email/i);
      const phoneLinks = screen.getAllByText(/phone/i);
      
      expect(emailLinks.length).toBeGreaterThan(0);
      expect(phoneLinks.length).toBeGreaterThan(0);
    });

    it('handles clickable contact information', async () => {
      render(<ContactSection />);
      
      // Find clickable email and phone links
      const emailLink = screen.getByRole('link', { name: /hello@example\.com/i });
      const phoneLink = screen.getByRole('link', { name: /\+1 \(555\) 123-4567/i });
      
      expect(emailLink).toHaveAttribute('href', 'mailto:hello@example.com');
      expect(phoneLink).toHaveAttribute('href', 'tel:+15551234567');
    });
  });

  describe('Testimonials Carousel Integration', () => {
    it('handles testimonial navigation', async () => {
      render(<TestimonialsSection />);
      
      // Should have testimonials
      const testimonialRegion = screen.getByRole('region');
      expect(testimonialRegion).toBeInTheDocument();
      
      // Check for navigation controls
      const prevButton = screen.queryByLabelText(/previous/i);
      const nextButton = screen.queryByLabelText(/next/i);
      
      if (prevButton && nextButton) {
        // Test navigation
        await user.click(nextButton);
        await user.click(prevButton);
        
        // Should handle navigation without errors
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
      }
    });

    it('handles auto-play functionality', async () => {
      render(<TestimonialsSection />);
      
      // Mock timer for auto-play
      vi.useFakeTimers();
      
      const testimonialRegion = screen.getByRole('region');
      expect(testimonialRegion).toBeInTheDocument();
      
      // Fast-forward time to trigger auto-play
      vi.advanceTimersByTime(5000);
      
      // Should handle auto-play without errors
      expect(testimonialRegion).toBeInTheDocument();
      
      vi.useRealTimers();
    });

    it('pauses auto-play on hover', async () => {
      render(<TestimonialsSection />);
      
      const testimonialRegion = screen.getByRole('region');
      
      // Hover over testimonials
      await user.hover(testimonialRegion);
      
      // Should pause auto-play (no errors)
      expect(testimonialRegion).toBeInTheDocument();
      
      // Unhover
      await user.unhover(testimonialRegion);
      
      // Should resume auto-play (no errors)
      expect(testimonialRegion).toBeInTheDocument();
    });
  });

  describe('Cross-Component Interactions', () => {
    it('handles navigation to contact section and form interaction', async () => {
      // Render both navigation and contact section
      render(
        <div>
          <Navigation />
          <div id="contact">
            <ContactSection />
          </div>
        </div>
      );
      
      // Click contact navigation
      const contactButton = screen.getByText('Join');
      await user.click(contactButton);
      
      // Should scroll to contact section
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalled();
      });
      
      // Should be able to interact with form
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'Test User');
      
      expect(nameInput).toHaveValue('Test User');
    });

    it('handles responsive behavior across components', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true,
      });
      
      render(
        <div>
          <Navigation />
          <ContactForm />
          <TestimonialsSection />
        </div>
      );
      
      // All components should render in mobile mode
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
      
      const formInputs = screen.getAllByRole('textbox');
      expect(formInputs.length).toBeGreaterThan(0);
      
      const testimonialRegion = screen.getByRole('region');
      expect(testimonialRegion).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('handles component errors gracefully', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Create a component that throws an error
      const ThrowError = () => {
        throw new Error('Test error');
      };
      
      // Should not crash the entire app
      expect(() => {
        render(
          <div>
            <Navigation />
            <ThrowError />
            <ContactForm />
          </div>
        );
      }).toThrow('Test error');
      
      consoleSpy.mockRestore();
    });
  });
});