import { useState, useEffect, useCallback } from 'react';

interface UseScrollNavigationProps {
  sectionIds: string[];
  scrollThreshold?: number;
  headerOffset?: number;
}

export function useScrollNavigation({
  sectionIds,
  scrollThreshold = 50,
  headerOffset = 80,
}: UseScrollNavigationProps) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');
  const [isScrolled, setIsScrolled] = useState(false);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    
    // Update scrolled state
    setIsScrolled(scrollY > scrollThreshold);
    
    // Find active section
    const currentSection = sectionIds.find(sectionId => {
      const element = document.getElementById(sectionId);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementBottom = elementTop + rect.height;
      
      // Check if section is in viewport with some tolerance
      return (
        scrollY >= elementTop - headerOffset - 100 &&
        scrollY < elementBottom - headerOffset
      );
    });
    
    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  }, [sectionIds, activeSection, scrollThreshold, headerOffset]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    
    const offsetTop = element.offsetTop - headerOffset;
    
    window.scrollTo({
      top: Math.max(0, offsetTop),
      behavior: 'smooth'
    });
  }, [headerOffset]);

  // Set up scroll listener with throttling
  useEffect(() => {
    let ticking = false;
    
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Initial call
    handleScroll();
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll]);

  return {
    activeSection,
    isScrolled,
    scrollToSection,
  };
}