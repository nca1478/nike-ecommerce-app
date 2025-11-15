import { pgTable, text, integer, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const sizes = pgTable('sizes', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    sortOrder: integer('sort_order').notNull().default(0),
});

export const insertSizeSchema = createInsertSchema(sizes, {
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    sortOrder: z.number().int().min(0),
});

export const selectSizeSchema = createSelectSchema(sizes);

export type Size = typeof sizes.$inferSelect;
export type NewSize = typeof sizes.$inferInsert;
