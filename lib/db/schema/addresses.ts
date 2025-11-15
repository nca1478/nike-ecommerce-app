import { pgTable, text, boolean, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from './user';

export const addressTypeEnum = pgEnum('address_type', ['billing', 'shipping']);

export const addresses = pgTable('addresses', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    type: addressTypeEnum('type').notNull(),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    state: text('state').notNull(),
    country: text('country').notNull(),
    postalCode: text('postal_code').notNull(),
    isDefault: boolean('is_default').notNull().default(false),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
    user: one(user, {
        fields: [addresses.userId],
        references: [user.id],
    }),
}));

export const insertAddressSchema = createInsertSchema(addresses, {
    line1: z.string().min(1, 'Address line 1 is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
});

export const selectAddressSchema = createSelectSchema(addresses);

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
