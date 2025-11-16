# Product Details Page - Usage Examples

## Component Usage

### 1. ProductGallery

```tsx
import { ProductGallery } from '@/components/ProductGallery';

// Basic usage
<ProductGallery
  images={['/shoes/shoe-1.jpg', '/shoes/shoe-2.webp']}
  productName="Nike Air Max 90"
/>

// With empty state (no images)
<ProductGallery
  images={[]}
  productName="Nike Air Max 90"
/>
// Shows fallback with ImageOff icon

// With invalid images (automatically filtered)
<ProductGallery
  images={['', '/shoes/shoe-1.jpg', null, '/shoes/shoe-2.webp']}
  productName="Nike Air Max 90"
/>
// Only valid images are displayed
```

### 2. ColorVariantPicker

```tsx
import {
    ColorVariantPicker,
    ColorVariant,
} from '@/components/ColorVariantPicker';

const variants: ColorVariant[] = [
    {
        id: 'red-white',
        name: 'Dark Team Red',
        images: ['/shoes/shoe-1.jpg', '/shoes/shoe-2.webp'],
        thumbnail: '/shoes/shoe-1.jpg',
    },
    {
        id: 'white-black',
        name: 'White/Black',
        images: ['/shoes/shoe-5.avif'],
        thumbnail: '/shoes/shoe-5.avif',
    },
];

<ColorVariantPicker
    variants={variants}
    onVariantChange={(variant) => {
        console.log('Selected variant:', variant);
        // Update gallery or other state
    }}
/>;
```

### 3. SizePicker

```tsx
import { SizePicker } from '@/components/SizePicker';

// Standard sizes
<SizePicker
  sizes={['7', '7.5', '8', '8.5', '9', '9.5', '10']}
/>

// Extended sizes
<SizePicker
  sizes={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
/>
```

### 4. CollapsibleSection

```tsx
import { CollapsibleSection } from '@/components/CollapsibleSection';

// Basic usage
<CollapsibleSection title="Product Details">
  <p>Product description goes here...</p>
</CollapsibleSection>

// Open by default
<CollapsibleSection title="Product Details" defaultOpen={true}>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>
</CollapsibleSection>

// Multiple sections
<div className="border-t border-light-300">
  <CollapsibleSection title="Details" defaultOpen={true}>
    <p>Details content...</p>
  </CollapsibleSection>

  <CollapsibleSection title="Shipping">
    <p>Shipping information...</p>
  </CollapsibleSection>

  <CollapsibleSection title="Reviews">
    <p>Reviews content...</p>
  </CollapsibleSection>
</div>
```

### 5. ProductGalleryWrapper

```tsx
import { ProductGalleryWrapper } from '@/app/(root)/products/[id]/ProductGalleryWrapper';

const variants = [
    {
        id: 'variant-1',
        name: 'Red',
        images: ['/img1.jpg', '/img2.jpg'],
        thumbnail: '/img1.jpg',
    },
];

<ProductGalleryWrapper variants={variants} productName="Nike Air Max" />;
// Handles both gallery and color picker with shared state
```

## Full Page Example

```tsx
// app/(root)/products/[id]/page.tsx
import { ProductGallery } from '@/components/ProductGallery';
import { ColorVariantPicker } from '@/components/ColorVariantPicker';
import { SizePicker } from '@/components/SizePicker';
import { CollapsibleSection } from '@/components/CollapsibleSection';

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Fetch product data
    const product = await getProduct(id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div>
                <ProductGallery
                    images={product.images}
                    productName={product.name}
                />
                <ColorVariantPicker
                    variants={product.variants}
                    onVariantChange={(variant) => {
                        // Handle variant change
                    }}
                />
            </div>

            {/* Info Column */}
            <div>
                <h1>{product.name}</h1>
                <p>${product.price}</p>

                <SizePicker sizes={product.sizes} />

                <button>Add to Bag</button>

                <CollapsibleSection title="Details" defaultOpen>
                    <p>{product.description}</p>
                </CollapsibleSection>
            </div>
        </div>
    );
}
```

## Keyboard Navigation

### ProductGallery

- **Arrow Left**: Previous image
- **Arrow Right**: Next image
- **Tab**: Navigate to thumbnails
- **Enter/Space**: Select thumbnail

### ColorVariantPicker

- **Tab**: Navigate between variants
- **Arrow Left/Right**: Move between variants
- **Enter/Space**: Select variant

### SizePicker

- **Tab**: Navigate between sizes
- **Arrow Left/Right**: Move between sizes
- **Enter/Space**: Select size

### CollapsibleSection

- **Tab**: Focus section header
- **Enter/Space**: Toggle section

## Responsive Behavior

### Desktop (lg: 1024px+)

```tsx
<div className="grid grid-cols-2 gap-8">
    <div>{/* Gallery */}</div>
    <div>{/* Info */}</div>
</div>
```

### Tablet (md: 768px - 1023px)

```tsx
<div className="grid grid-cols-2 gap-6">
    <div>{/* Gallery */}</div>
    <div>{/* Info */}</div>
</div>
```

### Mobile (< 768px)

```tsx
<div className="grid grid-cols-1 gap-4">
    <div>{/* Gallery - Full width */}</div>
    <div>{/* Info - Full width */}</div>
</div>
```

## Styling Customization

All components use Tailwind CSS classes from the global theme:

```css
/* globals.css */
--color-dark-900: #111111;
--color-light-100: #ffffff;
--color-light-200: #f5f5f5;
--color-light-300: #e5e5e5;
```

To customize, modify the theme tokens in `app/globals.css`.

## Error Handling

### Empty Images

```tsx
<ProductGallery images={[]} productName="Product" />
// Shows: ImageOff icon with "No images available" message
```

### Invalid Images

```tsx
<ProductGallery
    images={['', null, undefined, '/valid-image.jpg']}
    productName="Product"
/>
// Automatically filters out invalid images
// Only shows valid-image.jpg
```

### No Variants

```tsx
<ColorVariantPicker variants={[]} onVariantChange={() => {}} />
// Returns null, doesn't render anything
```

## Performance Tips

1. **Use Next.js Image**: All images use `next/image` for optimization
2. **Lazy Loading**: Images are lazy-loaded by default
3. **Priority Loading**: First gallery image uses `priority` prop
4. **Proper Sizing**: Use `sizes` prop for responsive images

```tsx
<Image
    src="/image.jpg"
    alt="Product"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    priority={isFirstImage}
/>
```

## Accessibility Checklist

- ✅ Semantic HTML (`<button>`, `<nav>`, etc.)
- ✅ ARIA labels (`aria-label`, `aria-pressed`)
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Alt text for images
- ✅ Screen reader support
- ✅ Color contrast (WCAG AA)
- ✅ Touch targets (44×44px minimum)

## Testing

```tsx
// Test gallery navigation
const gallery = screen.getByRole('img', { name: /product/i });
fireEvent.click(screen.getByLabelText('Next image'));
expect(gallery).toHaveAttribute('src', '/image-2.jpg');

// Test size selection
const sizeButton = screen.getByRole('button', { name: 'Select size 9' });
fireEvent.click(sizeButton);
expect(sizeButton).toHaveAttribute('aria-pressed', 'true');

// Test collapsible section
const section = screen.getByRole('button', { name: 'Product Details' });
fireEvent.click(section);
expect(section).toHaveAttribute('aria-expanded', 'true');
```
