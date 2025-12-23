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
    reviews,
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
    primaryColorId?: string | null; // Add color ID for the primary image
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
                primaryImage:
                    colorIds && colorIds.length === 1
                        ? sql<string | null>`(
                        SELECT COALESCE(
                            (
                                -- First try to get image for the specific color variant
                                SELECT pi.url
                                FROM ${productImages} pi
                                LEFT JOIN ${productVariants} pv ON pi.variant_id = pv.id
                                WHERE pi.product_id = ${products.id}
                                AND pv.color_id = ${colorIds[0]}
                                ORDER BY pi.is_primary DESC, pi.sort_order ASC
                                LIMIT 1
                            ),
                            (
                                -- Fallback to generic product images (no variant_id)
                                SELECT pi.url
                                FROM ${productImages} pi
                                WHERE pi.product_id = ${products.id}
                                AND pi.variant_id IS NULL
                                ORDER BY pi.is_primary DESC, pi.sort_order ASC
                                LIMIT 1
                            ),
                            (
                                -- Final fallback to any image
                                SELECT pi.url
                                FROM ${productImages} pi
                                WHERE pi.product_id = ${products.id}
                                ORDER BY pi.is_primary DESC, pi.sort_order ASC
                                LIMIT 1
                            )
                        )
                    )`
                        : sql<string | null>`(
                        SELECT url
                        FROM ${productImages}
                        WHERE ${productImages.productId} = ${products.id}
                        ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC
                        LIMIT 1
                    )`,
                primaryColorId:
                    colorIds && colorIds.length === 1
                        ? sql<string | null>`${colorIds[0]}`
                        : sql<string | null>`(
                        SELECT pv.color_id
                        FROM ${productImages} pi
                        LEFT JOIN ${productVariants} pv ON pi.variant_id = pv.id
                        WHERE pi.product_id = ${products.id}
                        AND pi.is_primary = true
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
                primaryColorId: p.primaryColorId,
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
            where: and(
                eq(products.id, productId),
                eq(products.isPublished, true),
            ),
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

export interface ProductReview {
    id: string;
    author: string;
    rating: number;
    title?: string;
    content: string;
    createdAt: string;
}

/**
 * Get reviews for a specific product
 * Returns approved reviews sorted by most recent first
 */
export async function getProductReviews(
    productId: string,
): Promise<ProductReview[]> {
    try {
        // Since the reviews table doesn't have an 'approved' field,
        // we'll return all reviews for now
        const reviewsData = await db
            .select({
                id: sql<string>`${reviews.id}::text`,
                userId: sql<string>`${reviews.userId}::text`,
                rating: reviews.rating,
                comment: reviews.comment,
                createdAt: reviews.createdAt,
            })
            .from(reviews)
            .where(eq(reviews.productId, productId))
            .orderBy(desc(reviews.createdAt))
            .limit(10);

        // Transform to match the expected format
        return reviewsData.map((review) => ({
            id: review.id,
            author: `User ${review.userId.slice(0, 8)}`, // Anonymize user ID
            rating: parseInt(review.rating),
            content: review.comment,
            createdAt: review.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error('Error in getProductReviews:', error);
        // Return empty array on error to prevent page crash
        return [];
    }
}

export interface RecommendedProduct {
    id: string;
    name: string;
    price: string;
    salePrice: string | null;
    primaryImage: string | null;
    primaryColorId: string | null;
    category: string;
    brand: string;
}

/**
 * Get recommended products based on the current product
 * Returns products from the same category/brand/gender with varied color variants
 */
export async function getRecommendedProducts(
    productId: string,
): Promise<RecommendedProduct[]> {
    try {
        // First, get the current product to know its category, brand, and gender
        const currentProduct = await db.query.products.findFirst({
            where: eq(products.id, productId),
            columns: {
                categoryId: true,
                brandId: true,
                genderId: true,
            },
        });

        if (!currentProduct) {
            return [];
        }

        // Get recommended products from same category, brand, or gender
        const recommendedData = await db
            .select({
                id: products.id,
                name: products.name,
                categoryId: products.categoryId,
                brandId: products.brandId,
                minPrice: sql<string>`(
                    SELECT MIN(CAST(price AS DECIMAL))::TEXT
                    FROM ${productVariants}
                    WHERE ${productVariants.productId} = ${products.id}
                )`,
                minSalePrice: sql<string | null>`(
                    SELECT MIN(CAST(sale_price AS DECIMAL))::TEXT
                    FROM ${productVariants}
                    WHERE ${productVariants.productId} = ${products.id}
                    AND ${productVariants.salePrice} IS NOT NULL
                )`,
                // Get the first available variant image (more predictable than random)
                primaryImage: sql<string | null>`(
                    SELECT COALESCE(
                        (
                            -- Try to get first variant image (not primary)
                            SELECT pi.url
                            FROM ${productImages} pi
                            LEFT JOIN ${productVariants} pv ON pi.variant_id = pv.id
                            WHERE pi.product_id = ${products.id}
                            AND pi.variant_id IS NOT NULL
                            AND pi.is_primary = false
                            ORDER BY pi.sort_order ASC
                            LIMIT 1
                        ),
                        (
                            -- Fallback to primary image
                            SELECT pi.url
                            FROM ${productImages} pi
                            WHERE pi.product_id = ${products.id}
                            ORDER BY pi.is_primary DESC, pi.sort_order ASC
                            LIMIT 1
                        )
                    )
                )`,
                primaryColorId: sql<string | null>`(
                    SELECT COALESCE(
                        (
                            -- Get the color ID for the first non-primary variant image
                            SELECT pv.color_id
                            FROM ${productImages} pi
                            LEFT JOIN ${productVariants} pv ON pi.variant_id = pv.id
                            WHERE pi.product_id = ${products.id}
                            AND pi.variant_id IS NOT NULL
                            AND pi.is_primary = false
                            ORDER BY pi.sort_order ASC
                            LIMIT 1
                        ),
                        (
                            -- Fallback to primary image color
                            SELECT pv.color_id
                            FROM ${productImages} pi
                            LEFT JOIN ${productVariants} pv ON pi.variant_id = pv.id
                            WHERE pi.product_id = ${products.id}
                            AND pi.is_primary = true
                            LIMIT 1
                        )
                    )
                )`,
                categoryName: categories.name,
                brandName: brands.name,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(brands, eq(products.brandId, brands.id))
            .where(
                and(
                    eq(products.isPublished, true),
                    sql`${products.id} != ${productId}`,
                    or(
                        eq(products.categoryId, currentProduct.categoryId),
                        eq(products.brandId, currentProduct.brandId),
                        eq(products.genderId, currentProduct.genderId),
                    ),
                ),
            )
            .orderBy(desc(products.createdAt))
            .limit(6); // Get more products to have variety

        // Filter out products without valid images and transform
        const validProducts = recommendedData
            .filter((p) => p.primaryImage && p.primaryImage.trim() !== '')
            .map((p) => ({
                id: p.id,
                name: p.name,
                price: p.minPrice || '0',
                salePrice: p.minSalePrice,
                primaryImage: p.primaryImage,
                primaryColorId: p.primaryColorId,
                category: p.categoryName || 'Uncategorized',
                brand: p.brandName || 'Unknown',
            }));

        // Return only 3 products for display
        return validProducts.slice(0, 3);
    } catch (error) {
        console.error('Error in getRecommendedProducts:', error);
        // Return empty array on error to prevent page crash
        return [];
    }
}

export interface FooterProduct {
    id: string;
    name: string;
    slug: string;
}

export interface FooterSection {
    title: string;
    links: Array<{ label: string; href: string }>;
}

/**
 * Get featured products grouped by gender for footer navigation
 * Returns up to 4 products per gender category
 */
export async function getFooterProducts(): Promise<FooterSection[]> {
    try {
        // Get all genders
        const gendersData = await db.select().from(genders);

        const sections: FooterSection[] = [];

        // For each gender, get top 4 products
        for (const gender of gendersData) {
            const productsData = await db
                .select({
                    id: products.id,
                    name: products.name,
                })
                .from(products)
                .where(
                    and(
                        eq(products.genderId, gender.id),
                        eq(products.isPublished, true),
                    ),
                )
                .orderBy(desc(products.createdAt))
                .limit(4);

            if (productsData.length > 0) {
                sections.push({
                    title: gender.label,
                    links: productsData.map((p) => ({
                        label: p.name,
                        href: `/products/${p.id}`,
                    })),
                });
            }
        }

        return sections;
    } catch (error) {
        console.error('Error in getFooterProducts:', error);
        return [];
    }
}
