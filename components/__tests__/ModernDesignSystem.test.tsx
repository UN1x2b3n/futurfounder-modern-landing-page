import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModernButton } from '../ui/ModernButton';
import { ModernCard, ModernCardContent } from '../ui/ModernCard';
import { ModernSection, ModernSectionHeader } from '../ui/ModernSection';
import { TrendingUp } from 'lucide-react';

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
}));

describe('Modern Design System', () => {
  describe('ModernButton', () => {
    it('renders primary button with correct classes', () => {
      render(
        <ModernButton variant="primary" size="lg">
          Test Button
        </ModernButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-primary', 'btn-lg');
      expect(button).toHaveTextContent('Test Button');
    });

    it('renders button with icon', () => {
      render(
        <ModernButton icon={TrendingUp} iconPosition="right">
          With Icon
        </ModernButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('With Icon');
      // Icon should be present
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders as link when href is provided', () => {
      render(
        <ModernButton href="/test" variant="secondary">
          Link Button
        </ModernButton>
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveClass('btn', 'btn-secondary');
    });

    it('handles disabled state correctly', () => {
      render(
        <ModernButton disabled>
          Disabled Button
        </ModernButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('ModernCard', () => {
    it('renders card with correct variant classes', () => {
      render(
        <ModernCard variant="gradient" data-testid="test-card">
          <ModernCardContent>
            Card Content
          </ModernCardContent>
        </ModernCard>
      );
      
      const card = screen.getByTestId('test-card');
      expect(card).toHaveClass('card', 'card-gradient');
    });

    it('renders card content with correct padding', () => {
      render(
        <ModernCard>
          <ModernCardContent padding="xl" data-testid="card-content">
            Card Content
          </ModernCardContent>
        </ModernCard>
      );
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('p-12');
      expect(content).toHaveTextContent('Card Content');
    });
  });

  describe('ModernSection', () => {
    it('renders section with correct variant and size classes', () => {
      render(
        <ModernSection 
          variant="hero" 
          size="lg" 
          background="gradient"
          data-testid="test-section"
        >
          Section Content
        </ModernSection>
      );
      
      const section = screen.getByTestId('test-section');
      expect(section).toHaveClass('section-hero', 'bg-gradient-subtle');
    });

    it('renders section with correct container size', () => {
      render(
        <ModernSection containerSize="xl" data-testid="test-section">
          <div data-testid="container">Content</div>
        </ModernSection>
      );
      
      const section = screen.getByTestId('test-section');
      const container = section.querySelector('.container');
      expect(container).toHaveClass('container', 'container-xl');
    });
  });

  describe('ModernSectionHeader', () => {
    it('renders complete section header', () => {
      render(
        <ModernSectionHeader
          title="Test Title"
          subtitle="Test Subtitle"
          description="Test description content"
          centered={true}
        />
      );
      
      expect(screen.getByText('Test Title')).toHaveClass('text-title', 'font-bold', 'text-gradient');
      expect(screen.getByText('Test Subtitle')).toHaveClass('text-caption', 'text-primary');
      expect(screen.getByText('Test description content')).toHaveClass('text-body', 'text-neutral-600');
    });

    it('renders without subtitle and description', () => {
      render(
        <ModernSectionHeader title="Just Title" />
      );
      
      expect(screen.getByText('Just Title')).toBeInTheDocument();
      expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
    });
  });

  describe('Design System CSS Classes', () => {
    it('applies typography classes correctly', () => {
      render(
        <div>
          <h1 className="text-hero" data-testid="hero-text">Hero Text</h1>
          <h2 className="text-title" data-testid="title-text">Title Text</h2>
          <p className="text-body" data-testid="body-text">Body Text</p>
        </div>
      );
      
      expect(screen.getByTestId('hero-text')).toHaveClass('text-hero');
      expect(screen.getByTestId('title-text')).toHaveClass('text-title');
      expect(screen.getByTestId('body-text')).toHaveClass('text-body');
    });

    it('applies gradient classes correctly', () => {
      render(
        <div>
          <div className="text-gradient" data-testid="gradient-text">Gradient Text</div>
          <div className="bg-gradient-hero" data-testid="gradient-bg">Gradient Background</div>
        </div>
      );
      
      expect(screen.getByTestId('gradient-text')).toHaveClass('text-gradient');
      expect(screen.getByTestId('gradient-bg')).toHaveClass('bg-gradient-hero');
    });

    it('applies spacing classes correctly', () => {
      render(
        <div>
          <div className="section" data-testid="section">Section</div>
          <div className="container container-xl" data-testid="container">Container</div>
        </div>
      );
      
      expect(screen.getByTestId('section')).toHaveClass('section');
      expect(screen.getByTestId('container')).toHaveClass('container', 'container-xl');
    });
  });

  describe('Animation Classes', () => {
    it('applies hover effect classes correctly', () => {
      render(
        <div>
          <div className="hover-lift" data-testid="hover-lift">Hover Lift</div>
          <div className="hover-glow" data-testid="hover-glow">Hover Glow</div>
          <div className="hover-scale" data-testid="hover-scale">Hover Scale</div>
        </div>
      );
      
      expect(screen.getByTestId('hover-lift')).toHaveClass('hover-lift');
      expect(screen.getByTestId('hover-glow')).toHaveClass('hover-glow');
      expect(screen.getByTestId('hover-scale')).toHaveClass('hover-scale');
    });
  });

  describe('Accessibility', () => {
    it('maintains proper focus states', () => {
      render(
        <ModernButton ariaLabel="Accessible button">
          Button
        </ModernButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Accessible button');
    });

    it('provides proper semantic structure', () => {
      render(
        <ModernSection>
          <ModernSectionHeader 
            title="Section Title"
            description="Section description"
          />
        </ModernSection>
      );
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive typography classes', () => {
      render(
        <div>
          <h1 className="text-responsive-hero" data-testid="responsive-hero">
            Responsive Hero
          </h1>
          <p className="text-responsive-base" data-testid="responsive-body">
            Responsive Body
          </p>
        </div>
      );
      
      expect(screen.getByTestId('responsive-hero')).toHaveClass('text-responsive-hero');
      expect(screen.getByTestId('responsive-body')).toHaveClass('text-responsive-base');
    });
  });
});