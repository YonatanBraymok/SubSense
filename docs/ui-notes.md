# UI Design System & Component Notes

## Overview

This document outlines the design system, component architecture, and UI patterns used in the SubSense application. The system follows modern design principles with a focus on accessibility, consistency, and user experience.

## Design Tokens

### Color Palette

#### Primary Colors
- `--primary`: Main brand color for buttons, links, and interactive elements
- `--primary-foreground`: Text color on primary backgrounds
- `--primary/10`: 10% opacity for subtle backgrounds and hover states

#### Semantic Colors
- `--success`: Green tones for positive actions and states
- `--danger`: Red tones for errors and destructive actions
- `--warning`: Orange tones for caution and attention
- `--info`: Blue tones for informational content

#### Background & Surface Colors
- `--background`: Main page background
- `--surface`: Card and component backgrounds
- `--muted`: Subtle backgrounds for secondary content
- `--muted-foreground`: Text color for muted content

#### Border & Divider Colors
- `--border`: Standard border color
- `--input`: Input field borders
- `--ring`: Focus ring color for accessibility

### Typography Scale

#### Headings
- `h1`: `text-3xl font-bold tracking-tight` - Page titles and main headings
- `h2`: `text-2xl font-semibold` - Section headings
- `h3`: `text-xl font-semibold` - Subsection headings
- `h4`: `text-lg font-medium` - Card titles and small headings

#### Body Text
- `body`: `text-base` - Main content text
- `body-small`: `text-sm` - Secondary content and captions
- `caption`: `text-xs` - Small labels and metadata

#### Font Weights
- `font-light`: 300 - Subtle text
- `font-normal`: 400 - Regular text
- `font-medium`: 500 - Emphasized text
- `font-semibold`: 600 - Strong emphasis
- `font-bold`: 700 - Heavy emphasis

### Spacing Scale

#### Padding & Margin
- `p-1` to `p-12`: 0.25rem to 3rem
- `px-6`: Horizontal padding for page sections
- `py-8`: Vertical padding for content areas
- `gap-2` to `gap-8`: Component spacing

#### Component Spacing
- `space-y-2` to `space-y-8`: Vertical spacing between elements
- `space-x-2` to `space-x-4`: Horizontal spacing between elements

### Border Radius

#### Component Corners
- `rounded`: 0.25rem - Small components
- `rounded-lg`: 0.5rem - Cards and larger components
- `rounded-xl`: 0.75rem - Prominent components
- `rounded-full`: 50% - Circular elements

### Shadows

#### Elevation Levels
- `shadow-sm`: Subtle shadow for cards
- `shadow-md`: Medium shadow for elevated components
- `shadow-lg`: Strong shadow for prominent elements
- `hover:shadow-md`: Interactive shadow on hover

## Component Architecture

### Base Components (shadcn/ui)

#### Card System
- `Card`: Base container with consistent padding and borders
- `CardHeader`: Header section with title and optional actions
- `CardContent`: Main content area
- `CardTitle`: Consistent heading styles

#### Button Variants
- `Button`: Primary action button
- `Button variant="outline"`: Secondary action button
- `Button variant="ghost"`: Subtle action button
- `Button size="sm"`: Small button for compact layouts
- `Button size="lg"`: Large button for prominent actions

#### Form Components
- `Input`: Text input with consistent styling
- `Label`: Accessible form labels
- `Select`: Dropdown selection component
- `Badge`: Status and category indicators

#### Feedback Components
- `Skeleton`: Loading state placeholders
- `Toast`: Success/error notifications
- `Dialog`: Modal overlays

### Custom Dashboard Components

#### StatCard
- **Purpose**: Display key metrics and statistics
- **Props**: title, value, description, icon, trend, trendValue
- **Features**: Hover animations, trend indicators, responsive layout
- **Usage**: Grid layout for dashboard statistics

#### SubscriptionsPreview
- **Purpose**: Show condensed subscription list with actions
- **Props**: subscriptions, isLoading, className
- **Features**: Loading states, empty states, "View All" CTA
- **Usage**: Main content area of dashboard

#### UpcomingRenewals
- **Purpose**: Display subscription renewals in next 30 days
- **Props**: subscriptions, className
- **Features**: Urgency indicators, color coding, smart filtering
- **Usage**: Sidebar content for quick overview

#### WelcomeHeader
- **Purpose**: Personalized welcome message with action buttons
- **Props**: userName, userEmail, className
- **Features**: Animated entrance, responsive button layout
- **Usage**: Top of dashboard for user engagement

## Animation & Motion

### Framer Motion Integration

#### Entrance Animations
- `initial={{ opacity: 0, y: 20 }}`: Fade in from below
- `initial={{ opacity: 0, x: -20 }}`: Slide in from left
- `initial={{ opacity: 0, x: 20 }}`: Slide in from right

#### Hover Effects
- `whileHover={{ y: -2 }}`: Subtle lift on hover
- `whileHover={{ scale: 1.02 }}`: Gentle scale on hover

#### Staggered Animations
- `delay: index * 0.1`: Sequential animation for lists
- `transition={{ duration: 0.3 }}`: Consistent timing

### Motion Preferences
- Respects `prefers-reduced-motion`
- Subtle animations for better UX
- Performance-optimized transitions

## Responsive Design

### Breakpoint Strategy

#### Mobile First
- Base styles for mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interaction targets

#### Grid Layouts
- `grid-cols-1`: Single column on mobile
- `md:grid-cols-2`: Two columns on medium screens
- `lg:grid-cols-4`: Four columns on large screens

#### Component Responsiveness
- Cards stack vertically on mobile
- Sidebar content moves below main content
- Button groups adapt to available space

## Accessibility Features

### ARIA Support
- `aria-describedby`: Form descriptions
- `aria-live`: Dynamic content announcements
- `aria-busy`: Loading state indicators
- `aria-invalid`: Form validation states

### Keyboard Navigation
- Focus-visible rings for all interactive elements
- Logical tab order through components
- Escape key support for modals and dialogs

### Screen Reader Support
- Semantic HTML structure
- Descriptive alt text for icons
- Clear heading hierarchy
- Meaningful button and link text

## Dark Mode Support

### Color Adaptation
- Automatic dark mode detection
- Consistent contrast ratios
- Semantic color mapping
- Smooth theme transitions

### Component Dark Variants
- Dark backgrounds for cards and surfaces
- Adjusted text colors for readability
- Modified border and shadow colors
- Icon color adaptations

## Usage Guidelines

### Component Composition
1. **Start with base components**: Use shadcn/ui primitives
2. **Extend with custom logic**: Add business-specific functionality
3. **Maintain consistency**: Follow established patterns
4. **Test accessibility**: Ensure keyboard and screen reader support

### Layout Principles
1. **Visual hierarchy**: Use spacing and typography to guide attention
2. **Content grouping**: Related information should be visually connected
3. **Responsive behavior**: Design for all screen sizes
4. **Performance**: Optimize animations and transitions

### State Management
1. **Loading states**: Show skeleton loaders during data fetching
2. **Empty states**: Provide helpful guidance when no data exists
3. **Error states**: Clear error messages with recovery options
4. **Success feedback**: Confirm successful actions with toasts

## Future Enhancements

### Planned Components
- Advanced data visualization charts
- Enhanced filter and search components
- Notification center and alerts
- User preference management

### Design System Evolution
- Component library documentation
- Design token management
- Automated accessibility testing
- Performance monitoring and optimization

## Implementation Notes

### Dependencies
- `framer-motion`: Animation library
- `lucide-react`: Icon library
- `tailwindcss`: Utility-first CSS framework
- `shadcn/ui`: Component primitives

### File Structure
```
src/components/
├── ui/           # Base shadcn/ui components
├── dashboard/    # Dashboard-specific components
└── shared/       # Reusable custom components
```

### Performance Considerations
- Lazy loading for non-critical components
- Optimized bundle splitting
- Efficient re-rendering strategies
- Minimal JavaScript bundle size 