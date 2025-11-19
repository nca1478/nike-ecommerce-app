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

        // Construir line items para Stripe
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
            cart.items.map((item) => {
                const variant = item.productVariant;
                const product = variant.product;
                const price = variant.salePrice || variant.price;
                const priceInCents = Math.round(parseFloat(price) * 100);

                // Validar URL de imagen
                const imageUrl = product.images[0]?.url;
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
