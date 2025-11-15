'use server';

import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';

export async function getAllProducts() {
    try {
        const allProducts = await db.select().from(products);
        return allProducts;
    } catch (error) {
        console.error('Error in getAllProducts action:', error);
        throw error;
    }
}
