import { db } from '@/lib/db';
import { carts, cartItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Fusionar carrito de invitado con carrito de usuario
 * Esta función se llama automáticamente después de login/registro
 */
export async function mergeGuestCartWithUserCart(
    guestId: string,
    userId: string,
): Promise<void> {
    try {
        // Buscar carrito de invitado
        const guestCart = await db.query.carts.findFirst({
            where: eq(carts.guestId, guestId),
            with: {
                items: true,
            },
        });

        if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
            return;
        }

        // Buscar o crear carrito de usuario
        let userCart = await db.query.carts.findFirst({
            where: eq(carts.userId, userId),
        });

        if (!userCart) {
            const [newCart] = await db
                .insert(carts)
                .values({ userId })
                .returning();
            userCart = newCart;
        }

        // Migrar artículos
        for (const item of guestCart.items) {
            // Verificar si el artículo ya existe en el carrito del usuario
            const existingItem = await db.query.cartItems.findFirst({
                where: and(
                    eq(cartItems.cartId, userCart.id),
                    eq(cartItems.productVariantId, item.productVariantId),
                ),
            });

            if (existingItem) {
                // Sumar cantidades
                const newQuantity =
                    parseInt(existingItem.quantity) + parseInt(item.quantity);
                await db
                    .update(cartItems)
                    .set({
                        quantity: newQuantity.toString(),
                    })
                    .where(eq(cartItems.id, existingItem.id));
            } else {
                // Crear nuevo artículo
                await db.insert(cartItems).values({
                    cartId: userCart.id,
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                });
            }
        }

        // Eliminar carrito de invitado
        await db.delete(carts).where(eq(carts.id, guestCart.id));
    } catch (error) {
        console.error('Error en mergeGuestCartWithUserCart:', error);
        throw error;
    }
}
