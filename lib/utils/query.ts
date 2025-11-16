import queryString from 'query-string';
import type { ProductFilters } from '@/lib/actions/product';

export interface FilterParams {
    gender?: string | string[];
    size?: string | string[];
    color?: string | string[];
    brand?: string | string[];
    category?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    search?: string;
}

/**
 * Parse URL search params into a structured filter object
 */
export function parseFilters(
    searchParams: URLSearchParams | string,
): FilterParams {
    const parsed = queryString.parse(searchParams.toString(), {
        arrayFormat: 'comma',
    });

    return {
        search: parsed.search as string | undefined,
        gender: parsed.gender as string | string[] | undefined,
        size: parsed.size as string | string[] | undefined,
        color: parsed.color as string | string[] | undefined,
        brand: parsed.brand as string | string[] | undefined,
        category: parsed.category as string | string[] | undefined,
        minPrice: parsed.minPrice as string | undefined,
        maxPrice: parsed.maxPrice as string | undefined,
        sort: parsed.sort as string | undefined,
        page: parsed.page as string | undefined,
    };
}

/**
 * Helper function to check if a string is a valid UUID
 */
function isValidUUID(str: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

/**
 * Helper function to filter only valid UUIDs from an array
 */
function filterValidUUIDs(values: string | string[]): string[] {
    const arr = Array.isArray(values) ? values : [values];
    return arr.filter(isValidUUID);
}

/**
 * Convert FilterParams to ProductFilters for the database query
 * Note: This function only accepts valid UUIDs for ID-based filters.
 * Slugs will be ignored to prevent database errors.
 */
export function buildProductQueryObject(filters: FilterParams): ProductFilters {
    const queryObject: ProductFilters = {};

    // Search
    if (filters.search) {
        queryObject.search = filters.search;
    }

    // Brand IDs - only include valid UUIDs
    if (filters.brand) {
        const validBrands = filterValidUUIDs(filters.brand);
        if (validBrands.length > 0) {
            queryObject.brandIds = validBrands;
        }
    }

    // Category IDs - only include valid UUIDs
    if (filters.category) {
        const validCategories = filterValidUUIDs(filters.category);
        if (validCategories.length > 0) {
            queryObject.categoryIds = validCategories;
        }
    }

    // Gender IDs - only include valid UUIDs
    if (filters.gender) {
        const validGenders = filterValidUUIDs(filters.gender);
        if (validGenders.length > 0) {
            queryObject.genderIds = validGenders;
        }
    }

    // Color IDs - only include valid UUIDs
    if (filters.color) {
        const validColors = filterValidUUIDs(filters.color);
        if (validColors.length > 0) {
            queryObject.colorIds = validColors;
        }
    }

    // Size IDs - only include valid UUIDs
    if (filters.size) {
        const validSizes = filterValidUUIDs(filters.size);
        if (validSizes.length > 0) {
            queryObject.sizeIds = validSizes;
        }
    }

    // Price range
    if (filters.minPrice) {
        const min = parseFloat(filters.minPrice);
        if (!isNaN(min)) {
            queryObject.priceMin = min;
        }
    }

    if (filters.maxPrice) {
        const max = parseFloat(filters.maxPrice);
        if (!isNaN(max)) {
            queryObject.priceMax = max;
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
            queryObject.sortBy = filters.sort as ProductFilters['sortBy'];
        }
    }

    // Pagination
    if (filters.page) {
        const pageNum = parseInt(filters.page, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
            queryObject.page = pageNum;
        }
    }

    // Set defaults
    queryObject.page = queryObject.page || 1;
    queryObject.limit = 12;
    queryObject.sortBy = queryObject.sortBy || 'latest';

    return queryObject;
}

/**
 * Convert filter object to URL query string
 */
export function stringifyFilters(filters: FilterParams): string {
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== undefined && value !== null && value !== '';
        }),
    );

    return queryString.stringify(cleanFilters, {
        arrayFormat: 'comma',
        skipNull: true,
        skipEmptyString: true,
    });
}

/**
 * Add or update a filter parameter
 */
export function addFilter(
    currentFilters: FilterParams,
    key: keyof FilterParams,
    value: string,
): FilterParams {
    const current = currentFilters[key];

    if (
        key === 'sort' ||
        key === 'page' ||
        key === 'minPrice' ||
        key === 'maxPrice' ||
        key === 'search'
    ) {
        return { ...currentFilters, [key]: value };
    }

    // Handle array filters (gender, size, color, brand, category)
    if (Array.isArray(current)) {
        if (current.includes(value)) {
            return currentFilters; // Already exists
        }
        return { ...currentFilters, [key]: [...current, value] };
    } else if (current) {
        return { ...currentFilters, [key]: [current, value] };
    } else {
        return { ...currentFilters, [key]: value };
    }
}

/**
 * Remove a filter parameter value
 */
export function removeFilter(
    currentFilters: FilterParams,
    key: keyof FilterParams,
    value?: string,
): FilterParams {
    if (!value) {
        // Remove entire key
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = currentFilters;
        return rest;
    }

    const current = currentFilters[key];

    if (Array.isArray(current)) {
        const filtered = current.filter((v) => v !== value);
        if (filtered.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [key]: _, ...rest } = currentFilters;
            return rest;
        }
        return { ...currentFilters, [key]: filtered };
    } else if (current === value) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = currentFilters;
        return rest;
    }

    return currentFilters;
}

/**
 * Toggle a filter value (add if not present, remove if present)
 */
export function toggleFilter(
    currentFilters: FilterParams,
    key: keyof FilterParams,
    value: string,
): FilterParams {
    const current = currentFilters[key];

    if (Array.isArray(current)) {
        if (current.includes(value)) {
            return removeFilter(currentFilters, key, value);
        }
        return addFilter(currentFilters, key, value);
    } else if (current === value) {
        return removeFilter(currentFilters, key, value);
    } else {
        return addFilter(currentFilters, key, value);
    }
}

/**
 * Clear all filters
 */
export function clearAllFilters(): FilterParams {
    return {};
}

/**
 * Check if a filter value is active
 */
export function isFilterActive(
    filters: FilterParams,
    key: keyof FilterParams,
    value: string,
): boolean {
    const current = filters[key];
    if (Array.isArray(current)) {
        return current.includes(value);
    }
    return current === value;
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: FilterParams): number {
    let count = 0;

    if (filters.gender) {
        count += Array.isArray(filters.gender) ? filters.gender.length : 1;
    }
    if (filters.size) {
        count += Array.isArray(filters.size) ? filters.size.length : 1;
    }
    if (filters.color) {
        count += Array.isArray(filters.color) ? filters.color.length : 1;
    }
    if (filters.brand) {
        count += Array.isArray(filters.brand) ? filters.brand.length : 1;
    }
    if (filters.category) {
        count += Array.isArray(filters.category) ? filters.category.length : 1;
    }
    if (filters.minPrice || filters.maxPrice) {
        count += 1;
    }
    if (filters.search) {
        count += 1;
    }

    return count;
}
