import { pgTable, timestamp, uuid, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from './user';
import { guest } from './guest';
import { productVariants } from './products';

export const carts = pgTable('carts', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
    guestId: uuid('guest_id').references(() => guest.id, {
        onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(user, {
        fields: [carts.userId],
        references: [user.id],
    }),
    guest: one(guest, {
        fields: [carts.guestId],
        references: [guest.id],
    }),
    items: many(cartItems),
}));

export const cartItems = pgTable('cart_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    cartId: uuid('cart_id')
        .notNull()
        .references(() => carts.id, { onDelete: 'cascade' }),
    productVariantId: uuid('product_variant_id')
        .notNull()
        .references(() => productVariants.id, { onDelete: 'cascade' }),
    quantity: text('quantity').notNull().default('1'),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    productVariant: one(productVariants, {
        fields: [cartItems.productVariantId],
        references: [productVariants.id],
    }),
}));

export const insertCartSchema = createInsertSchema(carts);
export const selectCartSchema = createSelectSchema(carts);

export const insertCartItemSchema = createInsertSchema(cartItems, {
    quantity: z
        .string()
        .regex(/^[1-9]\d*$/, 'Quantity must be a positive integer'),
});
export const selectCartItemSchema = createSelectSchema(cartItems);

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
