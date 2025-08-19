import React from 'react';
import { Users, BookOpen, Rocket, TrendingUp, Globe, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveImage } from './components/ui/ResponsiveImage';
import { ResponsiveText } from './components/ui/ResponsiveText';
import { LazyLoad } from './components/ui/LazyLoad';
import { TouchButton } from './components/ui/TouchFriendly';
import { ParticleBackground } from './components/ParticleBackground';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AnimatedStats } from './components/AnimatedStats';
import { Navigation } from './components/Navigation';
import { ContactSection } from './components/ContactSection';
import { FinalCTASection } from './components/FinalCTASection';
import { PerformanceProvider } from './components/PerformanceProvider';
import { OptimizedImage } from './components/ui/OptimizedImage';
import { 
  LazyTestimonialsSection, 
  LazyContactSection, 
  LazyFinalCTASection, 
  LazyAnimatedStats,
  LazyComponentWrapper 
} from './components/utils/lazyComponents';
import { optimizedAnimations, createOptimizedMotion } from './components/utils/animationOptimizations';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import { AnalyticsButton } from './components/ui/AnalyticsButton';
import { ABTest, ABTestButton, ABTestHero } from './components/utils/abTesting';
import { useAnalytics } from './components/hooks/useAnalytics';
import { performanceAnalytics } from './components/utils/performanceAnalytics';

function AppContent() {
  const { trackCTAClick } = useAnalytics();

  // Initialize performance monitoring
  React.useEffect(() => {
    performanceAnalytics.initialize();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section with Warm Gradient Background and Particles */}
      <section 
        id="hero" 
        className="relative bg-gradient-to-br from-orange-500 via-pink-500 to-red-600 text-white min-h-screen flex items-center"
        aria-label="Hero section introducing FuturFounder"
        role="banner"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <ParticleBackground />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/30"
            role="banner"
            aria-label="Location badge"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm">From Ismayilpadi to the World</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-hero text-gradient-hero leading-tight will-change-transform">
              FuturFounder
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
            role="text"
            aria-label="Created by Unix²"
          >
            <p className="text-subheading text-orange-100">
              by <span className="font-bold text-white">Unix²</span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12 max-w-4xl mx-auto"
            role="text"
            aria-describedby="hero-description"
            id="hero-description"
          >
            <p className="text-body-lg text-orange-100/90 leading-relaxed">
              We're building the next generation of AI/ML founders. Join Haseeb, Liba, and the Unix² community 
              as we transform ambitious students into tomorrow's startup leaders.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
            role="group"
            aria-label="Call to action buttons"
          >
            {/* A/B Test the primary CTA button */}
            <ABTest
              testId="hero_primary_cta"
              variants={{
                'join_community': (
                  <AnalyticsButton
                    ctaName="join_community"
                    ctaLocation="hero_section"
                    variant="secondary"
                    size="lg"
                    onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                    className="shadow-2xl hover:shadow-white/25"
                    aria-label="Join the FuturFounder community"
                    conversionValue={5}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Join the Community
                      <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </AnalyticsButton>
                ),
                'get_started': (
                  <AnalyticsButton
                    ctaName="get_started"
                    ctaLocation="hero_section"
                    variant="secondary"
                    size="lg"
                    onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                    className="shadow-2xl hover:shadow-white/25"
                    aria-label="Get started with FuturFounder"
                    conversionValue={5}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get Started Today
                      <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </AnalyticsButton>
                )
              }}
            />
            
            <AnalyticsButton
              ctaName="learn_more"
              ctaLocation="hero_section"
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Learn more about the FuturFounder journey"
              trackAsConversion={false}
            >
              Learn More
            </AnalyticsButton>
          </motion.div>
        </div>

        {/* Floating gradient orbs - GPU accelerated */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <motion.div
            {...createOptimizedMotion(optimizedAnimations.float)}
            animate={{
              transform: [
                'scale(1) translateZ(0)',
                'scale(1.2) translateZ(0)',
                'scale(1) translateZ(0)'
              ],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/30 to-pink-400/30 rounded-full blur-3xl"
            style={{ 
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          />
          <motion.div
            {...createOptimizedMotion(optimizedAnimations.float)}
            animate={{
              transform: [
                'scale(1.2) translateZ(0)',
                'scale(1) translateZ(0)',
                'scale(1.2) translateZ(0)'
              ],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-3xl"
            style={{ 
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          />
        </div>
      </section>

      {/* Animated Stats Section */}
      <LazyComponentWrapper fallback={<div className="h-32 bg-gray-100 animate-pulse" />}>
        <LazyAnimatedStats />
      </LazyComponentWrapper>

      {/* Faces of FuturFounder */}
      <section id="founders" className="section bg-gradient-subtle">
        <div className="container container-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-title font-bold mb-6 text-gradient">
              Meet Our Founders
            </h2>
            <p className="text-body text-neutral-600 max-w-2xl mx-auto">
              From students to startup leaders, see how our community members are building the future
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <motion.div
                whileHover={{ y: -8, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="relative p-8 bg-card rounded-3xl shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative mb-6"
                  >
                    <OptimizedImage 
                      src="https://images.unsplash.com/photo-1689857538296-b6e1a392a91d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMG1hbiUyMGVudHJlcHJlbmV1ciUyMHRlY2h8ZW58MXx8fHwxNzU1NTQwNDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Haseeb - AI/ML Founder" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      sizes="(max-width: 768px) 128px, 128px"
                      loading="lazy"
                    />
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
                    >
                      <Rocket className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">Haseeb</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    From student to FuturFounder. Exploring AI/ML innovations and building real-world 
                    solutions with the Unix² community.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full"
                  >
                    <BookOpen className="w-4 h-4" />
                    AI/ML Specialist
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-red-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <motion.div
                whileHover={{ y: -8, rotateY: -5 }}
                transition={{ duration: 0.3 }}
                className="relative p-8 bg-card rounded-3xl shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                    className="relative mb-6"
                  >
                    <OptimizedImage 
                      src="https://images.unsplash.com/photo-1632647895256-3f75c1865a0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHdvbWFuJTIwZW50cmVwcmVuZXVyJTIwdGVjaHxlbnwxfHx8fDE3NTU1NDA0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Liba - Tech Entrepreneur" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      sizes="(max-width: 768px) 128px, 128px"
                      loading="lazy"
                    />
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
                    >
                      <TrendingUp className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">Liba</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Breaking barriers in tech and proving that anyone can become a founder with the 
                    right mindset and community support.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-sm text-pink-600 font-medium bg-pink-50 px-3 py-1 rounded-full"
                  >
                    <Users className="w-4 h-4" />
                    Community Leader
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The FuturFounder Journey */}
      <section id="journey" className="section bg-gradient-to-b from-gray-50 to-white">
        <div className="container container-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-title font-bold mb-6 text-gradient">
              The FuturFounder Journey
            </h2>
            <p className="text-body text-neutral-600 max-w-3xl mx-auto">
              Our proven 4-step process transforms ambitious students into successful startup founders
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                number: "01",
                title: "Learn",
                description: "Master AI/ML & fullstack development through hands-on projects and expert guidance.",
                gradient: "from-orange-500 to-orange-600",
                hoverGradient: "from-orange-500/10 to-orange-500/10",
                textColor: "text-orange-600",
                delay: 0
              },
              {
                icon: Rocket,
                number: "02",
                title: "Build",
                description: "Transform your projects into minimum viable products with real startup potential.",
                gradient: "from-orange-400 to-pink-500",
                hoverGradient: "from-coral-500/10 to-pink-500/10",
                textColor: "text-pink-600",
                delay: 0.1
              },
              {
                icon: Globe,
                number: "03",
                title: "Launch",
                description: "Showcase your work in demo days and participate in startup challenges.",
                gradient: "from-pink-500 to-red-500",
                hoverGradient: "from-pink-500/10 to-red-500/10",
                textColor: "text-red-600",
                delay: 0.2
              },
              {
                icon: TrendingUp,
                number: "04",
                title: "Scale",
                description: "Get mentorship and community support to grow into a successful founder.",
                gradient: "from-red-500 to-rose-600",
                hoverGradient: "from-red-500/10 to-rose-500/10",
                textColor: "text-rose-600",
                delay: 0.3
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-br ${step.hoverGradient} rounded-3xl transform transition-transform duration-300`}
                ></motion.div>
                <div className="relative p-8 bg-card rounded-3xl shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 h-full">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex items-center gap-2 mb-3">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`text-2xl font-bold ${step.textColor}`}
                    >
                      {step.number}
                    </motion.span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mt-4 text-sm font-medium text-orange-600"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div id="testimonials">
        <LazyComponentWrapper fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <LazyTestimonialsSection />
        </LazyComponentWrapper>
      </div>

      {/* Contact Section */}
      <LazyComponentWrapper fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <LazyContactSection />
      </LazyComponentWrapper>

      {/* Final Call to Action */}
      <div id="join">
        <LazyComponentWrapper fallback={<div className="h-48 bg-gray-100 animate-pulse" />}>
          <LazyFinalCTASection />
        </LazyComponentWrapper>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-hero text-white/90 section-sm">
        <div className="container container-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">Unix²</div>
                <div className="text-sm text-white/70">FuturFounder Initiative</div>
              </div>
            </motion.div>
            
            <div className="text-center md:text-right">
              <p className="text-sm">© 2025 Unix² | Building the Future, One Founder at a Time</p>
              <p className="text-xs text-white/60 mt-1">From Ismayilpadi to the World 🌍</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
}

export default function App() {
  return (
    <AnalyticsProvider
      config={{
        googleAnalyticsId: process.env.REACT_APP_GA_ID || 'G-XXXXXXXXXX',
        hotjarId: process.env.REACT_APP_HOTJAR_ID || '1234567',
        enableHeatmaps: true,
        enableConversionTracking: true,
        enablePerformanceMonitoring: true,
        enableABTesting: true,
        debug: process.env.NODE_ENV === 'development',
      }}
    >
      <PerformanceProvider>
        <AppContent />
      </PerformanceProvider>
    </AnalyticsProvider>
  );
}