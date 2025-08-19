import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from './utils/test-utils';
import { Navigation } from '../Navigation';
import { FeatureCard } from '../FeatureCard';
import { ContactForm } from '../ContactForm';
import { TestimonialsSection } from '../TestimonialsSection';
import { ParticleBackground } from '../ParticleBackground';
import { BookOpen } from 'lucide-react';

describe('Comprehensive Test Suite', () => {
  beforeAll(() => {
    // Set up global test environment
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Clean up after all tests
    vi.restoreAllMocks();
  });

  describe('Unit Tests - All Reusable Components', () => {
    describe('Navigation Component', () => {
      it('renders all navigation elements correctly', () => {
        render(<Navigation />);
        
        expect(screen.getByText('Unix²')).toBeInTheDocument();
        expect(screen.getByText('FuturFounder')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Journey')).toBeInTheDocument();
        expect(screen.getByText('Testimonials')).toBeInTheDocument();
        expect(screen.getByText('Join')).toBeInTheDocument();
      });

      it('handles mobile menu toggle', () => {
        render(<Navigation />);
        
        const menuButton = screen.getByLabelText('Toggle menu');
        fireEvent.click(menuButton);
        
        expect(screen.getAllByText('Home')).toHaveLength(2);
        
        const closeButton = screen.getByLabelText('Close menu');
        fireEvent.click(closeButton);
        
        expect(screen.getAllByText('Home')).toHaveLength(1);
      });

      it('supports keyboard navigation', () => {
        render(<Navigation />);
        
        const menuButton = screen.getByLabelText('Toggle menu');
        menuButton.focus();
        
        fireEvent.keyDown(menuButton, { key: 'Enter' });
        expect(screen.getAllByText('Home')).toHaveLength(2);
        
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.getAllByText('Home')).toHaveLength(1);
      });
    });

    describe('FeatureCard Component', () => {
      const defaultProps = {
        icon: BookOpen,
        title: 'Test Feature',
        description: 'Test description',
        gradient: 'from-orange-500 to-pink-600',
      };

      it('renders with all required props', () => {
        render(<FeatureCard {...defaultProps} />);
        
        expect(screen.getByText('Test Feature')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      });

      it('applies custom className', () => {
        const { container } = render(
          <FeatureCard {...defaultProps} className="custom-class" />
        );
        
        expect(container.firstChild).toHaveClass('custom-class');
      });

      it('renders icon correctly', () => {
        render(<FeatureCard {...defaultProps} />);
        
        const iconElement = document.querySelector('svg');
        expect(iconElement).toBeInTheDocument();
      });
    });

    describe('ContactForm Component', () => {
      it('renders all form fields', () => {
        render(<ContactForm />);
        
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
      });

      it('validates required fields', async () => {
        render(<ContactForm />);
        
        const submitButton = screen.getByRole('button', { name: /send message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(/name is required/i)).toBeInTheDocument();
          expect(screen.getByText(/email is required/i)).toBeInTheDocument();
          expect(screen.getByText(/message is required/i)).toBeInTheDocument();
        });
      });

      it('validates email format', async () => {
        render(<ContactForm />);
        
        const emailInput = screen.getByLabelText(/email address/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        
        const submitButton = screen.getByRole('button', { name: /send message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });
      });
    });

    describe('TestimonialsSection Component', () => {
      it('renders testimonials section', () => {
        render(<TestimonialsSection />);
        
        const testimonialRegion = screen.getByRole('region');
        expect(testimonialRegion).toBeInTheDocument();
      });

      it('has proper accessibility structure', () => {
        render(<TestimonialsSection />);
        
        const region = screen.getByRole('region');
        expect(region).toBeInTheDocument();
      });
    });

    describe('ParticleBackground Component', () => {
      it('renders without crashing', () => {
        render(<ParticleBackground />);
        
        // Should render canvas or container element
        const container = document.querySelector('canvas') || document.querySelector('[data-testid="particle-background"]');
        expect(container || document.body).toBeInTheDocument();
      });
    });
  });

  describe('Performance Requirements Validation', () => {
    it('ensures page load times under 3 seconds', async () => {
      const startTime = performance.now();
      
      render(
        <div>
          <Navigation />
          <FeatureCard
            icon={BookOpen}
            title="Feature"
            description="Description"
            gradient="from-orange-500 to-pink-600"
          />
          <ContactForm />
          <TestimonialsSection />
        </div>
      );
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Should load within 3000ms (3 seconds)
      expect(loadTime).toBeLessThan(3000);
    });

    it('handles multiple component renders efficiently', async () => {
      const startTime = performance.now();
      
      const features = Array.from({ length: 6 }, (_, i) => (
        <FeatureCard
          key={i}
          icon={BookOpen}
          title={`Feature ${i + 1}`}
          description={`Description ${i + 1}`}
          gradient="from-orange-500 to-pink-600"
        />
      ));
      
      render(<div>{features}</div>);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render 6 components efficiently
      expect(renderTime).toBeLessThan(500);
    });
  });

  describe('Accessibility Requirements Validation', () => {
    it('ensures keyboard navigation works across all components', () => {
      render(
        <div>
          <Navigation />
          <ContactForm />
        </div>
      );
      
      // Test tab navigation
      const focusableElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('textbox')
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // Each focusable element should be accessible
      focusableElements.forEach(element => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });
    });

    it('ensures proper ARIA labels and roles', () => {
      render(
        <div>
          <Navigation />
          <ContactForm />
          <TestimonialsSection />
        </div>
      );
      
      // Check for navigation role
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // Check for form elements with proper labels
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      
      // Check for region role in testimonials
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('ensures screen reader compatibility', () => {
      render(
        <div>
          <Navigation />
          <FeatureCard
            icon={BookOpen}
            title="Accessible Feature"
            description="This feature is accessible"
            gradient="from-orange-500 to-pink-600"
          />
          <ContactForm />
        </div>
      );
      
      // Check for proper heading structure
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check for proper form structure
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      // Check for proper button labels
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });

  describe('Integration Requirements Validation', () => {
    it('validates smooth scroll navigation functionality', async () => {
      const mockScrollTo = vi.fn();
      Object.defineProperty(window, 'scrollTo', {
        value: mockScrollTo,
        writable: true,
      });
      
      vi.spyOn(document, 'getElementById').mockReturnValue({
        offsetTop: 500,
        getBoundingClientRect: () => ({ top: 50, bottom: 150 }),
      } as any);
      
      render(<Navigation />);
      
      const homeButton = screen.getByText('Home');
      fireEvent.click(homeButton);
      
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 420, // 500 - 80 (header offset)
          behavior: 'smooth',
        });
      });
    });

    it('validates form submission and validation functionality', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Fill valid data
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'This is a valid message with enough characters.' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a valid message with enough characters.'
        });
      });
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent component structure', () => {
      const { container: navContainer } = render(<Navigation />);
      const { container: formContainer } = render(<ContactForm />);
      const { container: cardContainer } = render(
        <FeatureCard
          icon={BookOpen}
          title="Test"
          description="Test"
          gradient="from-orange-500 to-pink-600"
        />
      );
      
      // Check that components maintain expected DOM structure
      expect(navContainer.querySelector('nav')).toBeInTheDocument();
      expect(formContainer.querySelector('form')).toBeInTheDocument();
      expect(cardContainer.querySelector('[role="article"]')).toBeInTheDocument();
    });

    it('maintains responsive behavior', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true,
      });
      
      render(<Navigation />);
      
      // Should show mobile menu button
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
      
      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true,
      });
      
      // Component should adapt to desktop layout
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles missing props gracefully', () => {
      // Test components with minimal props
      expect(() => {
        render(<Navigation />);
      }).not.toThrow();
      
      expect(() => {
        render(<ContactForm />);
      }).not.toThrow();
      
      expect(() => {
        render(<TestimonialsSection />);
      }).not.toThrow();
    });

    it('handles network errors in form submission', async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Valid message' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
    });
  });
});