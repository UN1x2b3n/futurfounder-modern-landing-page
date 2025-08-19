# Feature Card Component System

This directory contains a reusable feature card component system that meets the requirements for displaying key features in an organized, responsive layout.

## Components

### FeatureCard
A single feature card component with:
- Icon + title + description layout
- Hover animations and gradient effects
- Responsive design
- Accessibility support

### FeatureGrid
A grid container for feature cards with:
- Responsive layout (4 → 2 → 1 columns)
- Staggered animation entrance effects
- Optional section title and subtitle
- Maximum 6 features limit (as per requirements)

## Usage

### Basic Usage
```tsx
import { FeatureGrid } from './components/FeatureGrid';
import { featuresData } from './components/data/features';

// In your component
<FeatureGrid
  features={featuresData}
  title="Our Features"
  subtitle="Amazing features for everyone"
/>
```

### Integration in App.tsx
To integrate the feature grid into the main application, add it between existing sections:

```tsx
// Add this import at the top of App.tsx
import { FeatureGrid } from './components/FeatureGrid';
import { featuresData } from './components/data/features';

// Add this section after the founders section and before the journey section
{/* Features Section */}
<FeatureGrid
  features={featuresData}
  title="Why Choose FuturFounder?"
  subtitle="Our comprehensive platform provides everything you need to transform from student to successful startup founder"
/>
```

## Features Implemented

✅ **Requirement 3.1**: Grid/card layout for features  
✅ **Requirement 3.2**: Icons, titles, and descriptions  
✅ **Requirement 3.3**: Maximum 6 features to avoid cognitive overload  
✅ **Requirement 3.4**: Responsive stacking on mobile  
✅ **Requirement 3.5**: Subtle hover effects  
✅ **Requirement 6.2**: Responsive design optimization  
✅ **Requirement 6.3**: Touch-friendly interactions  

## Animation Features

- **Staggered entrance**: Cards animate in with 0.1s delays
- **Hover effects**: Scale, translate, and rotation animations
- **Gradient borders**: Animated opacity changes on hover
- **Icon animations**: Rotation and scale on hover
- **Text effects**: Gradient text transitions

## Responsive Breakpoints

- **Mobile (default)**: 1 column
- **Tablet (md: 768px+)**: 2 columns  
- **Desktop (lg: 1024px+)**: 3 columns
- **Large Desktop (xl: 1280px+)**: 4 columns

## Accessibility

- Proper heading hierarchy (h2 for section, h3 for cards)
- ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast text and backgrounds
- Reduced motion support (via CSS)

## Testing

Test files are included:
- `__tests__/FeatureCard.test.tsx`
- `__tests__/FeatureGrid.test.tsx`

## Customization

### Custom Features Data
Create your own features array:

```tsx
const customFeatures = [
  {
    icon: YourIcon,
    title: "Your Feature",
    description: "Your description",
    gradient: "from-blue-500 to-purple-600"
  }
];
```

### Custom Styling
Pass additional className props:

```tsx
<FeatureGrid 
  features={features}
  className="bg-custom-background"
/>
```

## Performance Optimizations

- Uses `whileInView` for scroll-triggered animations
- `viewport={{ once: true }}` prevents re-triggering
- GPU-accelerated transforms
- Optimized animation timing
- Lazy loading compatible structure