/**
 * Analytics System Demo Component
 * Demonstrates all analytics features including tracking, A/B testing, and performance monitoring
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Target, 
  Zap, 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { AnalyticsButton } from './ui/AnalyticsButton';
import { AnalyticsForm, AnalyticsInput, AnalyticsTextarea } from './ui/AnalyticsForm';
import { ABTest, ABTestButton, ABTestContent } from './utils/abTesting';
import { useAnalytics, useVisibilityTracking, useInteractionTracking } from './hooks/useAnalytics';
import { performanceAnalytics } from './utils/performanceAnalytics';

export function AnalyticsDemo() {
  const [demoStats, setDemoStats] = useState({
    pageViews: 0,
    buttonClicks: 0,
    formSubmissions: 0,
    scrollDepth: 0,
    performanceScore: 0
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(true);

  const { trackEvent, trackConversion, trackCTAClick } = useAnalytics();
  const { trackClick, trackHover } = useInteractionTracking();

  // Demo sections refs for visibility tracking
  const heroRef = React.useRef<HTMLDivElement>(null);
  const featuresRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  // Use visibility tracking for demo sections
  useVisibilityTracking(heroRef, 'demo_hero_section', 'demo_visibility');
  useVisibilityTracking(featuresRef, 'demo_features_section', 'demo_visibility');
  useVisibilityTracking(formRef, 'demo_form_section', 'demo_visibility');

  // Initialize performance monitoring
  useEffect(() => {
    performanceAnalytics.initialize();
    
    // Simulate some stats updates
    const interval = setInterval(() => {
      setDemoStats(prev => ({
        pageViews: prev.pageViews + Math.floor(Math.random() * 3),
        buttonClicks: prev.buttonClicks + Math.floor(Math.random() * 2),
        formSubmissions: prev.formSubmissions + Math.floor(Math.random() * 1),
        scrollDepth: Math.min(100, prev.scrollDepth + Math.floor(Math.random() * 5)),
        performanceScore: Math.min(100, prev.performanceScore + Math.floor(Math.random() * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Demo event handlers
  const handleDemoClick = (eventName: string) => {
    trackEvent({
      action: 'demo_interaction',
      category: 'demo',
      label: eventName,
      customParameters: {
        demo_section: 'analytics_showcase',
        interaction_type: 'click'
      }
    });
    addLog(`🎯 Tracked event: ${eventName}`);
  };

  const handleDemoConversion = (conversionName: string, value: number) => {
    trackConversion({
      eventName: conversionName,
      conversionValue: value,
      customParameters: {
        demo_conversion: true,
        conversion_source: 'analytics_demo'
      }
    });
    addLog(`💰 Tracked conversion: ${conversionName} ($${value})`);
  };

  const handlePerformanceTest = () => {
    performanceAnalytics.startTiming('demo_performance_test');
    
    // Simulate some work
    setTimeout(() => {
      const duration = performanceAnalytics.endTiming('demo_performance_test');
      addLog(`⚡ Performance test completed: ${duration?.toFixed(2)}ms`);
    }, Math.random() * 1000 + 500);
  };

  const handleFormSubmit = async (data: FormData) => {
    addLog(`📝 Form submitted with ${Array.from(data.entries()).length} fields`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Demo</h1>
                <p className="text-sm text-gray-600">Live demonstration of tracking capabilities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">{isTracking ? 'Tracking Active' : 'Tracking Paused'}</span>
              </div>
              <button
                onClick={() => setIsTracking(!isTracking)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                {isTracking ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Demo Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Demo Section */}
            <motion.section
              ref={heroRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Analytics & Conversion Tracking Demo
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Experience real-time analytics tracking, A/B testing, and performance monitoring in action.
                </p>
              </div>

              {/* A/B Test Demo */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  A/B Testing Demo
                </h3>
                
                <ABTest
                  testId="demo_hero_cta"
                  variants={{
                    'control': (
                      <AnalyticsButton
                        ctaName="get_started_control"
                        ctaLocation="demo_hero"
                        variant="primary"
                        size="lg"
                        conversionValue={10}
                        onClick={() => {
                          handleDemoConversion('demo_signup', 10);
                          addLog('🧪 A/B Test: Control variant clicked');
                        }}
                      >
                        Get Started Now
                      </AnalyticsButton>
                    ),
                    'variant': (
                      <AnalyticsButton
                        ctaName="start_free_trial"
                        ctaLocation="demo_hero"
                        variant="secondary"
                        size="lg"
                        conversionValue={10}
                        onClick={() => {
                          handleDemoConversion('demo_signup', 10);
                          addLog('🧪 A/B Test: Variant clicked');
                        }}
                      >
                        Start Free Trial
                      </AnalyticsButton>
                    )
                  }}
                />
                
                <p className="text-sm text-gray-500 mt-2 text-center">
                  ↑ This button is A/B tested - refresh to see different variants
                </p>
              </div>

              {/* Interactive Demo Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <AnalyticsButton
                  ctaName="demo_feature_1"
                  ctaLocation="demo_section"
                  variant="outline"
                  onClick={() => handleDemoClick('Feature 1 Demo')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Track Page View
                </AnalyticsButton>
                
                <AnalyticsButton
                  ctaName="demo_feature_2"
                  ctaLocation="demo_section"
                  variant="outline"
                  onClick={() => handleDemoClick('Feature 2 Demo')}
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Track Interaction
                </AnalyticsButton>
              </div>
            </motion.section>

            {/* Features Demo */}
            <motion.section
              ref={featuresRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Analytics Features
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Event Tracking</h4>
                    <p className="text-blue-700 text-sm mb-3">Track user interactions and custom events</p>
                    <button
                      onClick={() => {
                        trackEvent({
                          action: 'custom_event',
                          category: 'demo',
                          label: 'manual_trigger',
                          value: 1
                        });
                        addLog('📊 Custom event tracked');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Trigger Event →
                    </button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Conversion Tracking</h4>
                    <p className="text-green-700 text-sm mb-3">Monitor conversion rates and values</p>
                    <button
                      onClick={() => handleDemoConversion('demo_purchase', 25)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Track Conversion →
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Performance Monitoring</h4>
                    <p className="text-purple-700 text-sm mb-3">Track Core Web Vitals and custom metrics</p>
                    <button
                      onClick={handlePerformanceTest}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Run Performance Test →
                    </button>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Heatmap Tracking</h4>
                    <p className="text-orange-700 text-sm mb-3">User behavior and interaction patterns</p>
                    <button
                      onClick={() => {
                        trackClick('heatmap_demo_button');
                        addLog('🔥 Heatmap interaction tracked');
                      }}
                      className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                    >
                      Track Heatmap →
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Form Demo */}
            <motion.section
              ref={formRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-500" />
                Form Analytics Demo
              </h3>
              
              <AnalyticsForm
                formName="demo_contact_form"
                trackFieldInteractions={true}
                conversionValue={15}
                onSubmitSuccess={handleFormSubmit}
                className="max-w-md"
              >
                <AnalyticsInput
                  fieldName="name"
                  label="Full Name"
                  placeholder="Enter your name"
                  required
                />
                
                <AnalyticsInput
                  fieldName="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
                
                <AnalyticsTextarea
                  fieldName="message"
                  label="Message"
                  placeholder="Tell us about your experience..."
                  rows={4}
                  required
                />
                
                <AnalyticsButton
                  ctaName="submit_demo_form"
                  ctaLocation="form_demo"
                  variant="primary"
                  type="submit"
                  className="w-full"
                >
                  Submit Demo Form
                </AnalyticsButton>
              </AnalyticsForm>
              
              <p className="text-sm text-gray-500 mt-4">
                ↑ This form tracks field interactions, validation errors, and submissions
              </p>
            </motion.section>
          </div>

          {/* Sidebar - Live Stats & Logs */}
          <div className="space-y-6">
            {/* Live Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Live Analytics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <span className="font-semibold text-blue-600">{demoStats.pageViews}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Button Clicks</span>
                  <span className="font-semibold text-green-600">{demoStats.buttonClicks}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Form Submissions</span>
                  <span className="font-semibold text-purple-600">{demoStats.formSubmissions}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Scroll Depth</span>
                  <span className="font-semibold text-orange-600">{demoStats.scrollDepth}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance Score</span>
                  <span className="font-semibold text-red-600">{demoStats.performanceScore}/100</span>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Activity Log
                </h3>
                <button
                  onClick={() => setLogs([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Interact with the demo to see live tracking...
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs bg-gray-50 rounded p-2 font-mono"
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    trackEvent({
                      action: 'scroll_depth',
                      category: 'engagement',
                      label: '75%',
                      value: 75
                    });
                    addLog('📜 Scroll depth tracked: 75%');
                  }}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors"
                >
                  <div className="font-medium text-blue-900">Simulate Scroll Tracking</div>
                  <div className="text-blue-600 text-xs">Track user scroll behavior</div>
                </button>
                
                <button
                  onClick={() => {
                    const testVariant = Math.random() > 0.5 ? 'A' : 'B';
                    addLog(`🧪 A/B Test assigned: Variant ${testVariant}`);
                  }}
                  className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm transition-colors"
                >
                  <div className="font-medium text-purple-900">Simulate A/B Test</div>
                  <div className="text-purple-600 text-xs">Random variant assignment</div>
                </button>
                
                <button
                  onClick={() => {
                    addLog('🔥 Heatmap data collected');
                    addLog('👆 User interaction recorded');
                  }}
                  className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm transition-colors"
                >
                  <div className="font-medium text-orange-900">Simulate Heatmap</div>
                  <div className="text-orange-600 text-xs">User interaction patterns</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}