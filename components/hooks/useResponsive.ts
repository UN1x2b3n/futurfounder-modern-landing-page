import { useEffect, useState } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const breakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointKey = keyof BreakpointConfig;

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  breakpoint: BreakpointKey | 'xs';
}

/**
 * Hook to get current responsive state and breakpoint information
 * @returns ResponsiveState object with current screen information
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        isLargeDesktop: false,
        breakpoint: 'lg' as BreakpointKey,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
      isLargeDesktop: width >= breakpoints.xl,
      breakpoint: getBreakpoint(width),
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        width,
        height,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
        isLargeDesktop: width >= breakpoints.xl,
        breakpoint: getBreakpoint(width),
      });
    };

    // Use passive listener for better performance
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return state;
}

function getBreakpoint(width: number): BreakpointKey | 'xs' {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Hook to check if current screen matches a specific breakpoint
 * @param breakpoint - Breakpoint to check against
 * @returns boolean indicating if current screen matches
 */
export function useBreakpoint(breakpoint: BreakpointKey | 'xs'): boolean {
  const { breakpoint: currentBreakpoint } = useResponsive();
  return currentBreakpoint === breakpoint;
}

/**
 * Hook to check if current screen is at least a specific breakpoint
 * @param breakpoint - Minimum breakpoint to check
 * @returns boolean indicating if current screen is at least the specified breakpoint
 */
export function useMinBreakpoint(breakpoint: BreakpointKey): boolean {
  const { width } = useResponsive();
  return width >= breakpoints[breakpoint];
}