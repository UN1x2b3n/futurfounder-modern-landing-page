import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContactSection } from '../ContactSection';

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

// Mock child components
jest.mock('../ContactForm', () => ({
  ContactForm: ({ onSubmit }: any) => (
    <div data-testid="contact-form">
      Contact Form Component
      {onSubmit && <button onClick={() => onSubmit({ name: 'Test', email: 'test@example.com', message: 'Test message' })}>
        Submit Test
      </button>}
    </div>
  ),
}));

jest.mock('../ContactMethods', () => ({
  ContactMethods: () => <div data-testid="contact-methods">Contact Methods Component</div>,
}));

describe('ContactSection', () => {
  it('renders the contact section with proper structure', () => {
    render(<ContactSection />);
    
    expect(screen.getByRole('heading', { name: /let's build something amazing together/i })).toBeInTheDocument();
    expect(screen.getByText(/ready to start your entrepreneurial journey/i)).toBeInTheDocument();
  });

  it('renders contact form and contact methods', () => {
    render(<ContactSection />);
    
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('contact-methods')).toBeInTheDocument();
  });

  it('renders section headers correctly', () => {
    render(<ContactSection />);
    
    expect(screen.getByRole('heading', { name: /send us a message/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /other ways to reach us/i })).toBeInTheDocument();
  });

  it('renders quick contact CTA section', () => {
    render(<ContactSection />);
    
    expect(screen.getByRole('heading', { name: /need immediate help/i })).toBeInTheDocument();
    expect(screen.getByText(/join our whatsapp community/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /join whatsapp community/i })).toBeInTheDocument();
  });

  it('passes onFormSubmit prop to ContactForm', () => {
    const mockOnSubmit = jest.fn();
    render(<ContactSection onFormSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByText('Submit Test');
    submitButton.click();
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test',
      email: 'test@example.com',
      message: 'Test message'
    });
  });

  it('has proper section id for navigation', () => {
    render(<ContactSection />);
    
    const section = screen.getByRole('region', { name: /contact/i }) || 
                   document.querySelector('#contact');
    expect(section).toBeInTheDocument();
  });

  it('renders WhatsApp link with correct attributes', () => {
    render(<ContactSection />);
    
    const whatsappLink = screen.getByRole('link', { name: /join whatsapp community/i });
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/919876543210');
    expect(whatsappLink).toHaveAttribute('target', '_blank');
    expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders with proper accessibility structure', () => {
    render(<ContactSection />);
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 2, name: /let's build something amazing together/i });
    const subHeadings = screen.getAllByRole('heading', { level: 3 });
    
    expect(mainHeading).toBeInTheDocument();
    expect(subHeadings.length).toBeGreaterThan(0);
  });
});