'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Card } from '@/components';
import type { FilterParams } from '@/lib/utils/query';

interface Product {
    id: string;
    name: string;
    description: string;
    primaryImage: string | null;
    minPrice: string;
    category?: {
        name: string;
    } | null;
}

interface ProductsPageClientProps {
    products: Product[];
    totalCount: number;
    page: number;
    totalPages: number;
    activeFilterCount: number;
    filters: FilterParams;
    searchParamsString: string;
}

export function ProductsPageClient({
    products,
    totalCount,
    page,
    totalPages,
    activeFilterCount,
    filters,
    searchParamsString,
}: ProductsPageClientProps) {
    const { t } = useI18n();

    // Generate filter badges
    const badges: { label: string; key: string; value: string }[] = [];

    if (filters.search) {
        badges.push({
            label: `${t.products.search}: ${filters.search}`,
            key: 'search',
            value: filters.search,
        });
    }

    if (filters.gender) {
        const genders = Array.isArray(filters.gender)
            ? filters.gender
            : [filters.gender];
        genders.forEach((g) => {
            badges.push({
                label: `${t.products.gender}: ${g}`,
                key: 'gender',
                value: g,
            });
        });
    }

    if (filters.brand) {
        const brands = Array.isArray(filters.brand)
            ? filters.brand
            : [filters.brand];
        brands.forEach((b) => {
            badges.push({
                label: `${t.products.brand}: ${b}`,
                key: 'brand',
                value: b,
            });
        });
    }

    if (filters.category) {
        const categories = Array.isArray(filters.category)
            ? filters.category
            : [filters.category];
        categories.forEach((c) => {
            badges.push({
                label: `${t.products.category}: ${c}`,
                key: 'category',
                value: c,
            });
        });
    }

    if (filters.size) {
        const sizes = Array.isArray(filters.size)
            ? filters.size
            : [filters.size];
        sizes.forEach((s) => {
            badges.push({
                label: `${t.products.size}: ${s}`,
                key: 'size',
                value: s,
            });
        });
    }

    if (filters.color) {
        const colors = Array.isArray(filters.color)
            ? filters.color
            : [filters.color];
        colors.forEach((c) => {
            badges.push({
                label: `${t.products.color}: ${c}`,
                key: 'color',
                value: c,
            });
        });
    }

    if (filters.minPrice || filters.maxPrice) {
        const priceLabel =
            filters.minPrice && filters.maxPrice
                ? `$${filters.minPrice} - $${filters.maxPrice}`
                : filters.minPrice
                  ? `${t.products.from} $${filters.minPrice}`
                  : `${t.products.upTo} $${filters.maxPrice}`;
        badges.push({
            label: priceLabel,
            key: 'price',
            value: `${filters.minPrice || ''}-${filters.maxPrice || ''}`,
        });
    }

    return (
        <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-heading-2 font-bold text-dark-900 mb-2">
                        {t.products.title} ({totalCount})
                    </h1>
                    {activeFilterCount > 0 && (
                        <p className="text-body text-dark-700">
                            {activeFilterCount}{' '}
                            {activeFilterCount === 1
                                ? t.products.filterApplied
                                : t.products.filtersApplied}
                        </p>
                    )}
                </div>
            </div>

            {/* Active Filter Badges */}
            {badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {badges.map((badge, index) => (
                        <Link
                            key={`${badge.key}-${badge.value}-${index}`}
                            href={`/products`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-900 text-light-100 rounded-full text-caption hover:bg-dark-700 transition-colors"
                        >
                            <span>{badge.label}</span>
                            <X className="w-3.5 h-3.5" />
                        </Link>
                    ))}
                </div>
            )}

            {/* Product Grid */}
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                            >
                                <Card
                                    title={product.name}
                                    description={product.description}
                                    image={
                                        product.primaryImage ||
                                        '/placeholder-product.jpg'
                                    }
                                    price={parseFloat(product.minPrice)}
                                    category={product.category?.name}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            {page > 1 && (
                                <Link
                                    href={`/products?${new URLSearchParams({
                                        ...Object.fromEntries(
                                            new URLSearchParams(
                                                searchParamsString,
                                            ),
                                        ),
                                        page: (page - 1).toString(),
                                    }).toString()}`}
                                    className="px-4 py-2 bg-dark-900 text-light-100 rounded-lg hover:bg-dark-700 transition-colors"
                                >
                                    {t.products.previous}
                                </Link>
                            )}
                            <span className="px-4 py-2 text-dark-900">
                                {t.products.pageOf
                                    .replace('{page}', page.toString())
                                    .replace('{total}', totalPages.toString())}
                            </span>
                            {page < totalPages && (
                                <Link
                                    href={`/products?${new URLSearchParams({
                                        ...Object.fromEntries(
                                            new URLSearchParams(
                                                searchParamsString,
                                            ),
                                        ),
                                        page: (page + 1).toString(),
                                    }).toString()}`}
                                    className="px-4 py-2 bg-dark-900 text-light-100 rounded-lg hover:bg-dark-700 transition-colors"
                                >
                                    {t.products.next}
                                </Link>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-heading-3 text-dark-900 mb-2">
                        {t.products.noProductsFound}
                    </h3>
                    <p className="text-body text-dark-700 mb-6">
                        {t.products.adjustFilters}
                    </p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-3 bg-dark-900 text-light-100 rounded-full hover:bg-dark-700 transition-colors text-body-medium"
                    >
                        {t.products.clearAllFilters}
                    </Link>
                </div>
            )}
        </div>
    );
}
