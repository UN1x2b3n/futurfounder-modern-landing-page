/**
 * Animation optimization utilities for better performance
 */

import { Variants, Transition } from 'framer-motion';

/**
 * GPU-accelerated animation variants
 * Uses transform and opacity properties for optimal performance
 */
export const optimizedAnimations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  fadeInUp: {
    initial: { 
      opacity: 0, 
      transform: 'translateY(20px) translateZ(0)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px) translateZ(0)' 
    },
    exit: { 
      opacity: 0, 
      transform: 'translateY(-20px) translateZ(0)' 
    },
  } as Variants,

  fadeInDown: {
    initial: { 
      opacity: 0, 
      transform: 'translateY(-20px) translateZ(0)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px) translateZ(0)' 
    },
    exit: { 
      opacity: 0, 
      transform: 'translateY(20px) translateZ(0)' 
    },
  } as Variants,

  fadeInLeft: {
    initial: { 
      opacity: 0, 
      transform: 'translateX(-20px) translateZ(0)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'translateX(0px) translateZ(0)' 
    },
    exit: { 
      opacity: 0, 
      transform: 'translateX(20px) translateZ(0)' 
    },
  } as Variants,

  fadeInRight: {
    initial: { 
      opacity: 0, 
      transform: 'translateX(20px) translateZ(0)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'translateX(0px) translateZ(0)' 
    },
    exit: { 
      opacity: 0, 
      transform: 'translateX(-20px) translateZ(0)' 
    },
  } as Variants,

  // Scale animations
  scaleIn: {
    initial: { 
      opacity: 0, 
      transform: 'scale(0.9) translateZ(0)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'scale(1) translateZ(0)' 
    },
    exit: { 
      opacity: 0, 
      transform: 'scale(0.9) translateZ(0)' 
    },
  } as Variants,

  scaleInUp: {
    initial: { 
      opacity: 0, 
      transform: 'scale(0.9) translateY(20px) translateZ(0)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'scale(1) translateY(0px) translateZ(0)' 
    },
    exit: { 
      opacity: 0, 
      transform: 'scale(0.9) translateY(-20px) translateZ(0)' 
    },
  } as Variants,

  // Hover animations
  hoverLift: {
    rest: { 
      transform: 'translateY(0px) scale(1) translateZ(0)' 
    },
    hover: { 
      transform: 'translateY(-8px) scale(1.02) translateZ(0)' 
    },
  } as Variants,

  hoverScale: {
    rest: { 
      transform: 'scale(1) translateZ(0)' 
    },
    hover: { 
      transform: 'scale(1.05) translateZ(0)' 
    },
  } as Variants,

  hoverGlow: {
    rest: { 
      opacity: 1,
      filter: 'drop-shadow(0 0 0px rgba(249, 115, 22, 0))'
    },
    hover: { 
      opacity: 1,
      filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))'
    },
  } as Variants,

  // Stagger container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as Variants,

  staggerItem: {
    initial: { 
      opacity: 0, 
      transform: 'translateY(20px) translateZ(0)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px) translateZ(0)' 
    },
  } as Variants,

  // Floating animation
  float: {
    animate: {
      transform: [
        'translateY(0px) translateZ(0)',
        'translateY(-10px) translateZ(0)',
        'translateY(0px) translateZ(0)',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  // Pulse animation
  pulse: {
    animate: {
      transform: [
        'scale(1) translateZ(0)',
        'scale(1.05) translateZ(0)',
        'scale(1) translateZ(0)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,
};

/**
 * Optimized transition configurations
 */
export const optimizedTransitions = {
  // Fast transitions for micro-interactions
  fast: {
    type: 'tween',
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1], // Custom easing
  } as Transition,

  // Standard transitions
  default: {
    type: 'tween',
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  // Smooth transitions for larger movements
  smooth: {
    type: 'tween',
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  // Bouncy transitions for playful interactions
  bounce: {
    type: 'spring',
    damping: 15,
    stiffness: 300,
  } as Transition,

  // Gentle spring for natural feel
  spring: {
    type: 'spring',
    damping: 20,
    stiffness: 100,
  } as Transition,

  // Stagger timing
  stagger: {
    staggerChildren: 0.1,
    delayChildren: 0.1,
  } as Transition,
};

/**
 * Performance-optimized motion configuration
 */
export const motionConfig = {
  // Reduce motion for users who prefer it
  respectReducedMotion: true,
  
  // Use GPU acceleration
  style: {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  },
  
  // Optimize for 60fps
  transition: optimizedTransitions.default,
};

/**
 * Utility to create performance-optimized motion props
 */
export function createOptimizedMotion(
  variants: Variants,
  transition?: Transition,
  options?: {
    viewport?: { once?: boolean; margin?: string };
    whileInView?: boolean;
    respectReducedMotion?: boolean;
  }
) {
  const {
    viewport = { once: true, margin: '0px 0px -100px 0px' },
    whileInView = true,
    respectReducedMotion = true,
  } = options || {};

  return {
    variants,
    initial: 'initial',
    animate: whileInView ? undefined : 'animate',
    whileInView: whileInView ? 'animate' : undefined,
    viewport,
    transition: transition || optimizedTransitions.default,
    style: motionConfig.style,
    // Disable animations if user prefers reduced motion
    ...(respectReducedMotion && {
      'data-reduce-motion': 'true',
    }),
  };
}

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Utility to conditionally apply animations based on reduced motion preference
 */
export function withReducedMotion<T>(
  animatedProps: T,
  staticProps: Partial<T> = {}
): T {
  if (typeof window === 'undefined') return animatedProps;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return {
      ...animatedProps,
      ...staticProps,
      animate: undefined,
      whileInView: undefined,
      whileHover: undefined,
      whileTap: undefined,
      transition: { duration: 0 },
    };
  }
  
  return animatedProps;
}

/**
 * Performance monitoring for animations
 */
export const animationPerformance = {
  // Track animation frame rate
  trackFPS: (callback: (fps: number) => void) => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    function measureFPS() {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
  },

  // Measure animation performance
  measureAnimation: (name: string, animationFn: () => void) => {
    const start = performance.now();
    animationFn();
    const end = performance.now();
    
    console.log(`[Animation Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  },
};

/**
 * CSS-in-JS optimized styles for animations
 */
export const optimizedStyles = {
  // Base optimization styles
  gpuAccelerated: {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
    transform: 'translateZ(0)', // Force GPU layer
  },

  // Smooth scrolling
  smoothScroll: {
    scrollBehavior: 'smooth' as const,
    WebkitOverflowScrolling: 'touch' as const,
  },

  // Optimized text rendering
  optimizedText: {
    textRendering: 'optimizeLegibility' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
  },
};