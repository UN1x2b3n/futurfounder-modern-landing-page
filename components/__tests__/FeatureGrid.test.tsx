import React from 'react';
import { render, screen } from '@testing-library/react';
import { BookOpen, Rocket, Globe } from 'lucide-react';
import { FeatureGrid } from '../FeatureGrid';

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

// Mock FeatureCard component
jest.mock('../FeatureCard', () => ({
  FeatureCard: ({ title, description }: any) => (
    <div data-testid="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

describe('FeatureGrid', () => {
  const mockFeatures = [
    {
      icon: BookOpen,
      title: 'Feature 1',
      description: 'Description 1',
      gradient: 'from-orange-500 to-pink-600',
    },
    {
      icon: Rocket,
      title: 'Feature 2',
      description: 'Description 2',
      gradient: 'from-pink-500 to-red-600',
    },
    {
      icon: Globe,
      title: 'Feature 3',
      description: 'Description 3',
      gradient: 'from-red-500 to-rose-600',
    },
  ];

  it('renders all provided features', () => {
    render(<FeatureGrid features={mockFeatures} />);
    
    expect(screen.getAllByTestId('feature-card')).toHaveLength(3);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('renders section title and subtitle when provided', () => {
    render(
      <FeatureGrid
        features={mockFeatures}
        title="Our Features"
        subtitle="Amazing features for everyone"
      />
    );
    
    expect(screen.getByText('Our Features')).toBeInTheDocument();
    expect(screen.getByText('Amazing features for everyone')).toBeInTheDocument();
  });

  it('limits features to maximum of 6 items', () => {
    const manyFeatures = Array.from({ length: 10 }, (_, i) => ({
      icon: BookOpen,
      title: `Feature ${i + 1}`,
      description: `Description ${i + 1}`,
      gradient: 'from-orange-500 to-pink-600',
    }));

    render(<FeatureGrid features={manyFeatures} />);
    
    // Should only render 6 feature cards
    expect(screen.getAllByTestId('feature-card')).toHaveLength(6);
  });

  it('applies custom className', () => {
    const { container } = render(
      <FeatureGrid features={mockFeatures} className="custom-grid-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-grid-class');
  });

  it('has proper responsive grid classes', () => {
    const { container } = render(<FeatureGrid features={mockFeatures} />);
    
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2', 
      'lg:grid-cols-3',
      'xl:grid-cols-4'
    );
  });

  it('renders without title and subtitle', () => {
    render(<FeatureGrid features={mockFeatures} />);
    
    // Should still render the feature cards
    expect(screen.getAllByTestId('feature-card')).toHaveLength(3);
  });
});