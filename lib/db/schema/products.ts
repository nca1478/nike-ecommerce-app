import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { categories } from './categories';
import { genders } from './filters/genders';
import { brands } from './brands';

export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    categoryId: uuid('category_id')
        .notNull()
        .references(() => categories.id, { onDelete: 'restrict' }),
    genderId: uuid('gender_id')
        .notNull()
        .references(() => genders.id, { onDelete: 'restrict' }),
    brandId: uuid('brand_id')
        .notNull()
        .references(() => brands.id, { onDelete: 'restrict' }),
    isPublished: boolean('is_published').notNull().default(false),
    defaultVariantId: uuid('default_variant_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    gender: one(genders, {
        fields: [products.genderId],
        references: [genders.id],
    }),
    brand: one(brands, {
        fields: [products.brandId],
        references: [brands.id],
    }),
    variants: many(productVariants),
    images: many(productImages),
    reviews: many(reviews),
}));

export const productVariants = pgTable('product_variants', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
        .notNull()
        .references(() => products.id, { onDelete: 'cascade' }),
    sku: text('sku').notNull().unique(),
    price: text('price').notNull(), // stored as text to avoid precision issues
    salePrice: text('sale_price'),
    colorId: uuid('color_id').notNull(),
    sizeId: uuid('size_id').notNull(),
    inStock: text('in_stock').notNull().default('0'),
    weight: text('weight'),
    dimensions: text('dimensions'), // JSON string: { length, width, height }
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const productVariantsRelations = relations(
    productVariants,
    ({ one, many }) => ({
        product: one(products, {
            fields: [productVariants.productId],
            references: [products.id],
        }),
        images: many(productImages),
    }),
);

export const productImages = pgTable('product_images', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
        .notNull()
        .references(() => products.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id'),
    url: text('url').notNull(),
    sortOrder: text('sort_order').notNull().default('0'),
    isPrimary: boolean('is_primary').notNull().default(false),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [productImages.variantId],
        references: [productVariants.id],
    }),
}));

export const reviews = pgTable('reviews', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
        .notNull()
        .references(() => products.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull(),
    rating: text('rating').notNull(),
    comment: text('comment').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
}));

export const insertProductSchema = createInsertSchema(products, {
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
});

export const selectProductSchema = createSelectSchema(products);

export const insertProductVariantSchema = createInsertSchema(productVariants, {
    sku: z.string().min(1, 'SKU is required'),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
    salePrice: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
        .optional(),
    inStock: z.string().regex(/^\d+$/, 'Must be a valid number'),
});

export const selectProductVariantSchema = createSelectSchema(productVariants);

export const insertReviewSchema = createInsertSchema(reviews, {
    rating: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
    comment: z.string().min(1, 'Comment is required'),
});

export const selectReviewSchema = createSelectSchema(reviews);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
