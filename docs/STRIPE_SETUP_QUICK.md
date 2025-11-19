# 🚀 Configuración Rápida de Stripe

## 1. Instalar Dependencias

```bash
npm install stripe
```

## 2. Configurar Variables de Entorno

Añade a tu archivo `.env.local`:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 3. Obtener Claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Crea una cuenta o inicia sesión
3. Ve a **Developers > API keys**
4. Copia:
    - **Secret key** → `STRIPE_SECRET_KEY`
    - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## 4. Configurar Webhook (Desarrollo Local)

### Opción A: Stripe CLI (Recomendado)

```bash
# Instalar Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz

# Login
stripe login

# Escuchar webhooks (esto te dará el webhook secret)
stripe listen --forward-to localhost:3000/api/stripe
```

Copia el **webhook signing secret** que aparece y añádelo como `STRIPE_WEBHOOK_SECRET`.

### Opción B: Webhook en Producción

1. Ve a **Developers > Webhooks** en Stripe Dashboard
2. Haz clic en **Add endpoint**
3. URL: `https://tu-dominio.com/api/stripe`
4. Eventos a escuchar:
    - `checkout.session.completed`
    - `payment_intent.payment_failed`
    - `payment_intent.succeeded`
5. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 5. Probar la Integración

### Tarjetas de Prueba

```
✅ Éxito:                    4242 4242 4242 4242
❌ Fallo:                    4000 0000 0000 0002
🔐 Requiere autenticación:   4000 0025 0000 3155

Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

### Flujo de Prueba

1. Añade productos al carrito
2. Ve a `/cart`
3. Haz clic en "Checkout"
4. Usa una tarjeta de prueba
5. Completa el pago
6. Verifica que te redirige a `/checkout/success`
7. Verifica que el pedido se creó en la base de datos

## 6. Verificar Webhooks

```bash
# Ver logs de webhooks en tiempo real
stripe listen --forward-to localhost:3000/api/stripe

# En otra terminal, ejecuta tu app
npm run dev

# Probar un webhook manualmente
stripe trigger checkout.session.completed
```

## 7. Verificar en Base de Datos

Después de un pago exitoso, verifica:

```sql
-- Ver pedidos
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Ver items del pedido
SELECT * FROM order_items WHERE order_id = 'tu-order-id';

-- Ver pagos
SELECT * FROM payments ORDER BY paid_at DESC LIMIT 5;
```

## 🐛 Solución de Problemas

### Error: "No signature provided"

```bash
# Verifica que STRIPE_WEBHOOK_SECRET esté configurado
echo $STRIPE_WEBHOOK_SECRET
```

### Webhook no funciona

```bash
# Asegúrate de que Stripe CLI está corriendo
stripe listen --forward-to localhost:3000/api/stripe

# Verifica que el endpoint es accesible
curl -X POST http://localhost:3000/api/stripe
```

### Pedido no se crea

1. Verifica los logs del servidor
2. Revisa los logs de webhooks en Stripe Dashboard
3. Asegúrate de que el evento `checkout.session.completed` está configurado

## 📚 Documentación Completa

Para más detalles, consulta: `docs/STRIPE_INTEGRATION.md`

## ✅ Checklist

- [ ] Instalar `stripe` package
- [ ] Configurar variables de entorno
- [ ] Obtener claves de Stripe
- [ ] Configurar webhook (Stripe CLI o Dashboard)
- [ ] Probar con tarjeta de prueba
- [ ] Verificar creación de pedido
- [ ] Verificar webhook logs
- [ ] Probar fusión de carrito (invitado → usuario)
