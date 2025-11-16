import { Suspense } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { parseFilters, getActiveFilterCount } from '@/lib/utils/query';
import { mockProducts, filterOptions } from '@/lib/data/mock-products';
import { Filters } from '@/components/Filters';
import { Sort } from '@/components/Sort';
import { ProductGrid } from '@/components/ProductGrid';

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Filter products based on search params
function filterProducts(filters: ReturnType<typeof parseFilters>) {
    let filtered = [...mockProducts];

    // Filter by gender
    if (filters.gender) {
        const genders = Array.isArray(filters.gender)
            ? filters.gender
            : [filters.gender];
        filtered = filtered.filter((p) => genders.includes(p.gender));
    }

    // Filter by size
    if (filters.size) {
        const sizes = Array.isArray(filters.size)
            ? filters.size
            : [filters.size];
        filtered = filtered.filter((p) =>
            p.sizes.some((size) => sizes.includes(size)),
        );
    }

    // Filter by color
    if (filters.color) {
        const colors = Array.isArray(filters.color)
            ? filters.color
            : [filters.color];
        filtered = filtered.filter((p) =>
            p.colors.some((color) => colors.includes(color)),
        );
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
        const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        filtered = filtered.filter((p) => {
            const price = p.salePrice || p.price;
            return price >= min && price <= max;
        });
    }

    return filtered;
}

// Sort products based on sort parameter
function sortProducts(
    products: typeof mockProducts,
    sortBy: string | undefined,
) {
    const sorted = [...products];

    switch (sortBy) {
        case 'newest':
            return sorted.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            );
        case 'price_asc':
            return sorted.sort((a, b) => {
                const priceA = a.salePrice || a.price;
                const priceB = b.salePrice || b.price;
                return priceA - priceB;
            });
        case 'price_desc':
            return sorted.sort((a, b) => {
                const priceA = a.salePrice || a.price;
                const priceB = b.salePrice || b.price;
                return priceB - priceA;
            });
        case 'featured':
        default:
            // Featured: prioritize products with badges
            return sorted.sort((a, b) => {
                if (a.badge && !b.badge) return -1;
                if (!a.badge && b.badge) return 1;
                return 0;
            });
    }
}

// Active filter badges component
function ActiveFilterBadges({
    filters,
}: {
    filters: ReturnType<typeof parseFilters>;
}) {
    const badges: { label: string; key: string; value: string }[] = [];

    // Gender badges
    if (filters.gender) {
        const genders = Array.isArray(filters.gender)
            ? filters.gender
            : [filters.gender];
        genders.forEach((g) => {
            const option = filterOptions.genders.find((opt) => opt.value === g);
            if (option) {
                badges.push({ label: option.label, key: 'gender', value: g });
            }
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
            const option = filterOptions.colors.find((opt) => opt.value === c);
            if (option) {
                badges.push({ label: option.label, key: 'color', value: c });
            }
        });
    }

    // Price range badge
    if (filters.minPrice || filters.maxPrice) {
        const range = filterOptions.priceRanges.find(
            (r) =>
                r.min.toString() === filters.minPrice &&
                r.max.toString() === filters.maxPrice,
        );
        if (range) {
            badges.push({
                label: range.label,
                key: 'price',
                value: `${filters.minPrice}-${filters.maxPrice}`,
            });
        }
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
    const params = await searchParams;
    const searchParamsString = new URLSearchParams(
        params as Record<string, string>,
    ).toString();
    const filters = parseFilters(searchParamsString);

    // Apply filters and sorting
    const filteredProducts = filterProducts(filters);
    const sortedProducts = sortProducts(filteredProducts, filters.sort);
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
                                    New ({sortedProducts.length})
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
                        {sortedProducts.length > 0 ? (
                            <ProductGrid products={sortedProducts} />
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
