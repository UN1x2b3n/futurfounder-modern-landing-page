import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveImage } from './ui/ResponsiveImage';

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "AI Startup Founder",
    company: "TechVision AI",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGVudHJlcHJlbmV1cnxlbnwxfHx8fDE3NTU1NDA0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "FuturFounder completely transformed my journey from student to startup founder. The community support and practical AI/ML training gave me the confidence to launch my own company.",
    rating: 5,
    achievement: "$2M Series A raised"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "ML Engineer & Founder",
    company: "DataFlow Solutions",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBlbnRyZXByZW5ldXJ8ZW58MXx8fHwxNzU1NTQwNDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "The hands-on projects and mentorship I received through Unix² were invaluable. Now I'm running a successful ML consulting firm with clients across three continents.",
    rating: 5,
    achievement: "50+ enterprise clients"
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Tech Entrepreneur",
    company: "InnovateLab",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjB3b21hbiUyMGVudHJlcHJlbmV1cnxlbnwxfHx8fDE3NTU1NDA0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "From learning the basics to building my first MVP, FuturFounder provided the perfect roadmap. The journey from student to founder has never been more accessible.",
    rating: 5,
    achievement: "Featured in TechCrunch"
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Software Engineer & Founder",
    company: "CloudScale",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBlbnRyZXByZW5ldXJ8ZW58MXx8fHwxNzU1NTQwNDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "The technical depth and real-world applications taught here are unmatched. I went from coding bootcamp graduate to running a profitable SaaS company in 18 months.",
    rating: 5,
    achievement: "$100K ARR achieved"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Product Manager & Founder",
    company: "HealthTech Innovations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGVudHJlcHJlbmV1cnxlbnwxfHx8fDE3NTU1NDA0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "The product strategy and user research methodologies I learned here directly contributed to our successful product launch. We now serve over 10,000 healthcare professionals.",
    rating: 5,
    achievement: "10K+ active users"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-play functionality with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;

    const startAutoPlay = () => {
      autoPlayTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [isAutoPlaying, isDragging, currentIndex]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    pauseAutoPlay();
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    pauseAutoPlay();
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsAutoPlaying(true);
    }
  };

  // Handle swipe gestures for mobile
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        prevTestimonial();
      } else {
        nextTestimonial();
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-200 to-red-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
          >
            Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Hear from our community members who've transformed their careers and built successful startups
          </motion.p>
        </div>

        <div 
          className="relative"
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 0.95 }}
              className="max-w-4xl mx-auto cursor-grab active:cursor-grabbing"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 rounded-3xl blur opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-orange-100">
                  <Quote className="w-12 h-12 text-orange-500 mb-6 opacity-50" />
                  
                  <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
                    <div className="relative">
                      <ResponsiveImage
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-orange-400 shadow-lg"
                        sizes="(max-width: 640px) 80px, 64px"
                        lazy={true}
                      />
                      {/* Rating badge overlay */}
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-1 shadow-lg">
                        <Star className="w-3 h-3 fill-white text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-orange-600 font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonials[currentIndex].company}
                      </p>
                      {/* Achievement badge */}
                      <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 border border-orange-200">
                        {testimonials[currentIndex].achievement}
                      </div>
                      {/* Rating stars */}
                      <div className="flex gap-1 mt-2 justify-center sm:justify-start">
                        {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 gap-4">
            {/* Desktop Arrow Controls */}
            <button
              onClick={prevTestimonial}
              className="hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            {/* Navigation Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 scale-125 shadow-md'
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Desktop Arrow Controls */}
            <button
              onClick={nextTestimonial}
              className="hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="sm:hidden text-center mt-4">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>Swipe to navigate</span>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-60"
              />
            </p>
          </div>

          {/* Auto-play indicator */}
          {isAutoPlaying && !isDragging && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
                />
                <span>Auto-playing</span>
              </div>
            </div>
          )}

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-12 border-t border-orange-100"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 font-medium">Trusted by founders from</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {/* Mock company logos - in real implementation, these would be actual client logos */}
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold">TechCorp</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="font-semibold">InnovateLab</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-semibold">DataFlow</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold">CloudScale</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-2"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                500+
              </div>
              <p className="text-sm text-gray-600">Successful Founders</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-2"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                $50M+
              </div>
              <p className="text-sm text-gray-600">Total Funding Raised</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-2"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                95%
              </div>
              <p className="text-sm text-gray-600">Success Rate</p>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}