import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinalCTASection } from '../FinalCTASection';

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

// Mock scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

describe('FinalCTASection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main CTA heading', () => {
    render(<FinalCTASection />);
    
    expect(screen.getByRole('heading', { name: /ready to be the next futurfounder/i })).toBeInTheDocument();
  });

  it('renders the compelling description text', () => {
    render(<FinalCTASection />);
    
    expect(screen.getByText(/join our community of builders, dreamers, and future founders/i)).toBeInTheDocument();
    expect(screen.getByText(/transform your ideas into reality/i)).toBeInTheDocument();
  });

  it('renders all benefit cards', () => {
    render(<FinalCTASection />);
    
    expect(screen.getByText(/fast-track learning/i)).toBeInTheDocument();
    expect(screen.getByText(/vibrant community/i)).toBeInTheDocument();
    expect(screen.getByText(/real projects/i)).toBeInTheDocument();
    
    expect(screen.getByText(/master ai\/ml and fullstack development/i)).toBeInTheDocument();
    expect(screen.getByText(/connect with like-minded builders/i)).toBeInTheDocument();
    expect(screen.getByText(/build actual products that solve real-world problems/i)).toBeInTheDocument();
  });

  it('renders primary WhatsApp CTA button', () => {
    render(<FinalCTASection />);
    
    const whatsappButton = screen.getByRole('link', { name: /join now on whatsapp/i });
    expect(whatsappButton).toBeInTheDocument();
    expect(whatsappButton).toHaveAttribute('href', 'https://wa.me/919876543210');
    expect(whatsappButton).toHaveAttribute('target', '_blank');
    expect(whatsappButton).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders secondary contact CTA button', () => {
    render(<FinalCTASection />);
    
    const contactButton = screen.getByRole('link', { name: /get in touch/i });
    expect(contactButton).toBeInTheDocument();
    expect(contactButton).toHaveAttribute('href', '#contact');
  });

  it('handles contact button click with smooth scroll', () => {
    const mockScrollIntoView = jest.fn();
    const mockGetElementById = jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as any);

    render(<FinalCTASection />);
    
    const contactButton = screen.getByRole('link', { name: /get in touch/i });
    fireEvent.click(contactButton);
    
    expect(mockGetElementById).toHaveBeenCalledWith('contact');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    
    mockGetElementById.mockRestore();
  });

  it('renders all statistics', () => {
    render(<FinalCTASection />);
    
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Active Members')).toBeInTheDocument();
    
    expect(screen.getByText('127+')).toBeInTheDocument();
    expect(screen.getByText('Projects Built')).toBeInTheDocument();
    
    expect(screen.getByText('23+')).toBeInTheDocument();
    expect(screen.getByText('Startups Launched')).toBeInTheDocument();
    
    expect(screen.getByText('89%')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('renders final encouragement text', () => {
    render(<FinalCTASection />);
    
    expect(screen.getByText(/don't wait for the perfect moment/i)).toBeInTheDocument();
    expect(screen.getByText(/your entrepreneurial journey starts with a single message/i)).toBeInTheDocument();
  });

  it('renders journey starts badge', () => {
    render(<FinalCTASection />);
    
    expect(screen.getByText(/your journey starts here/i)).toBeInTheDocument();
  });

  it('has proper section structure for accessibility', () => {
    render(<FinalCTASection />);
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { name: /ready to be the next futurfounder/i });
    expect(mainHeading).toBeInTheDocument();
    
    // Check for benefit card headings
    const benefitHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(benefitHeadings.length).toBeGreaterThanOrEqual(3);
  });

  it('renders with proper link accessibility', () => {
    render(<FinalCTASection />);
    
    const whatsappButton = screen.getByRole('link', { name: /join now on whatsapp/i });
    const contactButton = screen.getByRole('link', { name: /get in touch/i });
    
    expect(whatsappButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
    
    // Both buttons should be keyboard accessible
    expect(whatsappButton).not.toHaveAttribute('tabindex', '-1');
    expect(contactButton).not.toHaveAttribute('tabindex', '-1');
  });
});