import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

// Mock framer motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

// Mock the ParticleBackground component
jest.mock('../ParticleBackground', () => ({
  ParticleBackground: () => <div data-testid="particle-background" />,
}));

// Mock other components
jest.mock('../Navigation', () => ({
  Navigation: () => <nav data-testid="navigation" />,
}));

jest.mock('../AnimatedStats', () => ({
  AnimatedStats: () => <div data-testid="animated-stats" />,
}));

jest.mock('../TestimonialsSection', () => ({
  TestimonialsSection: () => <div data-testid="testimonials" />,
}));

describe('Hero Section Accessibility', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('has proper semantic HTML structure', () => {
    render(<App />);
    
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toHaveAttribute('aria-label', 'Hero section introducing FuturFounder');
    expect(heroSection).toHaveAttribute('id', 'hero');
  });

  it('has proper ARIA labels for main heading', () => {
    render(<App />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveAttribute('aria-label', 'FuturFounder - Main heading');
    expect(mainHeading).toHaveTextContent('FuturFounder');
  });

  it('has proper ARIA labels for description', () => {
    render(<App />);
    
    const description = screen.getByRole('text', { name: /We're building the next generation/ });
    expect(description).toHaveAttribute('aria-describedby', 'hero-description');
    expect(description).toHaveAttribute('id', 'hero-description');
  });

  it('has keyboard navigation support for CTA buttons', () => {
    render(<App />);
    
    const joinButton = screen.getByRole('button', { name: 'Join the FuturFounder community' });
    const learnMoreButton = screen.getByRole('button', { name: 'Learn more about the FuturFounder journey' });
    
    expect(joinButton).toHaveAttribute('tabIndex', '0');
    expect(learnMoreButton).toHaveAttribute('tabIndex', '0');
  });

  it('handles keyboard events on CTA buttons', () => {
    render(<App />);
    
    const joinButton = screen.getByRole('button', { name: 'Join the FuturFounder community' });
    
    // Test Enter key
    fireEvent.keyDown(joinButton, { key: 'Enter' });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    
    // Test Space key
    fireEvent.keyDown(joinButton, { key: ' ' });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('has proper focus styles', () => {
    render(<App />);
    
    const joinButton = screen.getByRole('button', { name: 'Join the FuturFounder community' });
    expect(joinButton).toHaveClass('focus:outline-none', 'focus:ring-4', 'focus:ring-white/50');
  });

  it('has responsive typography with clamp functions', () => {
    render(<App />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveStyle({ fontSize: 'clamp(3rem, 8vw, 8rem)' });
  });

  it('has proper will-change properties for performance', () => {
    render(<App />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveStyle({ willChange: 'transform' });
  });
});