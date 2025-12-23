'use server';

import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { db } from '@/lib/db';
import { carts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/actions';
import { getGuestSessionCookie } from '@/lib/auth/cookies';

type ActionResult<T = void> = {
    success: boolean;
    error?: string;
    data?: T;
};

/**
 * Obtener carrito actual (usuario o invitado)
 */
async function getCurrentCart() {
    const user = await getCurrentUser();

    if (user) {
        return await db.query.carts.findFirst({
            where: eq(carts.userId, user.id),
            with: {
                items: {
                    with: {
                        productVariant: {
                            with: {
                                product: {
                                    with: {
                                        images: {
                                            where: (images, { eq }) =>
                                                eq(images.isPrimary, true),
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
                },
            },
        });
    } else {
        const guestSessionToken = await getGuestSessionCookie();
        if (!guestSessionToken) return null;

        const guestRecord = await db.query.guest.findFirst({
            where: (guest, { eq }) => eq(guest.sessionToken, guestSessionToken),
        });

        if (!guestRecord) return null;

        return await db.query.carts.findFirst({
            where: eq(carts.guestId, guestRecord.id),
            with: {
                items: {
                    with: {
                        productVariant: {
                            with: {
                                product: {
                                    with: {
                                        images: {
                                            where: (images, { eq }) =>
                                                eq(images.isPrimary, true),
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
                },
            },
        });
    }
}

/**
 * Crear sesión de Stripe Checkout
 */
export async function createStripeCheckoutSession(): Promise<
    ActionResult<{ url: string }>
> {
    try {
        const user = await getCurrentUser();
        const cart = await getCurrentCart();

        if (!cart || !cart.items || cart.items.length === 0) {
            return {
                success: false,
                error: 'El carrito está vacío',
            };
        }

        // Calcular subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            const variant = item.productVariant;
            const price = variant.salePrice || variant.price;
            return sum + parseFloat(price) * parseInt(item.quantity);
        }, 0);

        // Calcular shipping y tax
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.08; // 8% de impuestos

        // Construir line items para Stripe
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
            cart.items.map((item) => {
                const variant = item.productVariant;
                const product = variant.product;
                const price = variant.salePrice || variant.price;
                const priceInCents = Math.round(parseFloat(price) * 100);

                // Usar imagen de la variante si existe, sino usar imagen del producto
                const variantImage = variant.images?.[0]?.url;
                const productImage = product.images[0]?.url;
                const imageUrl = variantImage || productImage;

                const isValidUrl =
                    imageUrl &&
                    (imageUrl.startsWith('http://') ||
                        imageUrl.startsWith('https://'));

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                            description: product.description || undefined,
                            images: isValidUrl ? [imageUrl] : undefined,
                        },
                        unit_amount: priceInCents,
                    },
                    quantity: parseInt(item.quantity),
                };
            });

        // Agregar shipping como line item si aplica
        if (shipping > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping & Handling',
                        description: 'Delivery fee',
                    },
                    unit_amount: Math.round(shipping * 100),
                },
                quantity: 1,
            });
        }

        // Agregar tax como line item
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Tax',
                    description: 'Estimated tax (8%)',
                },
                unit_amount: Math.round(tax * 100),
            },
            quantity: 1,
        });

        // Crear sesión de Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
            metadata: {
                cartId: cart.id,
                userId: user?.id || '',
                guestId: cart.guestId || '',
            },
        });

        if (!session.url) {
            return {
                success: false,
                error: 'Error al crear la sesión de pago',
            };
        }

        return {
            success: true,
            data: { url: session.url },
        };
    } catch (error) {
        console.error('Error en createStripeCheckoutSession:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al crear la sesión de pago',
        };
    }
}
