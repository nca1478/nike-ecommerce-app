import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const brands = pgTable('brands', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    logoUrl: text('logo_url'),
});

export const insertBrandSchema = createInsertSchema(brands, {
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    logoUrl: z.string().url().optional(),
});

export const selectBrandSchema = createSelectSchema(brands);

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
