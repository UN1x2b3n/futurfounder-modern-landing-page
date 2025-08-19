import React from 'react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { ResponsiveText } from '../ui/ResponsiveText';
import { LazyLoad } from '../ui/LazyLoad';
import { TouchButton } from '../ui/TouchFriendly';
import { useResponsive } from '../hooks/useResponsive';

export function ResponsiveDemo() {
  const { isMobile, isTablet, isDesktop, breakpoint, width } = useResponsive();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Responsive Info Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <ResponsiveText variant="heading" className="mb-4 text-indigo-600">
          Current Responsive State
        </ResponsiveText>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded p-3 shadow-sm">
            <div className="font-medium text-gray-600">Width</div>
            <div className="text-lg font-bold text-indigo-600">{width}px</div>
          </div>
          <div className="bg-white rounded p-3 shadow-sm">
            <div className="font-medium text-gray-600">Breakpoint</div>
            <div className="text-lg font-bold text-indigo-600">{breakpoint}</div>
          </div>
          <div className="bg-white rounded p-3 shadow-sm">
            <div className="font-medium text-gray-600">Device</div>
            <div className="text-lg font-bold text-indigo-600">
              {isMobile ? 'Mobile' : isTablet ? 'Tablet' : isDesktop ? 'Desktop' : 'Large Desktop'}
            </div>
          </div>
          <div className="bg-white rounded p-3 shadow-sm">
            <div className="font-medium text-gray-600">Touch</div>
            <div className="text-lg font-bold text-indigo-600">
              {isMobile ? 'Optimized' : 'Standard'}
            </div>
          </div>
        </div>
      </div>

      {/* Typography Demo */}
      <div className="space-y-6">
        <ResponsiveText variant="title" className="text-gray-800">
          Responsive Typography Demo
        </ResponsiveText>
        
        <div className="space-y-4">
          <div>
            <ResponsiveText variant="hero" className="text-gradient bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Hero Text
            </ResponsiveText>
            <p className="text-sm text-gray-500 mt-1">clamp(3rem, 8vw, 8rem)</p>
          </div>
          
          <div>
            <ResponsiveText variant="title" className="text-gray-800">
              Title Text
            </ResponsiveText>
            <p className="text-sm text-gray-500 mt-1">clamp(2.5rem, 6vw, 5rem)</p>
          </div>
          
          <div>
            <ResponsiveText variant="heading" className="text-gray-700">
              Heading Text
            </ResponsiveText>
            <p className="text-sm text-gray-500 mt-1">clamp(1.5rem, 4vw, 3rem)</p>
          </div>
          
          <div>
            <ResponsiveText variant="body" className="text-gray-600">
              Body text that scales fluidly with the viewport size, ensuring optimal readability across all devices.
            </ResponsiveText>
            <p className="text-sm text-gray-500 mt-1">clamp(1rem, 2.5vw, 1.25rem)</p>
          </div>
        </div>
      </div>

      {/* Responsive Images Demo */}
      <div className="space-y-6">
        <ResponsiveText variant="title" className="text-gray-800">
          Responsive Images Demo
        </ResponsiveText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <ResponsiveText variant="subheading" className="text-gray-700">
              Lazy Loaded Image
            </ResponsiveText>
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800"
              alt="Office workspace"
              className="w-full h-48 object-cover rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="space-y-2">
            <ResponsiveText variant="subheading" className="text-gray-700">
              Priority Image
            </ResponsiveText>
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
              alt="Business analytics"
              className="w-full h-48 object-cover rounded-lg shadow-md"
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="space-y-2">
            <ResponsiveText variant="subheading" className="text-gray-700">
              With Fallback
            </ResponsiveText>
            <ResponsiveImage
              src="https://invalid-url.com/image.jpg"
              alt="Fallback demo"
              className="w-full h-48 object-cover rounded-lg shadow-md"
              fallbackSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>

      {/* Touch-Friendly Buttons Demo */}
      <div className="space-y-6">
        <ResponsiveText variant="title" className="text-gray-800">
          Touch-Friendly Interactions Demo
        </ResponsiveText>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TouchButton variant="primary" size="lg">
            Primary Button
          </TouchButton>
          
          <TouchButton variant="secondary" size="lg">
            Secondary Button
          </TouchButton>
          
          <TouchButton variant="outline" size="lg">
            Outline Button
          </TouchButton>
          
          <TouchButton variant="ghost" size="lg">
            Ghost Button
          </TouchButton>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <ResponsiveText variant="caption" className="text-yellow-800">
            💡 On mobile devices, these buttons automatically get enhanced touch targets (minimum 44px) 
            and improved padding for better usability.
          </ResponsiveText>
        </div>
      </div>

      {/* Lazy Loading Demo */}
      <div className="space-y-6">
        <ResponsiveText variant="title" className="text-gray-800">
          Lazy Loading Demo
        </ResponsiveText>
        
        <div className="space-y-4">
          <LazyLoad 
            fallback={
              <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <ResponsiveText variant="body" className="text-gray-500">
                  Loading content...
                </ResponsiveText>
              </div>
            }
          >
            <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <ResponsiveText variant="heading" className="text-white">
                🎉 Lazy Loaded Content!
              </ResponsiveText>
            </div>
          </LazyLoad>
          
          <LazyLoad 
            priority={true}
            fallback={
              <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
            }
          >
            <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <ResponsiveText variant="heading" className="text-white">
                ⚡ Priority Content (Loads Immediately)
              </ResponsiveText>
            </div>
          </LazyLoad>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <ResponsiveText variant="heading" className="text-green-800 mb-4">
          Performance Features Demonstrated
        </ResponsiveText>
        <ul className="space-y-2 text-green-700">
          <li>✅ Responsive images with automatic srcSet generation</li>
          <li>✅ Lazy loading for below-the-fold content</li>
          <li>✅ Fluid typography that prevents layout shifts</li>
          <li>✅ Touch-optimized interactions for mobile devices</li>
          <li>✅ Intersection Observer for efficient loading</li>
          <li>✅ Graceful fallbacks for failed image loads</li>
          <li>✅ Reduced motion support for accessibility</li>
        </ul>
      </div>
    </div>
  );
}