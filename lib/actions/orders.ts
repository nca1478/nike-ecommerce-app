'use server';

import { db } from '@/lib/db';
import {
    orders,
    orderItems,
    payments,
    carts,
    cartItems,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe/client';

type ActionResult<T = void> = {
    success: boolean;
    error?: string;
    data?: T;
};

/**
 * Crear pedido desde sesión de Stripe
 */
export async function createOrder(
    stripeSessionId: string,
): Promise<ActionResult<{ orderId: string }>> {
    try {
        // Obtener sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(
            stripeSessionId,
            {
                expand: ['line_items', 'payment_intent'],
            },
        );

        if (session.payment_status !== 'paid') {
            return {
                success: false,
                error: 'El pago no ha sido completado',
            };
        }

        const cartId = session.metadata?.cartId;
        const userId = session.metadata?.userId;
        const guestId = session.metadata?.guestId;

        if (!cartId) {
            return {
                success: false,
                error: 'Cart ID no encontrado en metadata',
            };
        }

        if (!userId && !guestId) {
            return {
                success: false,
                error: 'Usuario o invitado no identificado',
            };
        }

        // Obtener carrito con items
        const cart = await db.query.carts.findFirst({
            where: eq(carts.id, cartId),
            with: {
                items: {
                    with: {
                        productVariant: true,
                    },
                },
            },
        });

        if (!cart || !cart.items || cart.items.length === 0) {
            return {
                success: false,
                error: 'Carrito no encontrado',
            };
        }

        // Calcular subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            const price =
                item.productVariant.salePrice || item.productVariant.price;
            return sum + parseFloat(price) * parseInt(item.quantity);
        }, 0);

        // Calcular shipping y tax (igual que en checkout)
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.08; // 8% de impuestos

        // Calcular total incluyendo shipping y tax
        const totalAmount = subtotal + shipping + tax;

        // Validar que tengamos userId (por ahora solo soportamos usuarios autenticados)
        if (!userId) {
            return {
                success: false,
                error: 'Solo usuarios autenticados pueden crear órdenes',
            };
        }

        // Crear dirección temporal (en producción, esto vendría del formulario de checkout)
        // Por ahora, usamos una dirección por defecto
        const { addresses } = await import('@/lib/db/schema');
        const [shippingAddress] = await db
            .insert(addresses)
            .values({
                userId,
                type: 'shipping',
                line1:
                    session.customer_details?.address?.line1 ||
                    'Temporary Address',
                line2: session.customer_details?.address?.line2 || null,
                city: session.customer_details?.address?.city || 'City',
                state: session.customer_details?.address?.state || 'State',
                postalCode:
                    session.customer_details?.address?.postal_code || '00000',
                country: session.customer_details?.address?.country || 'US',
                isDefault: false,
            })
            .returning();

        // Crear pedido
        const [order] = await db
            .insert(orders)
            .values({
                userId,
                status: 'paid',
                totalAmount: totalAmount.toFixed(2),
                shippingAddressId: shippingAddress.id,
                billingAddressId: shippingAddress.id,
            })
            .returning();

        // Crear items del pedido
        for (const item of cart.items) {
            const price =
                item.productVariant.salePrice || item.productVariant.price;

            await db.insert(orderItems).values({
                orderId: order.id,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                priceAtPurchase: price,
            });
        }

        // Crear registro de pago
        const paymentIntentId =
            typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id || '';

        await db.insert(payments).values({
            orderId: order.id,
            method: 'stripe',
            status: 'completed',
            paidAt: new Date(),
            transactionId: paymentIntentId,
        });

        // Vaciar carrito
        await db.delete(cartItems).where(eq(cartItems.cartId, cartId));

        return {
            success: true,
            data: { orderId: order.id },
        };
    } catch (error) {
        console.error('Error en createOrder:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al crear el pedido',
        };
    }
}

interface OrderItemWithDetails {
    id: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
}

interface Address {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface OrderWithDetails {
    id: string;
    userId: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    shippingAddress: Address;
    billingAddress: Address;
}

/**
 * Obtener pedido por ID o transactionId
 */
export async function getOrder(identifier: string): Promise<
    ActionResult<{
        order: OrderWithDetails;
        items: OrderItemWithDetails[];
    }>
> {
    try {
        let order;

        // Verificar si el identificador es un UUID válido o un payment_intent de Stripe
        const isUUID =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                identifier,
            );
        const isPaymentIntent = identifier.startsWith('pi_');

        // Solo buscar por orderId si es un UUID válido
        if (isUUID) {
            order = await db.query.orders.findFirst({
                where: eq(orders.id, identifier),
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
                    shippingAddress: true,
                    billingAddress: true,
                    payments: true,
                },
            });
        }

        // Si no se encuentra o es un payment_intent, buscar por transactionId
        if (!order && (isPaymentIntent || !isUUID)) {
            const payment = await db.query.payments.findFirst({
                where: eq(payments.transactionId, identifier),
                with: {
                    order: {
                        with: {
                            items: {
                                with: {
                                    productVariant: {
                                        with: {
                                            product: {
                                                with: {
                                                    images: {
                                                        where: (
                                                            images,
                                                            { eq },
                                                        ) =>
                                                            eq(
                                                                images.isPrimary,
                                                                true,
                                                            ),
                                                        limit: 1,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            shippingAddress: true,
                            billingAddress: true,
                            payments: true,
                        },
                    },
                },
            });

            if (payment?.order) {
                order = payment.order;
            }
        }

        if (!order) {
            return {
                success: false,
                error: 'Pedido no encontrado',
            };
        }

        // Obtener información de colores y tallas
        const colorIds = order.items.map((item) => item.productVariant.colorId);
        const sizeIds = order.items.map((item) => item.productVariant.sizeId);

        const colors = await db.query.colors.findMany({
            where: (colors, { inArray }) => inArray(colors.id, colorIds),
        });

        const sizes = await db.query.sizes.findMany({
            where: (sizes, { inArray }) => inArray(sizes.id, sizeIds),
        });

        const colorMap = new Map(colors.map((c) => [c.id, c.name]));
        const sizeMap = new Map(sizes.map((s) => [s.id, s.name]));

        const itemsWithDetails = order.items.map((item) => ({
            id: item.id,
            productName: item.productVariant.product.name,
            productImage: item.productVariant.product.images[0]?.url || '',
            quantity: parseInt(item.quantity),
            price: parseFloat(item.priceAtPurchase),
            size: sizeMap.get(item.productVariant.sizeId) || '',
            color: colorMap.get(item.productVariant.colorId) || '',
        }));

        return {
            success: true,
            data: {
                order,
                items: itemsWithDetails,
            },
        };
    } catch (error) {
        console.error('Error en getOrder:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al obtener el pedido',
        };
    }
}

interface OrderItemForList {
    id: string;
    quantity: string;
    priceAtPurchase: string;
    productVariant: {
        product: {
            name: string;
            images: Array<{ url: string }>;
        };
    };
}

interface UserOrder {
    id: string;
    userId: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    items: OrderItemForList[];
}

/**
 * Obtener pedidos del usuario
 */
export async function getUserOrders(
    userId: string,
): Promise<ActionResult<UserOrder[]>> {
    try {
        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, userId),
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
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });

        return {
            success: true,
            data: userOrders,
        };
    } catch (error) {
        console.error('Error en getUserOrders:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al obtener los pedidos',
        };
    }
}
