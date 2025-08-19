# Analytics and Conversion Tracking Guide

This guide covers the comprehensive analytics and conversion tracking system implemented for the modern landing page.

## Overview

The analytics system provides:
- **Google Analytics 4** integration for user behavior tracking
- **Hotjar** integration for heatmap and user session tracking
- **Conversion tracking** for CTA clicks and form submissions
- **Performance monitoring** with Core Web Vitals tracking
- **A/B testing framework** for optimization experiments
- **Privacy-compliant** tracking with user consent management

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env.local` and configure your analytics IDs:

```bash
cp .env.example .env.local
```

Update the values in `.env.local`:
```env
REACT_APP_GA_ID=G-YOUR-GA4-ID
REACT_APP_HOTJAR_ID=YOUR-HOTJAR-ID
REACT_APP_ENABLE_ANALYTICS=true
```

### 2. Basic Integration

Wrap your app with the `AnalyticsProvider`:

```tsx
import { AnalyticsProvider } from './components/AnalyticsProvider';

function App() {
  return (
    <AnalyticsProvider>
      <YourAppContent />
    </AnalyticsProvider>
  );
}
```

### 3. Track Events

Use the `useAnalytics` hook in your components:

```tsx
import { useAnalytics } from './components/hooks/useAnalytics';

function MyComponent() {
  const { trackEvent, trackCTAClick } = useAnalytics();

  const handleButtonClick = () => {
    trackCTAClick('signup_button', 'hero_section');
  };

  return <button onClick={handleButtonClick}>Sign Up</button>;
}
```

## Core Features

### 1. Event Tracking

Track custom events throughout your application:

```tsx
trackEvent({
  action: 'video_play',
  category: 'engagement',
  label: 'hero_video',
  value: 1,
  customParameters: {
    video_duration: 120,
    video_quality: 'HD'
  }
});
```

### 2. Conversion Tracking

Track important conversions:

```tsx
trackConversion({
  eventName: 'newsletter_signup',
  conversionValue: 5,
  currency: 'USD',
  customParameters: {
    source: 'hero_section',
    campaign: 'summer_2024'
  }
});
```

### 3. CTA Button Tracking

Use the `AnalyticsButton` component for automatic tracking:

```tsx
<AnalyticsButton
  ctaName="get_started"
  ctaLocation="hero_section"
  variant="primary"
  conversionValue={10}
  onClick={handleGetStarted}
>
  Get Started
</AnalyticsButton>
```

### 4. Form Analytics

Use the enhanced form components for comprehensive form tracking:

```tsx
<AnalyticsForm
  formName="contact_form"
  trackFieldInteractions={true}
  conversionValue={15}
  onSubmitSuccess={handleSuccess}
>
  <AnalyticsInput
    fieldName="email"
    label="Email Address"
    type="email"
    required
  />
  <AnalyticsTextarea
    fieldName="message"
    label="Message"
    required
  />
</AnalyticsForm>
```

### 5. A/B Testing

Implement A/B tests easily:

```tsx
<ABTest
  testId="hero_cta_test"
  variants={{
    'control': <button>Sign Up</button>,
    'variant': <button>Get Started Free</button>
  }}
/>

// Or use the specialized components
<ABTestButton
  testId="pricing_cta"
  variants={{
    'control': { text: 'Buy Now', variant: 'primary' },
    'test': { text: 'Start Free Trial', variant: 'secondary' }
  }}
  onClick={handlePurchase}
/>
```

### 6. Performance Monitoring

Track performance metrics automatically:

```tsx
import { performanceAnalytics } from './components/utils/performanceAnalytics';

// Initialize performance monitoring
performanceAnalytics.initialize();

// Track custom metrics
performanceAnalytics.startTiming('api_call');
await fetchData();
performanceAnalytics.endTiming('api_call');

// Measure function performance
const result = performanceAnalytics.measureFunction('heavy_calculation', () => {
  return performComplexCalculation();
});
```

## Advanced Usage

### Custom Analytics Configuration

Configure analytics with custom settings:

```tsx
<AnalyticsProvider
  config={{
    googleAnalyticsId: 'G-CUSTOM-ID',
    hotjarId: '123456',
    enableHeatmaps: true,
    enableConversionTracking: true,
    enablePerformanceMonitoring: true,
    enableABTesting: true,
    debug: process.env.NODE_ENV === 'development'
  }}
>
  <App />
</AnalyticsProvider>
```

### Component-Level Tracking

Use the `withAnalytics` HOC for automatic component tracking:

```tsx
import { withAnalytics } from './components/AnalyticsProvider';

const MyComponent = ({ variant, trackConversion }) => {
  useEffect(() => {
    trackConversion('component_view');
  }, []);

  return <div>My Component</div>;
};

export default withAnalytics(MyComponent, {
  componentName: 'my_component',
  trackVisibility: true,
  trackInteractions: true
});
```

### Visibility Tracking

Track when elements become visible:

```tsx
import { useVisibilityTracking } from './components/hooks/useAnalytics';

function MyComponent() {
  const elementRef = useRef(null);
  
  useVisibilityTracking(elementRef, 'pricing_section', 'visibility');
  
  return <div ref={elementRef}>Pricing content</div>;
}
```

### Interaction Tracking

Track user interactions:

```tsx
import { useInteractionTracking } from './components/hooks/useAnalytics';

function MyComponent() {
  const { trackClick, trackHover } = useInteractionTracking();
  
  return (
    <div
      onClick={() => trackClick('feature_card')}
      onMouseEnter={() => trackHover('feature_card')}
    >
      Feature content
    </div>
  );
}
```

## Analytics Events Reference

### Standard Events

| Event | Category | Description |
|-------|----------|-------------|
| `page_view` | `navigation` | Page view tracking |
| `cta_click` | `engagement` | CTA button clicks |
| `form_submission` | `engagement` | Form submissions |
| `scroll_depth` | `engagement` | Scroll depth milestones |
| `element_visible` | `visibility` | Element visibility |

### Conversion Events

| Event | Description | Default Value |
|-------|-------------|---------------|
| `cta_conversion` | CTA button conversions | 1 |
| `form_submission` | Form submission conversions | 5 |
| `newsletter_signup` | Newsletter signups | 3 |
| `contact_form_submission` | Contact form submissions | 10 |

### Performance Events

| Event | Category | Description |
|-------|----------|-------------|
| `core_web_vital` | `performance` | LCP, FID, CLS metrics |
| `custom_performance_metric` | `performance` | Custom timing metrics |
| `image_load_time` | `performance` | Image loading performance |
| `script_load_time` | `performance` | Script loading performance |

## A/B Testing Guide

### Setting Up Tests

1. **Define Test Variants**: Create different versions of your component
2. **Set Test ID**: Use a unique identifier for each test
3. **Track Conversions**: Define what constitutes a conversion for your test

```tsx
<ABTestHero
  testId="hero_messaging_test"
  variants={{
    'control': {
      title: 'Welcome to Our Platform',
      description: 'The best solution for your needs',
      ctaText: 'Get Started'
    },
    'variant_a': {
      title: 'Transform Your Business Today',
      description: 'Join thousands of successful companies',
      ctaText: 'Start Free Trial'
    }
  }}
  onCTAClick={(variant) => {
    // Track conversion for the specific variant
    console.log(`CTA clicked for variant: ${variant}`);
  }}
/>
```

### Test Analysis

Access test data through your analytics dashboard:
- **Google Analytics**: Custom events with experiment dimensions
- **Hotjar**: Heatmaps and recordings segmented by variant
- **Custom Dashboard**: Build reports using the tracked data

## Performance Monitoring

### Core Web Vitals

The system automatically tracks:
- **LCP (Largest Contentful Paint)**: Loading performance
- **FID (First Input Delay)**: Interactivity
- **CLS (Cumulative Layout Shift)**: Visual stability

### Custom Metrics

Track application-specific performance:

```tsx
// API call timing
performanceAnalytics.startTiming('user_data_fetch');
const userData = await fetchUserData();
performanceAnalytics.endTiming('user_data_fetch');

// Component render timing
const MyComponent = () => {
  useEffect(() => {
    performanceAnalytics.startTiming('component_mount');
    return () => {
      performanceAnalytics.endTiming('component_mount');
    };
  }, []);
  
  return <div>Component content</div>;
};
```

## Privacy and Compliance

### GDPR Compliance

The system includes privacy-friendly features:
- **Consent Management**: Disable tracking based on user consent
- **Data Minimization**: Only collect necessary data
- **User Control**: Allow users to opt-out of tracking

```tsx
// Disable tracking based on user consent
<AnalyticsProvider
  config={{
    enableHeatmaps: userConsent.analytics,
    enableConversionTracking: userConsent.marketing,
    enablePerformanceMonitoring: true, // Always allowed for technical purposes
  }}
>
  <App />
</AnalyticsProvider>
```

### Data Retention

Configure data retention policies:
- **Google Analytics**: Set retention periods in GA4 settings
- **Hotjar**: Configure data retention in Hotjar dashboard
- **Local Storage**: A/B test assignments expire after 30 days

## Troubleshooting

### Common Issues

1. **Analytics Not Loading**
   - Check environment variables are set correctly
   - Verify network connectivity
   - Check browser console for errors

2. **Events Not Tracking**
   - Ensure analytics is initialized before tracking events
   - Check event parameters are valid
   - Verify GA4 configuration

3. **A/B Tests Not Working**
   - Check localStorage is available
   - Verify test IDs are unique
   - Ensure variants array is not empty

### Debug Mode

Enable debug mode for detailed logging:

```tsx
<AnalyticsProvider
  config={{
    debug: true
  }}
>
  <App />
</AnalyticsProvider>
```

### Testing

Run the analytics test suite:

```bash
npm test components/__tests__/AnalyticsSystem.test.tsx
```

## Best Practices

### 1. Event Naming

Use consistent naming conventions:
- **Actions**: `verb_noun` (e.g., `click_button`, `view_page`)
- **Categories**: Broad groupings (e.g., `engagement`, `navigation`)
- **Labels**: Specific identifiers (e.g., `hero_cta`, `footer_link`)

### 2. Conversion Tracking

- Set appropriate conversion values
- Track micro and macro conversions
- Use consistent conversion naming

### 3. A/B Testing

- Test one element at a time
- Run tests for statistical significance
- Document test hypotheses and results

### 4. Performance

- Monitor Core Web Vitals regularly
- Set performance budgets
- Track custom metrics relevant to your application

### 5. Privacy

- Respect user privacy preferences
- Implement proper consent management
- Follow data protection regulations

## Integration Examples

### E-commerce Tracking

```tsx
// Product view
trackEvent({
  action: 'view_item',
  category: 'ecommerce',
  label: productId,
  customParameters: {
    item_name: product.name,
    item_category: product.category,
    value: product.price,
    currency: 'USD'
  }
});

// Purchase conversion
trackConversion({
  eventName: 'purchase',
  conversionValue: orderTotal,
  currency: 'USD',
  transactionId: orderId,
  customParameters: {
    items: orderItems,
    shipping: shippingCost
  }
});
```

### Content Engagement

```tsx
// Article reading
trackEvent({
  action: 'article_read',
  category: 'content',
  label: articleId,
  customParameters: {
    reading_time: timeSpent,
    scroll_percentage: scrollDepth,
    word_count: article.wordCount
  }
});
```

### Lead Generation

```tsx
// Lead form submission
trackConversion({
  eventName: 'lead_generation',
  conversionValue: 25,
  customParameters: {
    lead_source: 'organic_search',
    form_type: 'contact_form',
    lead_quality: 'high'
  }
});
```

This comprehensive analytics system provides everything needed to track user behavior, optimize conversions, and improve performance while maintaining user privacy and compliance with data protection regulations.