# 💳 Stripe Checkout Integration

## 🎯 Resumen

Integración completa de Stripe Checkout para la plataforma de comercio electrónico Nike. Soporta pagos de usuarios autenticados e invitados con persistencia de carrito y creación automática de pedidos.

## ✨ Características

- ✅ Checkout con Stripe Checkout (hosted)
- ✅ Soporte para usuarios autenticados e invitados
- ✅ Fusión automática de carritos al login/registro
- ✅ Webhook seguro para confirmación de pagos
- ✅ Creación automática de pedidos en base de datos
- ✅ Página de confirmación de pedido
- ✅ Vaciado automático del carrito después del pago
- ✅ Manejo de errores y estados de carga
- ✅ Precios en céntimos para precisión

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install stripe
```

### 2. Configurar Variables de Entorno

Crea o actualiza tu archivo `.env.local`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Obtener Claves de Stripe

1. Regístrate en [Stripe](https://dashboard.stripe.com/register)
2. Ve a **Developers > API keys**
3. Copia las claves de prueba

### 4. Configurar Webhook (Desarrollo)

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# o visita: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:3000/api/stripe
```

Copia el webhook secret que aparece y añádelo a `.env.local`.

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

## 📁 Archivos Creados

```
lib/
├── stripe/
│   └── client.ts                 # Cliente de Stripe
├── actions/
│   ├── checkout.ts               # createStripeCheckoutSession
│   └── orders.ts                 # createOrder, getOrder
└── utils/
    └── mergeSessions.ts          # Fusión de carritos

components/Cart/
├── CartSummary.tsx               # Botón de checkout
└── OrderSuccess.tsx              # Confirmación de pedido

app/
├── api/stripe/
│   └── route.ts                  # Webhook handler
└── (root)/checkout/success/
    └── page.tsx                  # Página de éxito

docs/
├── STRIPE_INTEGRATION.md         # Documentación completa
├── STRIPE_SETUP_QUICK.md         # Setup rápido
├── STRIPE_USAGE_EXAMPLES.md      # Ejemplos de código
└── STRIPE_CHECKLIST.md           # Checklist de implementación
```

## 🔄 Flujo de Checkout

```
1. Usuario en carrito
   ↓
2. Click en "Checkout"
   ↓
3. createStripeCheckoutSession()
   ↓
4. Redirigir a Stripe Checkout
   ↓
5. Usuario completa pago
   ↓
6. Stripe envía webhook
   ↓
7. createOrder() - Crear pedido en BD
   ↓
8. Vaciar carrito
   ↓
9. Redirigir a /checkout/success
   ↓
10. Mostrar confirmación
```

## 🧪 Testing

### Tarjetas de Prueba

```
✅ Éxito:                    4242 4242 4242 4242
❌ Fallo:                    4000 0000 0000 0002
🔐 Requiere autenticación:   4000 0025 0000 3155
```

Usa cualquier fecha futura y CVC de 3 dígitos.

### Probar el Flujo

1. Añade productos al carrito
2. Ve a `/cart`
3. Click en "Checkout"
4. Completa el pago con tarjeta de prueba
5. Verifica redirección a `/checkout/success`
6. Verifica pedido en base de datos

## 📚 Documentación

- **[STRIPE_SETUP_QUICK.md](./docs/STRIPE_SETUP_QUICK.md)** - Configuración rápida (15 min)
- **[STRIPE_INTEGRATION.md](./docs/STRIPE_INTEGRATION.md)** - Documentación completa (45 min)
- **[STRIPE_USAGE_EXAMPLES.md](./docs/STRIPE_USAGE_EXAMPLES.md)** - Ejemplos de código (20 min)
- **[STRIPE_CHECKLIST.md](./docs/STRIPE_CHECKLIST.md)** - Checklist de implementación (5 min)

## 🔐 Seguridad

- ✅ Verificación de firma de webhook
- ✅ Validación de estado de pago
- ✅ Variables de entorno para claves secretas
- ✅ No exposición de claves en el cliente
- ✅ Metadata para vincular sesiones

## 🐛 Troubleshooting

### Webhook no funciona

```bash
# Verifica que Stripe CLI está corriendo
stripe listen --forward-to localhost:3000/api/stripe
```

### Pedido no se crea

1. Verifica logs del webhook en Stripe Dashboard
2. Revisa logs del servidor
3. Verifica que el evento `checkout.session.completed` está configurado

### Error: "No signature provided"

Verifica que `STRIPE_WEBHOOK_SECRET` está configurado en `.env.local`.

## 🚀 Producción

### Antes de Desplegar

1. Cambiar a claves de producción:
    - `STRIPE_SECRET_KEY` → `sk_live_...`
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`

2. Configurar webhook en Stripe Dashboard:
    - URL: `https://tu-dominio.com/api/stripe`
    - Eventos: `checkout.session.completed`, `payment_intent.payment_failed`

3. Actualizar `NEXT_PUBLIC_BASE_URL` a tu dominio de producción

## 📊 Estructura de Base de Datos

### Tabla: orders

```typescript
{
    id: uuid,
    userId: uuid,
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled',
    totalAmount: text,
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
    priceAtPurchase: text,
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
    transactionId: text,
}
```

## 💡 Uso Básico

### En el Carrito

```tsx
import CartSummary from '@/components/Cart/CartSummary';

export default function CartPage() {
    return (
        <div>
            <CartList />
            <CartSummary /> {/* Incluye botón de checkout */}
        </div>
    );
}
```

### Crear Sesión de Checkout

```typescript
import { createStripeCheckoutSession } from '@/lib/actions/checkout';

const result = await createStripeCheckoutSession();
if (result.success) {
    window.location.href = result.data.url;
}
```

### Obtener Pedido

```typescript
import { getOrder } from '@/lib/actions/orders';

const result = await getOrder(orderId);
if (result.success) {
    console.log(result.data.order);
    console.log(result.data.items);
}
```

## 🔗 Enlaces Útiles

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Guide](https://stripe.com/docs/webhooks)

## ✅ Checklist Rápido

- [x] Instalar `stripe` package
- [x] Configurar variables de entorno
- [x] Crear cliente de Stripe
- [x] Implementar checkout session
- [x] Crear webhook handler
- [x] Implementar creación de pedidos
- [x] Crear página de éxito
- [ ] Obtener claves de Stripe
- [ ] Configurar webhook local
- [ ] Probar con tarjeta de prueba
- [ ] Verificar creación de pedido

## 📞 Soporte

Para más información, consulta la documentación completa en:

- `docs/STRIPE_INTEGRATION.md`
- `docs/STRIPE_SETUP_QUICK.md`

---

**Versión:** 1.0.0  
**Última actualización:** 18 de Noviembre, 2025  
**Estado:** ✅ Listo para usar
