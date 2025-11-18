import { Suspense } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { getProduct } from '@/lib/actions/product';
import {
    VariantProvider,
    ProductGalleryClient,
    ColorVariantPickerClient,
    VariantWithImages,
} from './ProductVariantManager';
import { SizePickerWithStock, SizeOption } from './SizePickerWithStock';
import { ProductReviews } from './ProductReviews';
import { RecommendedProducts } from './RecommendedProducts';
import { ReviewsSkeleton } from './ReviewsSkeleton';
import { RecommendedSkeleton } from './RecommendedSkeleton';
import { CollapsibleSection } from '@/components';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="min-h-screen bg-light-100 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-heading-2 font-bold text-dark-900 mb-4">
                        Product Not Found
                    </h1>
                    <p className="text-body text-dark-700 mb-6">
                        The product you&apos;re looking for doesn&apos;t exist
                        or has been removed.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-dark-900 text-light-100 px-8 py-3 rounded-full text-body-medium font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                    >
                        Browse All Products
                    </Link>
                </div>
            </div>
        );
    }

    // Group images by color variant
    const colorVariantsMap = new Map<
        string,
        {
            colorId: string;
            colorName: string;
            colorHex: string;
            images: string[];
        }
    >();

    product.variants.forEach((variant) => {
        if (!colorVariantsMap.has(variant.colorId)) {
            colorVariantsMap.set(variant.colorId, {
                colorId: variant.colorId,
                colorName: variant.color.name,
                colorHex: variant.color.hexCode,
                images: [],
            });
        }
    });

    // Add images to their respective color variants
    product.images.forEach((image) => {
        if (image.variantId) {
            const variant = product.variants.find(
                (v) => v.id === image.variantId,
            );
            if (variant) {
                const colorVariant = colorVariantsMap.get(variant.colorId);
                if (colorVariant && !colorVariant.images.includes(image.url)) {
                    colorVariant.images.push(image.url);
                }
            }
        } else {
            // Images without variant ID are added to all color variants
            colorVariantsMap.forEach((colorVariant) => {
                if (!colorVariant.images.includes(image.url)) {
                    colorVariant.images.push(image.url);
                }
            });
        }
    });

    // Convert to array and add thumbnails
    const colorVariants: VariantWithImages[] = Array.from(
        colorVariantsMap.values(),
    )
        .filter((cv) => cv.images.length > 0)
        .map((cv) => ({
            ...cv,
            thumbnail: cv.images[0],
        }));

    // If no color variants with images, create a default one with all images
    if (colorVariants.length === 0 && product.images.length > 0) {
        colorVariants.push({
            colorId: 'default',
            colorName: 'Default',
            colorHex: '#000000',
            images: product.images.map((img) => img.url),
            thumbnail: product.images[0].url,
        });
    }

    // Get unique sizes with stock info
    const sizesMap = new Map<string, SizeOption>();
    product.variants.forEach((variant) => {
        const sizeKey = variant.size.id;
        if (!sizesMap.has(sizeKey)) {
            sizesMap.set(sizeKey, {
                id: variant.size.id,
                name: variant.size.name,
                inStock: parseInt(variant.inStock) > 0,
            });
        } else {
            // If any variant of this size has stock, mark as in stock
            const existing = sizesMap.get(sizeKey)!;
            if (parseInt(variant.inStock) > 0) {
                existing.inStock = true;
            }
        }
    });

    const sizes = Array.from(sizesMap.values()).sort(
        (a, b) =>
            product.variants.find((v) => v.size.id === a.id)!.size.sortOrder -
            product.variants.find((v) => v.size.id === b.id)!.size.sortOrder,
    );

    // Calculate pricing
    const prices = product.variants.map((v) => parseFloat(v.price));
    const salePrices = product.variants
        .filter((v) => v.salePrice)
        .map((v) => parseFloat(v.salePrice!));

    const minPrice = Math.min(...prices);
    const minSalePrice = salePrices.length > 0 ? Math.min(...salePrices) : null;
    const displayPrice = minSalePrice || minPrice;
    const compareAtPrice = minSalePrice ? minPrice : null;

    const discountPercentage =
        compareAtPrice && minSalePrice
            ? Math.round(
                  ((compareAtPrice - minSalePrice) / compareAtPrice) * 100,
              )
            : null;

    return (
        <VariantProvider variants={colorVariants}>
            <div className="min-h-screen bg-light-100">
                {/* Main Product Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column - Gallery */}
                        <div className="order-1">
                            <ProductGalleryClient productName={product.name} />
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="order-2">
                            {/* Product Title & Category */}
                            <div className="mb-4">
                                <h1 className="text-heading-2 font-bold text-dark-900 mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-body text-dark-700">
                                    {product.category.name} •{' '}
                                    {product.gender.label}
                                </p>
                            </div>

                            {/* Price Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-heading-2 font-bold text-dark-900">
                                        ${displayPrice.toFixed(2)}
                                    </span>
                                    {compareAtPrice && (
                                        <span className="text-lead text-dark-500 line-through">
                                            ${compareAtPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {discountPercentage && (
                                    <p className="text-body-medium text-green">
                                        Save {discountPercentage}%
                                    </p>
                                )}
                            </div>

                            {/* Color Variants */}
                            {colorVariants.length > 1 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-body-medium text-dark-900">
                                            Select Color
                                        </h3>
                                        <span className="text-caption text-dark-700">
                                            {colorVariants.length}{' '}
                                            {colorVariants.length === 1
                                                ? 'Color'
                                                : 'Colors'}
                                        </span>
                                    </div>
                                    <ColorVariantPickerClient
                                        variants={colorVariants}
                                    />
                                </div>
                            )}

                            {/* Size Selector */}
                            {sizes.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-body-medium text-dark-900">
                                            Select Size
                                        </h3>
                                        <Link
                                            href="#"
                                            className="text-caption text-dark-700 hover:text-dark-900 underline focus:outline-none focus:ring-2 focus:ring-dark-900 rounded"
                                        >
                                            Size Guide
                                        </Link>
                                    </div>
                                    <SizePickerWithStock sizes={sizes} />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mb-8 space-y-3">
                                <button className="w-full bg-dark-900 text-light-100 py-4 rounded-full text-body-medium font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 cursor-pointer">
                                    <span className="flex items-center justify-center gap-2">
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to Bag
                                    </span>
                                </button>
                                <button className="w-full bg-light-100 text-dark-900 py-4 rounded-full text-body-medium font-medium border-2 border-dark-900 hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 cursor-pointer">
                                    <span className="flex items-center justify-center gap-2">
                                        <Heart className="w-5 h-5" />
                                        Favourite
                                    </span>
                                </button>
                            </div>

                            {/* Product Description */}
                            <div className="mb-6">
                                <p className="text-body text-dark-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Collapsible Sections */}
                            <div className="border-t border-light-300">
                                <CollapsibleSection title="Product Details">
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Brand: {product.brand.name}
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Category:{' '}
                                                {product.category.name}
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Gender: {product.gender.label}
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Available in{' '}
                                                {colorVariants.length}{' '}
                                                {colorVariants.length === 1
                                                    ? 'color'
                                                    : 'colors'}
                                            </span>
                                        </li>
                                    </ul>
                                </CollapsibleSection>

                                <CollapsibleSection title="Shipping & Returns">
                                    <div className="space-y-3">
                                        <p>
                                            <strong>
                                                Free standard shipping
                                            </strong>{' '}
                                            on orders over $50.
                                        </p>
                                        <p>
                                            You can return your order for any
                                            reason, free of charge, within 30
                                            days.
                                        </p>
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection title="Reviews">
                                    <Suspense fallback={<ReviewsSkeleton />}>
                                        <ProductReviews
                                            productId={product.id}
                                        />
                                    </Suspense>
                                </CollapsibleSection>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You Might Also Like Section */}
                <Suspense fallback={<RecommendedSkeleton />}>
                    <RecommendedProducts productId={product.id} />
                </Suspense>
            </div>
        </VariantProvider>
    );
}
