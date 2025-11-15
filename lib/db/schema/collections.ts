import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const collections = pgTable('collections', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
    productCollections: many(productCollections),
}));

export const productCollections = pgTable('product_collections', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull(),
    collectionId: uuid('collection_id')
        .notNull()
        .references(() => collections.id, { onDelete: 'cascade' }),
});

export const productCollectionsRelations = relations(
    productCollections,
    ({ one }) => ({
        collection: one(collections, {
            fields: [productCollections.collectionId],
            references: [collections.id],
        }),
    }),
);

export const insertCollectionSchema = createInsertSchema(collections, {
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
});

export const selectCollectionSchema = createSelectSchema(collections);

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type ProductCollection = typeof productCollections.$inferSelect;
export type NewProductCollection = typeof productCollections.$inferInsert;
