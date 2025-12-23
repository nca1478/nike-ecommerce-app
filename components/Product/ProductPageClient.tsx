'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
    CollapsibleSection,
    ColorVariantPickerClient,
    ProductActionsWrapper,
    ProductGalleryClient,
    ProductReviews,
    SizeOption,
    VariantProvider,
    VariantWithImages,
} from '@/components';

interface Product {
    id: string;
    name: string;
    description: string;
    category: { name: string };
    gender: { label: string };
    brand: { name: string };
    variants: Array<{
        id: string;
        colorId: string;
        sizeId: string;
        price: string;
        salePrice: string | null;
        inStock: string;
        color: {
            name: string;
            hexCode: string;
        };
        size: {
            id: string;
            name: string;
            sortOrder: number;
        };
    }>;
    images: Array<{
        url: string;
        variantId: string | null;
    }>;
}

interface ProductPageClientProps {
    product: Product | null;
    selectedColorId?: string;
}

export default function ProductPageClient({
    product,
    selectedColorId,
}: ProductPageClientProps) {
    const { t } = useI18n();

    if (!product) {
        return (
            <div className="min-h-screen bg-light-100 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-heading-2 font-bold text-dark-900 mb-4">
                        {t.products.productNotFound}
                    </h1>
                    <p className="text-body text-dark-700 mb-6">
                        {t.products.productNotFoundDescription}
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-dark-900 text-light-100 px-8 py-3 rounded-full text-body-medium font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                    >
                        {t.products.browseAllProducts}
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
        <VariantProvider
            variants={colorVariants}
            initialColorId={selectedColorId}
        >
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
                                        {t.products.save} {discountPercentage}%
                                    </p>
                                )}
                            </div>

                            {/* Color Variants */}
                            {colorVariants.length > 1 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-body-medium text-dark-900">
                                            {t.products.selectColor}
                                        </h3>
                                        <span className="text-caption text-dark-700">
                                            {colorVariants.length}{' '}
                                            {colorVariants.length === 1
                                                ? t.products.color
                                                : t.products.color + 's'}
                                        </span>
                                    </div>
                                    <ColorVariantPickerClient
                                        variants={colorVariants}
                                    />
                                </div>
                            )}

                            {/* Product Actions (Size Selector + Add to Cart) */}
                            <div className="mb-8">
                                <ProductActionsWrapper
                                    productName={product.name}
                                    productImage={
                                        colorVariants[0]?.images[0] || ''
                                    }
                                    category={product.category.name}
                                    sizes={sizes}
                                    variants={product.variants}
                                />
                            </div>

                            {/* Product Description */}
                            <div className="mb-6">
                                <p className="text-body text-dark-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Collapsible Sections */}
                            <div className="border-t border-light-300">
                                <CollapsibleSection
                                    title={t.products.productDetails}
                                >
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                {t.products.brand}:{' '}
                                                {product.brand.name}
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                {t.products.category}:{' '}
                                                {product.category.name}
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                {t.products.genderLabel}:{' '}
                                                {product.gender.label}
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                {t.products.availableIn}{' '}
                                                {colorVariants.length}{' '}
                                                {colorVariants.length === 1
                                                    ? t.products.color
                                                    : t.products.color + 's'}
                                            </span>
                                        </li>
                                    </ul>
                                </CollapsibleSection>

                                <CollapsibleSection
                                    title={t.products.shippingReturns}
                                >
                                    <div className="space-y-3">
                                        <p>
                                            <strong>
                                                {t.products.freeShipping}
                                            </strong>{' '}
                                            {t.products.freeShippingDescription}
                                        </p>
                                        <p>{t.products.returnsPolicy}</p>
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection title={t.products.reviews}>
                                    <ProductReviews productId={product.id} />
                                </CollapsibleSection>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VariantProvider>
    );
}
