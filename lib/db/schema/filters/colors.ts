import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const colors = pgTable('colors', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    hexCode: text('hex_code').notNull(),
});

export const insertColorSchema = createInsertSchema(colors, {
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    hexCode: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color code'),
});

export const selectColorSchema = createSelectSchema(colors);

export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;
