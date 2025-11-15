import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const genders = pgTable('genders', {
    id: uuid('id').primaryKey().defaultRandom(),
    label: text('label').notNull().unique(),
    slug: text('slug').notNull().unique(),
});

export const insertGenderSchema = createInsertSchema(genders, {
    label: z.string().min(1, 'Label is required'),
    slug: z.string().min(1, 'Slug is required'),
});

export const selectGenderSchema = createSelectSchema(genders);

export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;
