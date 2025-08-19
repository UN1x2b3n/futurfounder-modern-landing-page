# Navigation Component

## Overview

The Navigation component provides a modern, responsive navigation header with smooth scrolling, mobile menu, and dynamic styling based on scroll position.

## Features

### ✅ Responsive Design
- **Desktop**: Horizontal menu with hover effects
- **Mobile**: Hamburger menu with slide-out panel
- **Tablet**: Adaptive layout for medium screens

### ✅ Smooth Scrolling
- Smooth scroll to page sections with offset for fixed header
- Active section highlighting based on scroll position
- Keyboard navigation support

### ✅ Dynamic Styling
- Transparent header on hero section
- Backdrop blur and shadow when scrolled
- Color transitions for different backgrounds

### ✅ Mobile Experience
- Touch-friendly hamburger menu
- Full-screen mobile menu overlay
- Swipe gestures and touch interactions
- Escape key to close menu

### ✅ Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management for mobile menu
- High contrast color schemes

## Usage

```tsx
import { Navigation } from './components/Navigation';

// Basic usage with default menu items
<Navigation />

// Custom menu items
const customMenuItems = [
  { label: 'Home', href: '#hero', id: 'hero' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

<Navigation menuItems={customMenuItems} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuItems` | `MenuItem[]` | Default menu | Array of navigation menu items |

### MenuItem Interface

```tsx
interface MenuItem {
  label: string;    // Display text
  href: string;     // Anchor link (e.g., '#section')
  id: string;       // Section ID for active state
}
```

## Styling

The component uses Tailwind CSS classes with the following design tokens:

- **Colors**: Orange to pink gradient theme
- **Spacing**: Consistent padding and margins
- **Typography**: Font weights and sizes for hierarchy
- **Animations**: Smooth transitions and hover effects

## Implementation Details

### Scroll Detection
- Uses `useEffect` with scroll event listener
- Updates active section based on element positions
- Applies backdrop blur when scrolled past threshold

### Mobile Menu
- Animated slide-in from right side
- Backdrop overlay with blur effect
- Body scroll lock when menu is open
- Staggered animation for menu items

### Performance
- Debounced scroll events for better performance
- GPU-accelerated animations using transforms
- Lazy loading of non-critical animations

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Dependencies

- `motion/react` - For animations
- `lucide-react` - For icons
- `react` - Core React hooks

## Testing

The component includes comprehensive tests covering:
- Rendering with default and custom props
- Smooth scroll functionality
- Mobile menu interactions
- Keyboard navigation
- Scroll-based styling changes

Run tests with:
```bash
npm test Navigation.test.tsx
```