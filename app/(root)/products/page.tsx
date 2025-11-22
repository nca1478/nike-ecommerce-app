import { Suspense } from 'react';
import { parseFilters, getActiveFilterCount } from '@/lib/utils/query';
import { getAllProducts } from '@/lib/actions/product';
import { resolveFilterSlugs } from '@/lib/actions/filters';
import { Filters, Sort } from '@/components';
import { ProductsPageClient } from '@/components/Product/ProductsPageClient';

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

                    {/* Main Content with Sort */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-end mb-6">
                            <Suspense fallback={<div className="w-48 h-10" />}>
                                <Sort />
                            </Suspense>
                        </div>
                        <ProductsPageClient
                            products={productsData}
                            totalCount={totalCount}
                            page={page}
                            totalPages={totalPages}
                            activeFilterCount={activeFilterCount}
                            filters={filters}
                            searchParamsString={searchParamsString}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
