import { render, screen } from '@testing-library/react';
import { ParticleBackground } from '../ParticleBackground';

// Mock the hooks
jest.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}));

jest.mock('../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: jest.fn(() => [{ current: null }, true]),
}));

// Mock framer motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('ParticleBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders particle background container', () => {
    render(<ParticleBackground />);
    
    const container = document.querySelector('.absolute.inset-0.overflow-hidden.pointer-events-none');
    expect(container).toBeInTheDocument();
  });

  it('respects reduced motion preference', () => {
    const { useReducedMotion } = require('../hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(true);

    render(<ParticleBackground />);
    
    // Should render container but no particles when reduced motion is preferred
    const container = document.querySelector('.absolute.inset-0.overflow-hidden.pointer-events-none');
    expect(container).toBeInTheDocument();
    expect(container?.children.length).toBe(0);
  });

  it('does not render particles when not intersecting', () => {
    const { useIntersectionObserver } = require('../hooks/useIntersectionObserver');
    useIntersectionObserver.mockReturnValue([{ current: null }, false]);

    render(<ParticleBackground />);
    
    const container = document.querySelector('.absolute.inset-0.overflow-hidden.pointer-events-none');
    expect(container).toBeInTheDocument();
    expect(container?.children.length).toBe(0);
  });
});