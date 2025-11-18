'use server';

import { db } from '@/lib/db';
import { carts, cartItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser, createGuestSession } from '@/lib/auth/actions';
import { getGuestSessionCookie } from '@/lib/auth/cookies';
import { revalidatePath } from 'next/cache';

type ActionResult<T = void> = {
    success: boolean;
    error?: string;
    data?: T;
};

export type CartItemWithDetails = {
    id: string;
    productVariantId: string;
    quantity: number;
    productName: string;
    productImage: string;
    price: number;
    salePrice?: number;
    size: string;
    color: string;
    category: string;
    estimatedDelivery?: string;
};

/**
 * Obtener o crear carrito para usuario/invitado
 */
async function getOrCreateCart(): Promise<string | null> {
    try {
        const user = await getCurrentUser();

        if (user) {
            // Usuario autenticado
            let cart = await db.query.carts.findFirst({
                where: eq(carts.userId, user.id),
            });

            if (!cart) {
                const [newCart] = await db
                    .insert(carts)
                    .values({ userId: user.id })
                    .returning();
                cart = newCart;
            }

            return cart.id;
        } else {
            // Usuario invitado
            let guestSessionToken = await getGuestSessionCookie();

            // Si no hay sesión de invitado, crear una
            if (!guestSessionToken) {
                const result = await createGuestSession();
                if (!result.success || !result.data) {
                    return null;
                }
                guestSessionToken = result.data.sessionToken;
            }

            // Buscar invitado por sessionToken
            const guestRecord = await db.query.guest.findFirst({
                where: (guest, { eq }) =>
                    eq(guest.sessionToken, guestSessionToken),
            });

            if (!guestRecord) {
                return null;
            }

            let cart = await db.query.carts.findFirst({
                where: eq(carts.guestId, guestRecord.id),
            });

            if (!cart) {
                const [newCart] = await db
                    .insert(carts)
                    .values({ guestId: guestRecord.id })
                    .returning();
                cart = newCart;
            }

            return cart.id;
        }
    } catch (error) {
        console.error('Error en getOrCreateCart:', error);
        return null;
    }
}

/**
 * Obtener todos los artículos del carrito
 */
export async function getCart(): Promise<ActionResult<CartItemWithDetails[]>> {
    try {
        const cartId = await getOrCreateCart();

        if (!cartId) {
            return {
                success: true,
                data: [],
            };
        }

        const items = await db.query.cartItems.findMany({
            where: eq(cartItems.cartId, cartId),
            with: {
                productVariant: {
                    with: {
                        product: {
                            with: {
                                category: true,
                                images: {
                                    where: (images, { eq }) =>
                                        eq(images.isPrimary, true),
                                    orderBy: (images, { asc }) => [
                                        asc(images.sortOrder),
                                    ],
                                    limit: 1,
                                },
                            },
                        },
                        images: {
                            orderBy: (images, { asc }) => [
                                asc(images.sortOrder),
                            ],
                            limit: 1,
                        },
                    },
                },
            },
        });

        // Obtener información de colores y tallas
        const colorIds = items.map((item) => item.productVariant.colorId);
        const sizeIds = items.map((item) => item.productVariant.sizeId);

        const colors = await db.query.colors.findMany({
            where: (colors, { inArray }) => inArray(colors.id, colorIds),
        });

        const sizes = await db.query.sizes.findMany({
            where: (sizes, { inArray }) => inArray(sizes.id, sizeIds),
        });

        const colorMap = new Map(colors.map((c) => [c.id, c.name]));
        const sizeMap = new Map(sizes.map((s) => [s.id, s.name]));

        const cartItemsWithDetails: CartItemWithDetails[] = items.map(
            (item) => {
                const variant = item.productVariant;
                const product = variant.product;
                const variantImage = variant.images[0]?.url;
                const productImage = product.images[0]?.url;

                return {
                    id: item.id,
                    productVariantId: item.productVariantId,
                    quantity: parseInt(item.quantity),
                    productName: product.name,
                    productImage: variantImage || productImage || '',
                    price: parseFloat(variant.price),
                    salePrice: variant.salePrice
                        ? parseFloat(variant.salePrice)
                        : undefined,
                    size: sizeMap.get(variant.sizeId) || '',
                    color: colorMap.get(variant.colorId) || '',
                    category: product.category.name,
                    estimatedDelivery: undefined, // Se puede calcular según lógica de negocio
                };
            },
        );

        return {
            success: true,
            data: cartItemsWithDetails,
        };
    } catch (error) {
        console.error('Error en getCart:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al obtener el carrito',
        };
    }
}

/**
 * Añadir artículo al carrito
 */
export async function addCartItem(
    productVariantId: string,
    quantity: number = 1,
): Promise<ActionResult<{ itemId: string }>> {
    try {
        const cartId = await getOrCreateCart();

        if (!cartId) {
            return {
                success: false,
                error: 'No se pudo crear el carrito',
            };
        }

        // Verificar si el artículo ya existe
        const existingItem = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.cartId, cartId),
                eq(cartItems.productVariantId, productVariantId),
            ),
        });

        if (existingItem) {
            // Actualizar cantidad
            const newQuantity = parseInt(existingItem.quantity) + quantity;
            await db
                .update(cartItems)
                .set({
                    quantity: newQuantity.toString(),
                })
                .where(eq(cartItems.id, existingItem.id));

            revalidatePath('/cart');
            return {
                success: true,
                data: { itemId: existingItem.id },
            };
        } else {
            // Crear nuevo artículo
            const [newItem] = await db
                .insert(cartItems)
                .values({
                    cartId,
                    productVariantId,
                    quantity: quantity.toString(),
                })
                .returning();

            revalidatePath('/cart');
            return {
                success: true,
                data: { itemId: newItem.id },
            };
        }
    } catch (error) {
        console.error('Error en addCartItem:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al añadir al carrito',
        };
    }
}

/**
 * Actualizar cantidad de artículo en el carrito
 */
export async function updateCartItem(
    itemId: string,
    quantity: number,
): Promise<ActionResult> {
    try {
        if (quantity <= 0) {
            return removeCartItem(itemId);
        }

        await db
            .update(cartItems)
            .set({
                quantity: quantity.toString(),
            })
            .where(eq(cartItems.id, itemId));

        revalidatePath('/cart');
        return {
            success: true,
        };
    } catch (error) {
        console.error('Error en updateCartItem:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar el carrito',
        };
    }
}

/**
 * Eliminar artículo del carrito
 */
export async function removeCartItem(itemId: string): Promise<ActionResult> {
    try {
        await db.delete(cartItems).where(eq(cartItems.id, itemId));

        revalidatePath('/cart');
        return {
            success: true,
        };
    } catch (error) {
        console.error('Error en removeCartItem:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al eliminar del carrito',
        };
    }
}

/**
 * Vaciar carrito
 */
export async function clearCart(): Promise<ActionResult> {
    try {
        const cartId = await getOrCreateCart();

        if (!cartId) {
            return {
                success: true,
            };
        }

        await db.delete(cartItems).where(eq(cartItems.cartId, cartId));

        revalidatePath('/cart');
        return {
            success: true,
        };
    } catch (error) {
        console.error('Error en clearCart:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al vaciar el carrito',
        };
    }
}

/**
 * Migrar carrito de invitado a usuario (llamado desde auth actions)
 */
export async function mergeGuestCartToUser(
    guestId: string,
    userId: string,
): Promise<ActionResult> {
    try {
        // Buscar carrito de invitado
        const guestCart = await db.query.carts.findFirst({
            where: eq(carts.guestId, guestId),
            with: {
                items: true,
            },
        });

        if (!guestCart || guestCart.items.length === 0) {
            return {
                success: true,
            };
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

        revalidatePath('/cart');
        return {
            success: true,
        };
    } catch (error) {
        console.error('Error en mergeGuestCartToUser:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al migrar el carrito',
        };
    }
}
