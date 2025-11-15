import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from './user';
import { addresses } from './addresses';
import { productVariants } from './products';

export const orderStatusEnum = pgEnum('order_status', [
    'pending',
    'paid',
    'shipped',
    'delivered',
    'cancelled',
]);

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'restrict' }),
    status: orderStatusEnum('status').notNull().default('pending'),
    totalAmount: text('total_amount').notNull(),
    shippingAddressId: uuid('shipping_address_id')
        .notNull()
        .references(() => addresses.id, { onDelete: 'restrict' }),
    billingAddressId: uuid('billing_address_id')
        .notNull()
        .references(() => addresses.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(user, {
        fields: [orders.userId],
        references: [user.id],
    }),
    shippingAddress: one(addresses, {
        fields: [orders.shippingAddressId],
        references: [addresses.id],
        relationName: 'shippingOrders',
    }),
    billingAddress: one(addresses, {
        fields: [orders.billingAddressId],
        references: [addresses.id],
        relationName: 'billingOrders',
    }),
    items: many(orderItems),
    payments: many(payments),
}));

export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
        .notNull()
        .references(() => orders.id, { onDelete: 'cascade' }),
    productVariantId: uuid('product_variant_id')
        .notNull()
        .references(() => productVariants.id, { onDelete: 'restrict' }),
    quantity: text('quantity').notNull(),
    priceAtPurchase: text('price_at_purchase').notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    productVariant: one(productVariants, {
        fields: [orderItems.productVariantId],
        references: [productVariants.id],
    }),
}));

export const paymentMethodEnum = pgEnum('payment_method', [
    'stripe',
    'paypal',
    'cod',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
    'initiated',
    'completed',
    'failed',
]);

export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
        .notNull()
        .references(() => orders.id, { onDelete: 'cascade' }),
    method: paymentMethodEnum('method').notNull(),
    status: paymentStatusEnum('status').notNull().default('initiated'),
    paidAt: timestamp('paid_at'),
    transactionId: text('transaction_id'),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
    order: one(orders, {
        fields: [payments.orderId],
        references: [orders.id],
    }),
}));

export const insertOrderSchema = createInsertSchema(orders, {
    totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
});

export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems, {
    quantity: z
        .string()
        .regex(/^[1-9]\d*$/, 'Quantity must be a positive integer'),
    priceAtPurchase: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
});

export const selectOrderItemSchema = createSelectSchema(orderItems);

export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
