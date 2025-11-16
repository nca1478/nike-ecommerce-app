import queryString from 'query-string';

export interface FilterParams {
    gender?: string | string[];
    size?: string | string[];
    color?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
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
        gender: parsed.gender as string | string[] | undefined,
        size: parsed.size as string | string[] | undefined,
        color: parsed.color as string | string[] | undefined,
        minPrice: parsed.minPrice as string | undefined,
        maxPrice: parsed.maxPrice as string | undefined,
        sort: parsed.sort as string | undefined,
        page: parsed.page as string | undefined,
    };
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
        key === 'maxPrice'
    ) {
        return { ...currentFilters, [key]: value };
    }

    // Handle array filters (gender, size, color)
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
    if (filters.minPrice || filters.maxPrice) {
        count += 1;
    }

    return count;
}
