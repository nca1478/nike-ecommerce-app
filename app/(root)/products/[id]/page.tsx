import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { SizePicker } from '@/components/SizePicker';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { Card } from '@/components/Card';
import {
    VariantProvider,
    ProductGalleryClient,
    ColorVariantPickerClient,
} from './ProductGalleryWrapper';

// Mock product data
const MOCK_PRODUCTS = {
    '1': {
        id: '1',
        name: 'Nike Air Max 90 SE',
        category: "Women's Shoes",
        price: 140,
        compareAtPrice: 175,
        discount: 20,
        rating: 4.5,
        reviewCount: 10,
        description:
            "The Air Max 90 stays true to its running roots with the iconic Waffle sole, stitched overlays and textured accents create the '90s look you love. Complete with romantic hues, its visible Air cushioning adds major comfort to your journey.",
        features: [
            'Padded collar',
            'Foam midsole',
            'Shown: Dark Team Red/Platinum Tint/Pure Platinum/White',
            'Style: DM9051-600',
        ],
        sizes: [
            '5',
            '5.5',
            '6',
            '6.5',
            '7',
            '7.5',
            '8',
            '8.5',
            '9',
            '9.5',
            '10',
            '10.5',
            '11',
            '11.5',
        ],
        variants: [
            {
                id: 'red-white',
                name: 'Dark Team Red',
                images: [
                    '/shoes/shoe-1.jpg',
                    '/shoes/shoe-2.webp',
                    '/shoes/shoe-3.webp',
                ],
                thumbnail: '/shoes/shoe-1.jpg',
            },
            {
                id: 'white-black',
                name: 'White/Black',
                images: ['/shoes/shoe-5.avif', '/shoes/shoe-6.avif'],
                thumbnail: '/shoes/shoe-5.avif',
            },
            {
                id: 'black-blue',
                name: 'Black/Blue',
                images: ['/shoes/shoe-7.avif', '/shoes/shoe-8.avif'],
                thumbnail: '/shoes/shoe-7.avif',
            },
            {
                id: 'grey-pink',
                name: 'Grey/Pink',
                images: ['/shoes/shoe-9.avif', '/shoes/shoe-10.avif'],
                thumbnail: '/shoes/shoe-9.avif',
            },
            {
                id: 'white-red',
                name: 'White/Red',
                images: ['/shoes/shoe-11.avif', '/shoes/shoe-12.avif'],
                thumbnail: '/shoes/shoe-11.avif',
            },
            {
                id: 'yellow-green',
                name: 'Yellow/Green',
                images: ['/shoes/shoe-13.avif', '/shoes/shoe-14.avif'],
                thumbnail: '/shoes/shoe-13.avif',
            },
        ],
    },
    '2': {
        id: '2',
        name: 'Nike Air Force 1 Mid 07',
        category: "Men's Shoes",
        price: 88.3,
        compareAtPrice: null,
        discount: null,
        rating: 4.8,
        reviewCount: 156,
        description:
            'The radiance lives on in the Nike Air Force 1 Mid 07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, bold colors and the perfect amount of flash to make you shine.',
        features: [
            'Leather and synthetic upper',
            'Foam midsole',
            'Rubber outsole',
            'Style: CW2289-111',
        ],
        sizes: [
            '7',
            '7.5',
            '8',
            '8.5',
            '9',
            '9.5',
            '10',
            '10.5',
            '11',
            '11.5',
            '12',
        ],
        variants: [
            {
                id: 'white-black',
                name: 'White/Black',
                images: ['/shoes/shoe-5.avif', '/shoes/shoe-6.avif'],
                thumbnail: '/shoes/shoe-5.avif',
            },
        ],
    },
    '3': {
        id: '3',
        name: 'Nike Court Vision Low Next Nature',
        category: "Men's Shoes",
        price: 88.3,
        compareAtPrice: 110,
        discount: 20,
        rating: 4.3,
        reviewCount: 89,
        description:
            'Inspired by basketball shoes of the 80s, the Nike Court Vision Low Next Nature is a classic remixed with at least 20% recycled materials by weight. Throwback hoops style meets sustainability.',
        features: [
            'Leather and synthetic upper',
            'Foam midsole',
            'Rubber outsole',
            'Style: DH2987-001',
        ],
        sizes: [
            '7',
            '7.5',
            '8',
            '8.5',
            '9',
            '9.5',
            '10',
            '10.5',
            '11',
            '11.5',
            '12',
        ],
        variants: [
            {
                id: 'black-blue',
                name: 'Black/Blue',
                images: ['/shoes/shoe-7.avif', '/shoes/shoe-8.avif'],
                thumbnail: '/shoes/shoe-7.avif',
            },
        ],
    },
    '4': {
        id: '4',
        name: 'Nike Dunk Low Retro',
        category: "Men's Shoes",
        price: 98.3,
        compareAtPrice: 110,
        discount: 10,
        rating: 4.7,
        reviewCount: 234,
        description:
            'Created for the hardwood but taken to the streets, the 80s basketball icon returns with perfectly shined overlays and classic team colors. With its iconic hoops design, the Nike Dunk Low Retro channels vintage style back onto the streets.',
        features: [
            'Leather upper',
            'Foam midsole',
            'Rubber outsole with pivot circle',
            'Style: DD1391-300',
        ],
        sizes: [
            '7',
            '7.5',
            '8',
            '8.5',
            '9',
            '9.5',
            '10',
            '10.5',
            '11',
            '11.5',
            '12',
            '13',
        ],
        variants: [
            {
                id: 'yellow-green',
                name: 'Yellow/Green',
                images: [
                    '/shoes/shoe-13.avif',
                    '/shoes/shoe-14.avif',
                    '/shoes/shoe-15.avif',
                ],
                thumbnail: '/shoes/shoe-13.avif',
            },
        ],
    },
};

const RELATED_PRODUCTS = [
    {
        id: '2',
        title: 'Nike Air Force 1 Mid 07',
        description: "Men's Shoes",
        image: '/shoes/shoe-5.avif',
        price: 88.3,
        badge: 'Best Seller',
        category: '3 Colour',
    },
    {
        id: '3',
        title: 'Nike Court Vision Low Next Nature',
        description: "Men's Shoes",
        image: '/shoes/shoe-7.avif',
        price: 88.3,
        badge: 'Extra 20% off',
        category: '5 Colour',
    },
    {
        id: '4',
        title: 'Nike Dunk Low Retro',
        description: "Men's Shoes",
        image: '/shoes/shoe-13.avif',
        price: 98.3,
        badge: 'Extra 10% off',
        category: '8 Colour',
    },
];

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = MOCK_PRODUCTS[id as keyof typeof MOCK_PRODUCTS];

    if (!product) {
        notFound();
    }

    const discountPercentage = product.discount
        ? Math.round(
              ((product.compareAtPrice! - product.price) /
                  product.compareAtPrice!) *
                  100,
          )
        : null;

    return (
        <VariantProvider variants={product.variants}>
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
                                    {product.category}
                                </p>
                            </div>

                            {/* Price Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-heading-2 font-bold text-dark-900">
                                        ${product.price}
                                    </span>
                                    {product.compareAtPrice && (
                                        <span className="text-lead text-dark-500 line-through">
                                            ${product.compareAtPrice}
                                        </span>
                                    )}
                                </div>
                                {discountPercentage && (
                                    <p className="text-body-medium text-green">
                                        Extra {discountPercentage}% off w/ code
                                        SPORT
                                    </p>
                                )}
                            </div>

                            {/* Color Variants */}
                            {product.variants.length > 1 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-body-medium text-dark-900">
                                            Select Color
                                        </h3>
                                        <span className="text-caption text-dark-700">
                                            {product.variants.length} Colours
                                        </span>
                                    </div>
                                    <ColorVariantPickerClient
                                        variants={product.variants}
                                    />
                                </div>
                            )}

                            {/* Size Selector */}
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
                                <SizePicker sizes={product.sizes} />
                            </div>

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
                                        {product.features.map(
                                            (feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <span className="mr-2">
                                                        •
                                                    </span>
                                                    <span>{feature}</span>
                                                </li>
                                            ),
                                        )}
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

                                <CollapsibleSection
                                    title={`Reviews (${product.reviewCount})`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${
                                                            i <
                                                            Math.floor(
                                                                product.rating,
                                                            )
                                                                ? 'fill-dark-900 text-dark-900'
                                                                : 'text-dark-500'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-body-medium text-dark-900">
                                                {product.rating} out of 5
                                            </span>
                                        </div>
                                        <p className="text-body text-dark-700">
                                            Based on {product.reviewCount}{' '}
                                            reviews
                                        </p>
                                    </div>
                                </CollapsibleSection>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You Might Also Like Section */}
                <div className="bg-light-200 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-heading-3 font-bold text-dark-900 mb-6">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {RELATED_PRODUCTS.filter((p) => p.id !== id).map(
                                (relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/products/${relatedProduct.id}`}
                                    >
                                        <Card
                                            title={relatedProduct.title}
                                            description={
                                                relatedProduct.description
                                            }
                                            image={relatedProduct.image}
                                            price={relatedProduct.price}
                                            category={relatedProduct.category}
                                            badge={relatedProduct.badge}
                                        />
                                    </Link>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </VariantProvider>
    );
}
