import React from 'react';
import { render, screen } from './utils/test-utils';
import { BookOpen } from 'lucide-react';
import { FeatureCard } from '../FeatureCard';

describe('FeatureCard', () => {
  const defaultProps = {
    icon: BookOpen,
    title: 'Test Feature',
    description: 'This is a test feature description',
    gradient: 'from-orange-500 to-pink-600',
  };

  it('renders with required props', () => {
    render(<FeatureCard {...defaultProps} />);
    
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('This is a test feature description')).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FeatureCard {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders icon component', () => {
    render(<FeatureCard {...defaultProps} />);
    
    // Check if the icon is rendered (BookOpen icon should be present)
    const iconElement = document.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });

  it('applies gradient classes correctly', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    
    // Check if gradient classes are applied
    const gradientElements = container.querySelectorAll('[class*="from-orange-500"]');
    expect(gradientElements.length).toBeGreaterThan(0);
  });

  it('has proper accessibility structure', () => {
    render(<FeatureCard {...defaultProps} />);
    
    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Feature');
  });

  it('includes hover indicator element', () => {
    render(<FeatureCard {...defaultProps} />);
    
    const learnMore = screen.getByText('Learn more');
    expect(learnMore).toBeInTheDocument();
  });
});