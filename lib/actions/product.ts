'use server';

import { db } from '@/lib/db';
import {
    products,
    productVariants,
    productImages,
    brands,
    categories,
    genders,
    colors,
    sizes,
} from '@/lib/db/schema';
import {
    eq,
    and,
    gte,
    lte,
    or,
    ilike,
    sql,
    desc,
    asc,
    inArray,
} from 'drizzle-orm';

// Types for product queries
export interface ProductFilters {
    search?: string;
    brandIds?: string[];
    categoryIds?: string[];
    genderIds?: string[];
    colorIds?: string[];
    sizeIds?: string[];
    priceMin?: number;
    priceMax?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'latest' | 'name_asc' | 'name_desc';
    page?: number;
    limit?: number;
}

export interface ProductWithDetails {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    genderId: string;
    brandId: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    minPrice: string;
    maxPrice: string;
    primaryImage: string | null;
    category?: { id: string; name: string; slug: string };
    brand?: { id: string; name: string; slug: string };
    gender?: { id: string; label: string; slug: string };
}

export interface ProductDetailWithVariants {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    genderId: string;
    brandId: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
    };
    brand: { id: string; name: string; slug: string; logoUrl: string | null };
    gender: { id: string; label: string; slug: string };
    variants: Array<{
        id: string;
        sku: string;
        price: string;
        salePrice: string | null;
        colorId: string;
        sizeId: string;
        inStock: string;
        color: { id: string; name: string; slug: string; hexCode: string };
        size: { id: string; name: string; slug: string; sortOrder: number };
    }>;
    images: Array<{
        id: string;
        url: string;
        variantId: string | null;
        sortOrder: string;
        isPrimary: boolean;
    }>;
}

export interface GetAllProductsResult {
    products: ProductWithDetails[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Get all products with filtering, sorting, and pagination
 * Optimized to minimize joins and avoid N+1 queries
 */
export async function getAllProducts(
    filters: ProductFilters = {},
): Promise<GetAllProductsResult> {
    try {
        const {
            search,
            brandIds,
            categoryIds,
            genderIds,
            colorIds,
            sizeIds,
            priceMin,
            priceMax,
            sortBy = 'latest',
            page = 1,
            limit = 12,
        } = filters;

        const offset = (page - 1) * limit;

        // Build WHERE conditions
        const conditions = [eq(products.isPublished, true)];

        // Search filter
        if (search && search.trim()) {
            const searchCondition = or(
                ilike(products.name, `%${search.trim()}%`),
                ilike(products.description, `%${search.trim()}%`),
            );
            if (searchCondition) {
                conditions.push(searchCondition);
            }
        }

        // Brand filter
        if (brandIds && brandIds.length > 0) {
            conditions.push(inArray(products.brandId, brandIds));
        }

        // Category filter
        if (categoryIds && categoryIds.length > 0) {
            conditions.push(inArray(products.categoryId, categoryIds));
        }

        // Gender filter
        if (genderIds && genderIds.length > 0) {
            conditions.push(inArray(products.genderId, genderIds));
        }

        // Build subquery for variant-based filters (color, size, price)
        let variantFilteredProductIds: string[] | null = null;

        if (
            colorIds?.length ||
            sizeIds?.length ||
            priceMin !== undefined ||
            priceMax !== undefined
        ) {
            const variantConditions = [];

            if (colorIds && colorIds.length > 0) {
                variantConditions.push(
                    inArray(productVariants.colorId, colorIds),
                );
            }

            if (sizeIds && sizeIds.length > 0) {
                variantConditions.push(
                    inArray(productVariants.sizeId, sizeIds),
                );
            }

            if (priceMin !== undefined) {
                variantConditions.push(
                    gte(
                        sql`CAST(${productVariants.price} AS DECIMAL)`,
                        priceMin,
                    ),
                );
            }

            if (priceMax !== undefined) {
                variantConditions.push(
                    lte(
                        sql`CAST(${productVariants.price} AS DECIMAL)`,
                        priceMax,
                    ),
                );
            }

            // Get product IDs that match variant filters
            const variantResults = await db
                .selectDistinct({ productId: productVariants.productId })
                .from(productVariants)
                .where(and(...variantConditions));

            variantFilteredProductIds = variantResults.map((v) => v.productId);

            // If no products match variant filters, return empty result
            if (variantFilteredProductIds.length === 0) {
                return {
                    products: [],
                    totalCount: 0,
                    page,
                    limit,
                    totalPages: 0,
                };
            }

            conditions.push(inArray(products.id, variantFilteredProductIds));
        }

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(products)
            .where(and(...conditions));

        const totalCount = countResult[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        // Build ORDER BY clause
        let orderByClause;
        switch (sortBy) {
            case 'price_asc':
                orderByClause = sql`(
                    SELECT MIN(CAST(price AS DECIMAL))
                    FROM ${productVariants}
                    WHERE ${productVariants.productId} = ${products.id}
                ) ASC NULLS LAST`;
                break;
            case 'price_desc':
                orderByClause = sql`(
                    SELECT MIN(CAST(price AS DECIMAL))
                    FROM ${productVariants}
                    WHERE ${productVariants.productId} = ${products.id}
                ) DESC NULLS LAST`;
                break;
            case 'name_asc':
                orderByClause = asc(products.name);
                break;
            case 'name_desc':
                orderByClause = desc(products.name);
                break;
            case 'latest':
            default:
                orderByClause = desc(products.createdAt);
                break;
        }

        // Main query with aggregated price and primary image
        // Using a single query with subqueries for optimal performance
        const productsData = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                categoryId: products.categoryId,
                genderId: products.genderId,
                brandId: products.brandId,
                isPublished: products.isPublished,
                createdAt: products.createdAt,
                updatedAt: products.updatedAt,
                minPrice: sql<string>`(
                    SELECT MIN(CAST(price AS DECIMAL))::TEXT
                    FROM ${productVariants}
                    WHERE ${productVariants.productId} = ${products.id}
                )`,
                maxPrice: sql<string>`(
                    SELECT MAX(CAST(price AS DECIMAL))::TEXT
                    FROM ${productVariants}
                    WHERE ${productVariants.productId} = ${products.id}
                )`,
                primaryImage: sql<string | null>`(
                    SELECT url
                    FROM ${productImages}
                    WHERE ${productImages.productId} = ${products.id}
                    ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC
                    LIMIT 1
                )`,
                categoryName: categories.name,
                categorySlug: categories.slug,
                brandName: brands.name,
                brandSlug: brands.slug,
                genderLabel: genders.label,
                genderSlug: genders.slug,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(brands, eq(products.brandId, brands.id))
            .leftJoin(genders, eq(products.genderId, genders.id))
            .where(and(...conditions))
            .orderBy(orderByClause)
            .limit(limit)
            .offset(offset);

        // Transform results
        const transformedProducts: ProductWithDetails[] = productsData.map(
            (p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                categoryId: p.categoryId,
                genderId: p.genderId,
                brandId: p.brandId,
                isPublished: p.isPublished,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                minPrice: p.minPrice || '0',
                maxPrice: p.maxPrice || '0',
                primaryImage: p.primaryImage,
                category: p.categoryName
                    ? {
                          id: p.categoryId,
                          name: p.categoryName,
                          slug: p.categorySlug!,
                      }
                    : undefined,
                brand: p.brandName
                    ? { id: p.brandId, name: p.brandName, slug: p.brandSlug! }
                    : undefined,
                gender: p.genderLabel
                    ? {
                          id: p.genderId,
                          label: p.genderLabel,
                          slug: p.genderSlug!,
                      }
                    : undefined,
            }),
        );

        return {
            products: transformedProducts,
            totalCount,
            page,
            limit,
            totalPages,
        };
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        throw new Error('Failed to fetch products');
    }
}

/**
 * Get a single product with all details including variants and images
 * Uses relations for optimal query performance
 */
export async function getProduct(
    productId: string,
): Promise<ProductDetailWithVariants | null> {
    try {
        // Fetch product with all relations in a single query
        const result = await db.query.products.findFirst({
            where: eq(products.id, productId),
            with: {
                category: true,
                brand: true,
                gender: true,
                variants: {
                    orderBy: [
                        asc(productVariants.colorId),
                        asc(productVariants.sizeId),
                    ],
                },
                images: {
                    orderBy: [
                        desc(productImages.isPrimary),
                        asc(productImages.sortOrder),
                    ],
                },
            },
        });

        if (!result) {
            return null;
        }

        // Fetch color and size details for variants
        const colorIds = [...new Set(result.variants.map((v) => v.colorId))];
        const sizeIds = [...new Set(result.variants.map((v) => v.sizeId))];

        // Fetch colors and sizes in parallel
        const [colorsData, sizesData] = await Promise.all([
            colorIds.length > 0
                ? db.select().from(colors).where(inArray(colors.id, colorIds))
                : Promise.resolve([]),
            sizeIds.length > 0
                ? db.select().from(sizes).where(inArray(sizes.id, sizeIds))
                : Promise.resolve([]),
        ]);

        // Create lookup maps
        const colorMap = new Map(colorsData.map((c) => [c.id, c]));
        const sizeMap = new Map(sizesData.map((s) => [s.id, s]));

        // Transform variants with color and size details
        const variantsWithDetails = result.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            colorId: variant.colorId,
            sizeId: variant.sizeId,
            inStock: variant.inStock,
            color: colorMap.get(variant.colorId)!,
            size: sizeMap.get(variant.sizeId)!,
        }));

        return {
            id: result.id,
            name: result.name,
            description: result.description,
            categoryId: result.categoryId,
            genderId: result.genderId,
            brandId: result.brandId,
            isPublished: result.isPublished,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            category: result.category,
            brand: result.brand,
            gender: result.gender,
            variants: variantsWithDetails,
            images: result.images,
        };
    } catch (error) {
        console.error('Error in getProduct:', error);
        throw new Error('Failed to fetch product details');
    }
}
