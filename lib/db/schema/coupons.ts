import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const discountTypeEnum = pgEnum('discount_type', [
    'percentage',
    'fixed',
]);

export const coupons = pgTable('coupons', {
    id: uuid('id').primaryKey().defaultRandom(),
    code: text('code').notNull().unique(),
    discountType: discountTypeEnum('discount_type').notNull(),
    discountValue: text('discount_value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    maxUsage: text('max_usage').notNull(),
    usedCount: text('used_count').notNull().default('0'),
});

export const insertCouponSchema = createInsertSchema(coupons, {
    code: z.string().min(1, 'Code is required'),
    discountValue: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid discount value'),
    maxUsage: z.string().regex(/^[1-9]\d*$/, 'Must be a positive integer'),
    usedCount: z.string().regex(/^\d+$/, 'Must be a valid number'),
});

export const selectCouponSchema = createSelectSchema(coupons);

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
