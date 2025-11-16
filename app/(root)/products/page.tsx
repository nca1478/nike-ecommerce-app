import { Suspense } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { parseFilters, getActiveFilterCount } from '@/lib/utils/query';
import { getAllProducts } from '@/lib/actions/product';
import { resolveFilterSlugs } from '@/lib/actions/filters';
import { Filters } from '@/components/Filters';
import { Sort } from '@/components/Sort';
import { Card } from '@/components/Card';

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Active filter badges component
function ActiveFilterBadges({
    filters,
}: {
    filters: ReturnType<typeof parseFilters>;
}) {
    const badges: { label: string; key: string; value: string }[] = [];

    // Search badge
    if (filters.search) {
        badges.push({
            label: `Search: ${filters.search}`,
            key: 'search',
            value: filters.search,
        });
    }

    // Gender badges
    if (filters.gender) {
        const genders = Array.isArray(filters.gender)
            ? filters.gender
            : [filters.gender];
        genders.forEach((g) => {
            badges.push({ label: `Gender: ${g}`, key: 'gender', value: g });
        });
    }

    // Brand badges
    if (filters.brand) {
        const brands = Array.isArray(filters.brand)
            ? filters.brand
            : [filters.brand];
        brands.forEach((b) => {
            badges.push({ label: `Brand: ${b}`, key: 'brand', value: b });
        });
    }

    // Category badges
    if (filters.category) {
        const categories = Array.isArray(filters.category)
            ? filters.category
            : [filters.category];
        categories.forEach((c) => {
            badges.push({ label: `Category: ${c}`, key: 'category', value: c });
        });
    }

    // Size badges
    if (filters.size) {
        const sizes = Array.isArray(filters.size)
            ? filters.size
            : [filters.size];
        sizes.forEach((s) => {
            badges.push({ label: `Size: ${s}`, key: 'size', value: s });
        });
    }

    // Color badges
    if (filters.color) {
        const colors = Array.isArray(filters.color)
            ? filters.color
            : [filters.color];
        colors.forEach((c) => {
            badges.push({ label: `Color: ${c}`, key: 'color', value: c });
        });
    }

    // Price range badge
    if (filters.minPrice || filters.maxPrice) {
        const priceLabel =
            filters.minPrice && filters.maxPrice
                ? `$${filters.minPrice} - $${filters.maxPrice}`
                : filters.minPrice
                  ? `From $${filters.minPrice}`
                  : `Up to $${filters.maxPrice}`;
        badges.push({
            label: priceLabel,
            key: 'price',
            value: `${filters.minPrice || ''}-${filters.maxPrice || ''}`,
        });
    }

    if (badges.length === 0) return null;

    return (
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
    );
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    // Await searchParams before using
    const params = await searchParams;
    const searchParamsString = new URLSearchParams(
        params as Record<string, string>,
    ).toString();

    // Parse filters from URL
    const filters = parseFilters(searchParamsString);

    // Resolve filter slugs to UUIDs
    const queryObject = await resolveFilterSlugs(filters);

    // Fetch products from database
    const {
        products: productsData,
        totalCount,
        page,
        totalPages,
    } = await getAllProducts(queryObject);

    const activeFilterCount = getActiveFilterCount(filters);

    return (
        <div className="min-h-screen bg-light-100">
            <div className="max-w-[1440px] mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <Suspense fallback={<div className="w-64 shrink-0" />}>
                        <Filters />
                    </Suspense>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-heading-2 font-bold text-dark-900 mb-2">
                                    Products ({totalCount})
                                </h1>
                                {activeFilterCount > 0 && (
                                    <p className="text-body text-dark-700">
                                        {activeFilterCount} filter
                                        {activeFilterCount !== 1
                                            ? 's'
                                            : ''}{' '}
                                        applied
                                    </p>
                                )}
                            </div>
                            <Suspense fallback={<div className="w-48 h-10" />}>
                                <Sort />
                            </Suspense>
                        </div>

                        {/* Active Filter Badges */}
                        <ActiveFilterBadges filters={filters} />

                        {/* Product Grid */}
                        {productsData.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {productsData.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                        >
                                            <Card
                                                title={product.name}
                                                description={
                                                    product.description
                                                }
                                                image={
                                                    product.primaryImage ||
                                                    '/placeholder-product.jpg'
                                                }
                                                price={parseFloat(
                                                    product.minPrice,
                                                )}
                                                category={
                                                    product.category?.name
                                                }
                                            />
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        {page > 1 && (
                                            <Link
                                                href={`/products?${new URLSearchParams(
                                                    {
                                                        ...(params as Record<
                                                            string,
                                                            string
                                                        >),
                                                        page: (
                                                            page - 1
                                                        ).toString(),
                                                    },
                                                ).toString()}`}
                                                className="px-4 py-2 bg-dark-900 text-light-100 rounded-lg hover:bg-dark-700 transition-colors"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        <span className="px-4 py-2 text-dark-900">
                                            Page {page} of {totalPages}
                                        </span>
                                        {page < totalPages && (
                                            <Link
                                                href={`/products?${new URLSearchParams(
                                                    {
                                                        ...(params as Record<
                                                            string,
                                                            string
                                                        >),
                                                        page: (
                                                            page + 1
                                                        ).toString(),
                                                    },
                                                ).toString()}`}
                                                className="px-4 py-2 bg-dark-900 text-light-100 rounded-lg hover:bg-dark-700 transition-colors"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <h3 className="text-heading-3 text-dark-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-body text-dark-700 mb-6">
                                    Try adjusting your filters to see more
                                    results
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-block px-6 py-3 bg-dark-900 text-light-100 rounded-full hover:bg-dark-700 transition-colors text-body-medium"
                                >
                                    Clear All Filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
