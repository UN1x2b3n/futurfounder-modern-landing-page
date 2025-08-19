import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleBackground() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [containerRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    // Lazy load particles after a short delay to improve initial page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Don't render particles if user prefers reduced motion or not visible
  if (prefersReducedMotion || !isVisible || !isIntersecting) {
    return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  const particles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 2,
  }));

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/12"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 8, -8, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [0.8, 1.05, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}