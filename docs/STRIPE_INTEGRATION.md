# Integración de Stripe Checkout

## 📋 Descripción General

Esta documentación describe la integración completa de Stripe Checkout en la plataforma de comercio electrónico Nike. La implementación soporta tanto sesiones de invitados como usuarios autenticados, con persistencia de carrito y creación automática de pedidos.

## 🏗️ Arquitectura

### Estructura de Archivos

```
/lib
├── stripe/
│   └── client.ts                 # Cliente de Stripe inicializado
├── actions/
│   ├── checkout.ts               # Server action: createStripeCheckoutSession
│   └── orders.ts                 # Server actions: createOrder, getOrder, getUserOrders
└── utils/
    └── mergeSessions.ts          # Helper para fusionar sesiones

/components/Cart
├── CartSummary.tsx               # Componente con botón de checkout
└── OrderSuccess.tsx              # UI de confirmación de pedido

/app
├── api/stripe/
│   └── route.ts                  # Webhook handler de Stripe
└── (root)/checkout/success/
    └── page.tsx                  # Página de éxito del pedido
```

## ⚙️ Configuración

### 1. Variables de Entorno

Añade las siguientes variables a tu archivo `.env.local`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Base URL (necesaria para redirecciones)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Obtener Claves de Stripe

1. Crea una cuenta en [Stripe Dashboard](https://dashboard.stripe.com)
2. Ve a **Developers > API keys**
3. Copia la **Secret key** y **Publishable key**
4. Para el webhook secret, ve a **Developers > Webhooks**

### 3. Configurar Webhook

1. En Stripe Dashboard, ve a **Developers > Webhooks**
2. Haz clic en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/stripe`
4. Selecciona los eventos:
    - `checkout.session.completed`
    - `payment_intent.payment_failed`
    - `payment_intent.succeeded`
5. Copia el **Signing secret** y añádelo como `STRIPE_WEBHOOK_SECRET`

Para desarrollo local, usa [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe
```

## 🔄 Flujo de Checkout

### 1. Usuario en el Carrito

```typescript
// components/Cart/CartSummary.tsx
const handleCheckout = async () => {
    const result = await createStripeCheckoutSession();
    if (result.success) {
        window.location.href = result.data.url;
    }
};
```

### 2. Crear Sesión de Stripe

```typescript
// lib/actions/checkout.ts
export async function createStripeCheckoutSession() {
    // 1. Obtener carrito actual (usuario o invitado)
    const cart = await getCurrentCart();

    // 2. Crear line items para Stripe
    const lineItems = cart.items.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: { name: item.product.name },
            unit_amount: priceInCents,
        },
        quantity: item.quantity,
    }));

    // 3. Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cart`,
        metadata: { cartId, userId, guestId },
    });

    return { url: session.url };
}
```

### 3. Webhook de Stripe

```typescript
// app/api/stripe/route.ts
export async function POST(req: NextRequest) {
    // 1. Verificar firma del webhook
    const event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
    );

    // 2. Manejar evento
    if (event.type === 'checkout.session.completed') {
        await createOrder(session.id);
    }
}
```

### 4. Crear Pedido

```typescript
// lib/actions/orders.ts
export async function createOrder(stripeSessionId: string) {
    // 1. Obtener sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

    // 2. Obtener carrito desde metadata
    const cart = await getCart(session.metadata.cartId);

    // 3. Crear pedido en la base de datos
    const order = await db.insert(orders).values({
        userId: session.metadata.userId,
        status: 'paid',
        totalAmount: calculateTotal(cart),
    });

    // 4. Crear items del pedido
    await createOrderItems(order.id, cart.items);

    // 5. Registrar pago
    await db.insert(payments).values({
        orderId: order.id,
        method: 'stripe',
        status: 'completed',
        transactionId: session.payment_intent,
    });

    // 6. Vaciar carrito
    await clearCart(cart.id);
}
```

### 5. Página de Éxito

```typescript
// app/(root)/checkout/success/page.tsx
export default async function CheckoutSuccessPage({ searchParams }) {
    const sessionId = searchParams.session_id;

    // 1. Verificar sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Obtener pedido
    const order = await getOrder(session.metadata.orderId);

    // 3. Mostrar confirmación
    return <OrderSuccess order={order} />;
}
```

## 🔐 Seguridad

### Verificación de Webhook

```typescript
// Siempre verificar la firma del webhook
const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
);
```

### Validación de Sesión

```typescript
// Verificar que el pago fue completado
if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed');
}
```

### Idempotencia

```typescript
// Verificar si el pedido ya existe
const existingOrder = await db.query.orders.findFirst({
    where: eq(orders.stripeSessionId, sessionId),
});

if (existingOrder) {
    return existingOrder;
}
```

## 💰 Manejo de Precios

Todos los precios se almacenan como **enteros en céntimos**:

```typescript
// Convertir precio a céntimos
const priceInCents = Math.round(parseFloat(price) * 100);

// En Stripe
price_data: {
    currency: 'usd',
    unit_amount: priceInCents, // 1999 = $19.99
}
```

## 🔄 Fusión de Sesiones

Cuando un invitado inicia sesión o se registra, su carrito se fusiona automáticamente:

```typescript
// lib/auth/actions.ts
export async function signIn(input) {
    const result = await auth.api.signInEmail(input);

    // Fusionar carrito de invitado
    const guestSessionToken = await getGuestSessionCookie();
    if (guestSessionToken) {
        await mergeGuestCartWithUserCart(guestSessionToken, result.user.id);
    }
}
```

## 📊 Esquema de Base de Datos

### Tabla: orders

```typescript
{
    id: uuid,
    userId: uuid,
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled',
    totalAmount: text, // Almacenado como string decimal
    shippingAddressId: uuid,
    billingAddressId: uuid,
    createdAt: timestamp,
}
```

### Tabla: order_items

```typescript
{
    id: uuid,
    orderId: uuid,
    productVariantId: uuid,
    quantity: text,
    priceAtPurchase: text, // Precio en el momento de la compra
}
```

### Tabla: payments

```typescript
{
    id: uuid,
    orderId: uuid,
    method: 'stripe' | 'paypal' | 'cod',
    status: 'initiated' | 'completed' | 'failed',
    paidAt: timestamp,
    transactionId: text, // ID de Stripe
}
```

## 🧪 Testing

### Tarjetas de Prueba de Stripe

```
Éxito: 4242 4242 4242 4242
Fallo: 4000 0000 0000 0002
Requiere autenticación: 4000 0025 0000 3155
```

### Probar Webhook Localmente

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:3000/api/stripe

# Probar webhook
stripe trigger checkout.session.completed
```

## 🐛 Troubleshooting

### Error: "No signature provided"

- Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado
- Asegúrate de que el header `stripe-signature` se está enviando

### Error: "Invalid signature"

- El webhook secret es incorrecto
- Usa Stripe CLI para desarrollo local

### Pedido no se crea después del pago

- Verifica los logs del webhook en Stripe Dashboard
- Asegúrate de que el endpoint `/api/stripe` es accesible públicamente
- Verifica que los eventos estén configurados correctamente

### Carrito vacío después de login

- Verifica que `mergeGuestCartWithUserCart` se está llamando
- Revisa que la cookie de sesión de invitado existe

## 📚 Recursos

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## ✅ Checklist de Implementación

- [x] Instalar paquete `stripe`
- [x] Configurar variables de entorno
- [x] Crear cliente de Stripe
- [x] Implementar `createStripeCheckoutSession`
- [x] Crear componente `CartSummary` con botón de checkout
- [x] Implementar webhook handler
- [x] Crear `createOrder` action
- [x] Crear `getOrder` action
- [x] Implementar página de éxito
- [x] Crear componente `OrderSuccess`
- [x] Configurar webhook en Stripe Dashboard
- [x] Probar flujo completo de checkout
- [x] Verificar fusión de carritos
- [x] Probar con tarjetas de prueba
