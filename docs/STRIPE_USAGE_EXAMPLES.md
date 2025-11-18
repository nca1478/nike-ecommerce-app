# 📖 Ejemplos de Uso - Stripe Integration

## 🛒 Componente de Carrito con Checkout

### CartSummary Component

```tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart.store';
import { createStripeCheckoutSession } from '@/lib/actions/checkout';
import { ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartSummary() {
    const { items, getTotalItems, getSubtotal } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        if (getTotalItems() === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setIsLoading(true);
        const result = await createStripeCheckoutSession();

        if (result.success && result.data) {
            window.location.href = result.data.url;
        } else {
            toast.error(result.error || 'Error processing payment');
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-full"
        >
            {isLoading ? 'Processing...' : 'Checkout'}
        </button>
    );
}
```

## 💳 Server Actions

### Crear Sesión de Checkout

```typescript
// lib/actions/checkout.ts
'use server';

import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { getCurrentUser } from '@/lib/auth/actions';

export async function createStripeCheckoutSession() {
    const user = await getCurrentUser();
    const cart = await getCurrentCart();

    if (!cart || cart.items.length === 0) {
        return { success: false, error: 'Cart is empty' };
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        cart.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.productVariant.product.name,
                    images: [item.productVariant.product.images[0]?.url],
                },
                unit_amount: Math.round(parseFloat(item.price) * 100),
            },
            quantity: parseInt(item.quantity),
        }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        metadata: {
            cartId: cart.id,
            userId: user?.id || '',
        },
    });

    return { success: true, data: { url: session.url } };
}
```

### Crear Pedido desde Webhook

```typescript
// lib/actions/orders.ts
'use server';

import { stripe } from '@/lib/stripe/client';
import { db } from '@/lib/db';
import { orders, orderItems, payments } from '@/lib/db/schema';

export async function createOrder(stripeSessionId: string) {
    // 1. Obtener sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
        expand: ['line_items', 'payment_intent'],
    });

    if (session.payment_status !== 'paid') {
        return { success: false, error: 'Payment not completed' };
    }

    // 2. Obtener datos del carrito
    const cartId = session.metadata?.cartId;
    const userId = session.metadata?.userId;

    // 3. Crear pedido
    const [order] = await db
        .insert(orders)
        .values({
            userId,
            status: 'paid',
            totalAmount: (session.amount_total! / 100).toFixed(2),
            shippingAddressId: '...', // Obtener de la sesión o usuario
            billingAddressId: '...',
        })
        .returning();

    // 4. Crear items del pedido
    const cart = await getCart(cartId);
    for (const item of cart.items) {
        await db.insert(orderItems).values({
            orderId: order.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
        });
    }

    // 5. Registrar pago
    await db.insert(payments).values({
        orderId: order.id,
        method: 'stripe',
        status: 'completed',
        paidAt: new Date(),
        transactionId: session.payment_intent as string,
    });

    // 6. Vaciar carrito
    await clearCart(cartId);

    return { success: true, data: { orderId: order.id } };
}
```

## 🔔 Webhook Handler

### API Route

```typescript
// app/api/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { createOrder } from '@/lib/actions/orders';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 },
        );
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            await createOrder(session.id);
            break;

        case 'payment_intent.payment_failed':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.error('Payment failed:', paymentIntent.id);
            // Notificar al usuario
            break;
    }

    return NextResponse.json({ received: true });
}
```

## ✅ Página de Éxito

### Success Page

```tsx
// app/(root)/checkout/success/page.tsx
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe/client';
import { getOrder } from '@/lib/actions/orders';
import OrderSuccess from '@/components/Cart/OrderSuccess';

export default async function CheckoutSuccessPage({ searchParams }) {
    const sessionId = searchParams.session_id;

    if (!sessionId) {
        redirect('/cart');
    }

    // Verificar sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
        redirect('/cart');
    }

    // Obtener pedido
    const result = await getOrder(session.metadata?.orderId);

    if (!result.success) {
        redirect('/cart');
    }

    return (
        <OrderSuccess
            orderId={result.data.order.id}
            items={result.data.items}
            total={parseFloat(result.data.order.totalAmount)}
            orderDate={new Date(result.data.order.createdAt)}
        />
    );
}
```

### OrderSuccess Component

```tsx
// components/Cart/OrderSuccess.tsx
'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface OrderSuccessProps {
    orderId: string;
    items: Array<{
        productName: string;
        productImage: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    orderDate: Date;
}

export default function OrderSuccess({
    orderId,
    items,
    total,
    orderDate,
}: OrderSuccessProps) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-gray-600">
                    Thank you for your purchase. Your order has been processed
                    successfully.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600 mb-1">Order Number</p>
                        <p className="font-semibold">{orderId.slice(0, 8)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1">Date</p>
                        <p className="font-semibold">
                            {orderDate.toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-4 border-b pb-4">
                        <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={80}
                            height={80}
                            className="rounded-lg"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium">{item.productName}</h3>
                            <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                            </p>
                        </div>
                        <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="flex-1 bg-black text-white py-3 rounded-full text-center"
                >
                    Continue Shopping
                </Link>
                <Link
                    href="/orders"
                    className="flex-1 border-2 border-black py-3 rounded-full text-center"
                >
                    View Orders
                </Link>
            </div>
        </div>
    );
}
```

## 🔄 Fusión de Carritos

### Después de Login/Registro

```typescript
// lib/auth/actions.ts
export async function signIn(input: SignInInput) {
    const result = await auth.api.signInEmail(input);

    if (result?.user) {
        // Fusionar carrito de invitado con usuario
        const guestSessionToken = await getGuestSessionCookie();

        if (guestSessionToken) {
            await mergeGuestCartWithUserCart(guestSessionToken, result.user.id);
        }
    }

    return result;
}
```

### Helper de Fusión

```typescript
// lib/utils/mergeSessions.ts
export async function mergeGuestCartWithUserCart(
    guestId: string,
    userId: string,
) {
    // 1. Obtener carrito de invitado
    const guestCart = await db.query.carts.findFirst({
        where: eq(carts.guestId, guestId),
        with: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    // 2. Obtener o crear carrito de usuario
    let userCart = await db.query.carts.findFirst({
        where: eq(carts.userId, userId),
    });

    if (!userCart) {
        [userCart] = await db.insert(carts).values({ userId }).returning();
    }

    // 3. Migrar items
    for (const item of guestCart.items) {
        const existing = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.cartId, userCart.id),
                eq(cartItems.productVariantId, item.productVariantId),
            ),
        });

        if (existing) {
            // Sumar cantidades
            await db
                .update(cartItems)
                .set({
                    quantity: (
                        parseInt(existing.quantity) + parseInt(item.quantity)
                    ).toString(),
                })
                .where(eq(cartItems.id, existing.id));
        } else {
            // Crear nuevo item
            await db.insert(cartItems).values({
                cartId: userCart.id,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
            });
        }
    }

    // 4. Eliminar carrito de invitado
    await db.delete(carts).where(eq(carts.id, guestCart.id));
}
```

## 🧪 Testing

### Probar Checkout Completo

```typescript
// test/checkout.test.ts
describe('Stripe Checkout', () => {
    it('should create checkout session', async () => {
        const result = await createStripeCheckoutSession();

        expect(result.success).toBe(true);
        expect(result.data?.url).toContain('checkout.stripe.com');
    });

    it('should create order after payment', async () => {
        const sessionId = 'cs_test_...';
        const result = await createOrder(sessionId);

        expect(result.success).toBe(true);
        expect(result.data?.orderId).toBeDefined();
    });

    it('should merge guest cart on login', async () => {
        const guestId = 'guest-123';
        const userId = 'user-456';

        await mergeGuestCartWithUserCart(guestId, userId);

        const userCart = await getCart(userId);
        expect(userCart.items.length).toBeGreaterThan(0);
    });
});
```

## 📊 Monitoreo

### Logs de Webhook

```typescript
// app/api/stripe/route.ts
export async function POST(req: NextRequest) {
    // ... código de verificación ...

    console.log(`[Stripe Webhook] Event: ${event.type}`);
    console.log(`[Stripe Webhook] ID: ${event.id}`);

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log(
                    `[Order] Creating order for session: ${session.id}`,
                );

                const result = await createOrder(session.id);

                if (result.success) {
                    console.log(`[Order] Created: ${result.data?.orderId}`);
                } else {
                    console.error(`[Order] Failed: ${result.error}`);
                }
                break;
        }
    } catch (error) {
        console.error('[Stripe Webhook] Error:', error);
        throw error;
    }

    return NextResponse.json({ received: true });
}
```

## 🎯 Best Practices

1. **Siempre verificar la firma del webhook**
2. **Usar metadata para vincular sesiones con datos de la app**
3. **Implementar idempotencia en la creación de pedidos**
4. **Almacenar precios en céntimos**
5. **Validar el estado del pago antes de crear el pedido**
6. **Limpiar el carrito solo después de crear el pedido exitosamente**
7. **Usar transacciones de base de datos para operaciones críticas**
8. **Registrar todos los eventos de webhook para debugging**
