import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    parentId: uuid('parent_id'),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
        relationName: 'subcategories',
    }),
    children: many(categories, {
        relationName: 'subcategories',
    }),
}));

export const insertCategorySchema = createInsertSchema(categories, {
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
});

export const selectCategorySchema = createSelectSchema(categories);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
