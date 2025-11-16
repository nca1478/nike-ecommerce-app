# Product Details Page (PDP) Documentation

## Overview

The Product Details Page is a fully server-rendered page that displays comprehensive product information including an interactive gallery, color variants, size selection, and related products.

## Architecture

### Server Components

- **`app/(root)/products/[id]/page.tsx`**: Main server-rendered page that fetches product data and composes the layout

### Client Components

- **`ProductGallery.tsx`**: Interactive image gallery with thumbnail navigation and keyboard support
- **`ColorVariantPicker.tsx`**: Color variant selector that updates the gallery
- **`SizePicker.tsx`**: Size selection interface
- **`CollapsibleSection.tsx`**: Expandable sections for product details, shipping, and reviews
- **`ProductGalleryWrapper.tsx`**: Client wrapper that manages variant state

## Features

### 1. Product Gallery

- Main image display with aspect ratio preservation
- Thumbnail strip with horizontal scroll on mobile
- Keyboard navigation (arrow keys)
- Automatic image validation (skips broken images)
- Empty state with fallback icon
- Navigation arrows on hover

### 2. Color Variants

- Visual color swatches with product thumbnails
- Selected state indication with checkmark
- Updates gallery when variant is selected
- Keyboard accessible

### 3. Size Selection

- Grid layout responsive to screen size
- Visual feedback for selected size
- Keyboard navigation support
- No backend logic (UI only)

### 4. Product Information

- Product name and category
- Price with optional compare-at price
- Discount badge calculation
- Star rating display
- Review count

### 5. Collapsible Sections

- Product Details (features list)
- Shipping & Returns information
- Reviews with rating display
- Smooth expand/collapse animation

### 6. Related Products

- "You Might Also Like" section
- Reuses Card component
- Links to other product pages
- Filters out current product

## Responsive Design

### Desktop (lg+)

- Two-column layout (gallery left, info right)
- Full-width gallery with side-by-side thumbnails
- Spacious product information section

### Tablet (md)

- Two-column layout maintained
- Adjusted spacing and padding
- Optimized thumbnail sizes

### Mobile (sm and below)

- Single column stacked layout
- Gallery at top with full width
- Horizontal scrolling thumbnails
- Product info below gallery
- Touch-optimized size selector

## Accessibility

### Keyboard Navigation

- Arrow keys navigate gallery images
- Tab navigation through all interactive elements
- Enter/Space to select sizes and variants
- Focus indicators on all interactive elements

### ARIA Labels

- Descriptive labels for all buttons
- Proper aria-pressed states
- Semantic HTML structure
- Alt text for all images

### Screen Reader Support

- Meaningful button labels
- State announcements
- Proper heading hierarchy

## Data Structure

### Product Object

```typescript
{
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  sizes: string[];
  variants: ColorVariant[];
}
```

### Color Variant Object

```typescript
{
  id: string;
  name: string;
  images: string[];
  thumbnail: string;
}
```

## Mock Data

Currently uses static mock data defined in `page.tsx`:

- 4 sample products with full details
- Multiple color variants per product
- Related products for recommendations

## Future Enhancements

- Connect to real database
- Add to cart functionality
- Wishlist/favorite functionality
- Product reviews system
- Size availability checking
- Zoom functionality for images
- Video support in gallery
- Social sharing
- Recently viewed products

## Styling

- Uses Tailwind CSS with custom theme tokens from `globals.css`
- Follows Nike design system
- Consistent spacing and typography
- Smooth transitions and hover effects

## Performance

- Server-side rendering for initial load
- Next.js Image optimization
- Lazy loading for related products
- Minimal client-side JavaScript
- Efficient state management

## Testing Checklist

- [ ] Gallery navigation works with mouse and keyboard
- [ ] Color variants update gallery correctly
- [ ] Size selection provides visual feedback
- [ ] Collapsible sections expand/collapse smoothly
- [ ] Related products link correctly
- [ ] Responsive layout works on all screen sizes
- [ ] Images load with proper fallbacks
- [ ] Accessibility features work with screen readers
- [ ] Focus management is logical
- [ ] No console errors or warnings
