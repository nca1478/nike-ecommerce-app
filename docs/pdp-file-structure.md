# Product Details Page - File Structure

## Created Files

```
nike-ecommerce-app/
├── app/
│   └── (root)/
│       └── products/
│           └── [id]/
│               ├── page.tsx                      ← Main server-rendered page
│               └── ProductGalleryWrapper.tsx     ← Client wrapper for gallery state
│
├── components/
│   ├── ProductGallery.tsx                        ← Client: Image gallery component
│   ├── ColorVariantPicker.tsx                    ← Client: Color variant selector
│   ├── SizePicker.tsx                            ← Client: Size selection UI
│   ├── CollapsibleSection.tsx                    ← Client: Expandable sections
│   └── index.ts                                  ← Updated exports
│
└── docs/
    ├── product-details-page.md                   ← Full documentation
    └── pdp-file-structure.md                     ← This file
```

## Modified Files

```
nike-ecommerce-app/
├── app/
│   └── (root)/
│       └── page.tsx                              ← Added product links
│
└── components/
    └── index.ts                                  ← Added new component exports
```

## Component Hierarchy

```
page.tsx (Server Component)
├── ProductGalleryWrapper (Client)
│   ├── ProductGallery (Client)
│   └── ColorVariantPicker (Client)
├── SizePicker (Client)
├── CollapsibleSection (Client) × 3
└── Card (Client) × 3 (Related Products)
```

## Routing

- **Route**: `/products/[id]`
- **Dynamic Segment**: `id` parameter
- **Example URLs**:
    - `/products/1` → Nike Air Max 90 SE
    - `/products/2` → Nike Air Force 1 Mid 07
    - `/products/3` → Nike Court Vision Low
    - `/products/4` → Nike Dunk Low Retro

## Data Flow

1. **Server**: `page.tsx` receives `id` from URL params
2. **Server**: Fetches mock product data based on `id`
3. **Server**: Renders static HTML with product info
4. **Client**: `ProductGalleryWrapper` manages variant state
5. **Client**: Gallery updates when variant changes
6. **Client**: Size picker and collapsible sections handle interactions

## Key Design Decisions

### Server vs Client Components

**Server Components** (Static, SEO-friendly):

- Main page layout
- Product metadata
- Related products section
- Static content rendering

**Client Components** (Interactive):

- Image gallery navigation
- Color variant selection
- Size picker
- Collapsible sections

### Why This Split?

1. **Performance**: Server components reduce JavaScript bundle size
2. **SEO**: Product information is rendered on server for search engines
3. **Interactivity**: Only interactive parts need client-side JavaScript
4. **Maintainability**: Clear separation of concerns

## Mock Data Location

All product data is currently defined in:

- `app/(root)/products/[id]/page.tsx` (MOCK_PRODUCTS constant)

This should be replaced with database queries in production.

## Styling Approach

- **Framework**: Tailwind CSS
- **Theme**: Custom tokens from `app/globals.css`
- **Responsive**: Mobile-first approach
- **Consistency**: Reuses existing design system

## Accessibility Features

- Semantic HTML structure
- ARIA labels and states
- Keyboard navigation
- Focus indicators
- Screen reader support
- Alt text for images

## Next Steps

1. Connect to real database
2. Implement cart functionality
3. Add wishlist feature
4. Create product review system
5. Add image zoom
6. Implement size availability
7. Add social sharing
8. Track recently viewed products
