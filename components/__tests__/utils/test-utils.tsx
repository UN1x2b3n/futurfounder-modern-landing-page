import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Mock framer-motion for all tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
    textarea: ({ children, ...props }: any) => <textarea {...props}>{children}</textarea>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    canvas: ({ children, ...props }: any) => <canvas {...props}>{children}</canvas>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => [React.createRef(), true],
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
}));

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Performance testing utilities
export const measurePerformance = async (fn: () => Promise<void> | void) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};

// Accessibility testing utilities
export const getAccessibilityViolations = async (container: HTMLElement) => {
  // Mock axe-core for accessibility testing
  return [];
};

// Visual regression testing utilities
export const takeScreenshot = async (element: HTMLElement) => {
  // Mock screenshot functionality
  return 'mock-screenshot-data';
};

// Responsive testing utilities
export const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

// Network simulation utilities
export const simulateSlowNetwork = () => {
  // Mock slow network conditions
  vi.spyOn(window, 'fetch').mockImplementation(
    () => new Promise(resolve => setTimeout(() => resolve(new Response()), 3000))
  );
};

export const simulateOfflineNetwork = () => {
  vi.spyOn(window, 'fetch').mockRejectedValue(new Error('Network error'));
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };