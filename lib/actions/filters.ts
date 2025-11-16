'use server';

import { db } from '@/lib/db';
import { genders, colors, sizes, brands, categories } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import type { FilterParams } from '@/lib/utils/query';
import type { ProductFilters } from './product';

/**
 * Resolve filter slugs to UUIDs by querying the database
 * This allows the UI to use friendly slugs while the database uses UUIDs
 */
export async function resolveFilterSlugs(
    filters: FilterParams,
): Promise<ProductFilters> {
    const resolved: ProductFilters = {};

    // Search (no need to resolve)
    if (filters.search) {
        resolved.search = filters.search;
    }

    // Resolve gender slugs to IDs
    if (filters.gender) {
        const genderSlugs = Array.isArray(filters.gender)
            ? filters.gender
            : [filters.gender];

        const genderResults = await db
            .select({ id: genders.id })
            .from(genders)
            .where(inArray(genders.slug, genderSlugs));

        if (genderResults.length > 0) {
            resolved.genderIds = genderResults.map((g) => g.id);
        }
    }

    // Resolve color slugs to IDs
    if (filters.color) {
        const colorSlugs = Array.isArray(filters.color)
            ? filters.color
            : [filters.color];

        const colorResults = await db
            .select({ id: colors.id })
            .from(colors)
            .where(inArray(colors.slug, colorSlugs));

        if (colorResults.length > 0) {
            resolved.colorIds = colorResults.map((c) => c.id);
        }
    }

    // Resolve size values to IDs
    // Sizes use numeric values (6, 7, 8) instead of slugs
    if (filters.size) {
        const sizeValues = Array.isArray(filters.size)
            ? filters.size
            : [filters.size];

        const sizeResults = await db
            .select({ id: sizes.id })
            .from(sizes)
            .where(inArray(sizes.name, sizeValues));

        if (sizeResults.length > 0) {
            resolved.sizeIds = sizeResults.map((s) => s.id);
        }
    }

    // Resolve brand slugs to IDs
    if (filters.brand) {
        const brandSlugs = Array.isArray(filters.brand)
            ? filters.brand
            : [filters.brand];

        const brandResults = await db
            .select({ id: brands.id })
            .from(brands)
            .where(inArray(brands.slug, brandSlugs));

        if (brandResults.length > 0) {
            resolved.brandIds = brandResults.map((b) => b.id);
        }
    }

    // Resolve category slugs to IDs
    if (filters.category) {
        const categorySlugs = Array.isArray(filters.category)
            ? filters.category
            : [filters.category];

        const categoryResults = await db
            .select({ id: categories.id })
            .from(categories)
            .where(inArray(categories.slug, categorySlugs));

        if (categoryResults.length > 0) {
            resolved.categoryIds = categoryResults.map((c) => c.id);
        }
    }

    // Price range (no need to resolve)
    if (filters.minPrice) {
        const min = parseFloat(filters.minPrice);
        if (!isNaN(min)) {
            resolved.priceMin = min;
        }
    }

    if (filters.maxPrice) {
        const max = parseFloat(filters.maxPrice);
        if (!isNaN(max)) {
            resolved.priceMax = max;
        }
    }

    // Sorting
    if (filters.sort) {
        const validSorts = [
            'price_asc',
            'price_desc',
            'latest',
            'name_asc',
            'name_desc',
        ];
        if (validSorts.includes(filters.sort)) {
            resolved.sortBy = filters.sort as ProductFilters['sortBy'];
        }
    }

    // Pagination
    if (filters.page) {
        const pageNum = parseInt(filters.page, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
            resolved.page = pageNum;
        }
    }

    // Set defaults
    resolved.page = resolved.page || 1;
    resolved.limit = 12;
    resolved.sortBy = resolved.sortBy || 'latest';

    return resolved;
}

/**
 * Get all available filter options from the database
 * This ensures the UI always shows current options
 */
export async function getFilterOptions() {
    const [gendersData, colorsData, sizesData, brandsData, categoriesData] =
        await Promise.all([
            db.select().from(genders),
            db.select().from(colors),
            db.select().from(sizes).orderBy(sizes.sortOrder),
            db.select().from(brands),
            db.select().from(categories),
        ]);

    return {
        genders: gendersData.map((g) => ({
            label: g.label,
            value: g.slug,
            id: g.id,
        })),
        colors: colorsData.map((c) => ({
            label: c.name,
            value: c.slug,
            hex: c.hexCode,
            id: c.id,
        })),
        sizes: sizesData.map((s) => ({
            label: s.name,
            value: s.slug,
            id: s.id,
        })),
        brands: brandsData.map((b) => ({
            label: b.name,
            value: b.slug,
            id: b.id,
        })),
        categories: categoriesData.map((c) => ({
            label: c.name,
            value: c.slug,
            id: c.id,
        })),
    };
}
