import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, setViewport, takeScreenshot } from '../utils/test-utils';
import { Navigation } from '../../Navigation';
import { FeatureCard } from '../../FeatureCard';
import { ContactForm } from '../../ContactForm';
import { TestimonialsSection } from '../../TestimonialsSection';
import { BookOpen, Users, Zap, Target } from 'lucide-react';

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    // Reset viewport before each test
    setViewport(1024, 768);
  });

  afterEach(() => {
    // Clean up after each test
    setViewport(1024, 768);
  });

  describe('Responsive Breakpoints', () => {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large-desktop', width: 1440, height: 900 },
    ];

    breakpoints.forEach(({ name, width, height }) => {
      describe(`${name} (${width}x${height})`, () => {
        beforeEach(() => {
          setViewport(width, height);
        });

        it(`Navigation renders correctly on ${name}`, async () => {
          const { container } = render(<Navigation />);
          
          // Wait for any animations to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Take screenshot for visual comparison
          const screenshot = await takeScreenshot(container);
          expect(screenshot).toMatchSnapshot(`navigation-${name}.png`);
          
          // Check responsive behavior
          if (width < 768) {
            // Mobile: should show hamburger menu
            const menuButton = container.querySelector('[aria-label="Toggle menu"]');
            expect(menuButton).toBeInTheDocument();
          } else {
            // Desktop: should show full navigation
            const navItems = container.querySelectorAll('nav a');
            expect(navItems.length).toBeGreaterThan(0);
          }
        });

        it(`FeatureCard renders correctly on ${name}`, async () => {
          const { container } = render(
            <FeatureCard
              icon={BookOpen}
              title="Test Feature"
              description="This is a test feature description that should wrap properly on different screen sizes"
              gradient="from-orange-500 to-pink-600"
            />
          );
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const screenshot = await takeScreenshot(container);
          expect(screenshot).toMatchSnapshot(`feature-card-${name}.png`);
          
          // Check text wrapping and layout
          const title = container.querySelector('h3');
          const description = container.querySelector('p');
          expect(title).toBeVisible();
          expect(description).toBeVisible();
        });

        it(`ContactForm renders correctly on ${name}`, async () => {
          const { container } = render(<ContactForm />);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const screenshot = await takeScreenshot(container);
          expect(screenshot).toMatchSnapshot(`contact-form-${name}.png`);
          
          // Check form layout
          const inputs = container.querySelectorAll('input, textarea');
          inputs.forEach(input => {
            expect(input).toBeVisible();
          });
        });

        it(`TestimonialsSection renders correctly on ${name}`, async () => {
          const { container } = render(<TestimonialsSection />);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const screenshot = await takeScreenshot(container);
          expect(screenshot).toMatchSnapshot(`testimonials-${name}.png`);
        });
      });
    });
  });

  describe('Component States', () => {
    it('Navigation shows different states correctly', async () => {
      const { container, rerender } = render(<Navigation />);
      
      // Default state
      let screenshot = await takeScreenshot(container);
      expect(screenshot).toMatchSnapshot('navigation-default.png');
      
      // Mobile menu open state (simulate mobile)
      setViewport(375, 667);
      rerender(<Navigation />);
      
      // Simulate menu open
      const menuButton = container.querySelector('[aria-label="Toggle menu"]') as HTMLElement;
      if (menuButton) {
        menuButton.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        
        screenshot = await takeScreenshot(container);
        expect(screenshot).toMatchSnapshot('navigation-mobile-open.png');
      }
    });

    it('ContactForm shows validation states correctly', async () => {
      const { container } = render(<ContactForm />);
      
      // Submit empty form to trigger validation
      const submitButton = container.querySelector('button[type="submit"]') as HTMLElement;
      submitButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const screenshot = await takeScreenshot(container);
      expect(screenshot).toMatchSnapshot('contact-form-validation-errors.png');
    });

    it('FeatureCard shows hover states correctly', async () => {
      const { container } = render(
        <FeatureCard
          icon={BookOpen}
          title="Test Feature"
          description="Test description"
          gradient="from-orange-500 to-pink-600"
        />
      );
      
      // Default state
      let screenshot = await takeScreenshot(container);
      expect(screenshot).toMatchSnapshot('feature-card-default.png');
      
      // Simulate hover state
      const card = container.querySelector('[role="article"]') as HTMLElement;
      if (card) {
        card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 200));
        
        screenshot = await takeScreenshot(container);
        expect(screenshot).toMatchSnapshot('feature-card-hover.png');
      }
    });
  });

  describe('Grid Layouts', () => {
    it('FeatureGrid renders correctly with multiple cards', async () => {
      const features = [
        { icon: BookOpen, title: 'Feature 1', description: 'Description 1', gradient: 'from-orange-500 to-pink-600' },
        { icon: Users, title: 'Feature 2', description: 'Description 2', gradient: 'from-blue-500 to-purple-600' },
        { icon: Zap, title: 'Feature 3', description: 'Description 3', gradient: 'from-green-500 to-teal-600' },
        { icon: Target, title: 'Feature 4', description: 'Description 4', gradient: 'from-red-500 to-orange-600' },
      ];
      
      const { container } = render(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      );
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await takeScreenshot(container);
      expect(screenshot).toMatchSnapshot('feature-grid-desktop.png');
      
      // Test mobile layout
      setViewport(375, 667);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mobileScreenshot = await takeScreenshot(container);
      expect(mobileScreenshot).toMatchSnapshot('feature-grid-mobile.png');
    });
  });

  describe('Typography and Spacing', () => {
    it('maintains consistent typography hierarchy', async () => {
      const { container } = render(
        <div className="space-y-8 p-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Main Heading
          </h1>
          <h2 className="text-4xl font-bold text-gray-900">
            Section Heading
          </h2>
          <h3 className="text-2xl font-semibold text-gray-800">
            Subsection Heading
          </h3>
          <p className="text-lg text-gray-600">
            Body text that should maintain proper line height and spacing for optimal readability.
          </p>
          <p className="text-base text-gray-500">
            Secondary text with smaller size but still readable.
          </p>
        </div>
      );
      
      const screenshot = await takeScreenshot(container);
      expect(screenshot).toMatchSnapshot('typography-hierarchy.png');
    });

    it('maintains consistent spacing system', async () => {
      const { container } = render(
        <div className="space-y-4 p-6">
          <div className="bg-orange-100 p-4 rounded-lg">Section 1</div>
          <div className="bg-pink-100 p-6 rounded-lg">Section 2</div>
          <div className="bg-blue-100 p-8 rounded-lg">Section 3</div>
        </div>
      );
      
      const screenshot = await takeScreenshot(container);
      expect(screenshot).toMatchSnapshot('spacing-system.png');
    });
  });

  describe('Color and Gradients', () => {
    it('renders gradients consistently', async () => {
      const { container } = render(
        <div className="grid grid-cols-2 gap-4 p-6">
          <div className="h-32 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg"></div>
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
          <div className="h-32 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg"></div>
          <div className="h-32 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg"></div>
        </div>
      );
      
      const screenshot = await takeScreenshot(container);
      expect(screenshot).toMatchSnapshot('gradient-colors.png');
    });
  });
});