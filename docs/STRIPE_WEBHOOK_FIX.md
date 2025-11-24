# Solución: Webhook de Stripe no procesa pagos

## Problema

El contenedor de Stripe CLI no puede conectarse al servidor Next.js y las órdenes no se registran en la base de datos.

## Cambios Realizados

### 1. Docker Compose

- ✅ Corregida la ruta del webhook: `/api/stripe` (antes era `/api/webhooks/stripe`)
- ✅ Removido `network_mode: host` (no funciona bien en Windows)
- ✅ Agregada red bridge personalizada
- ✅ Agregado `extra_hosts` para resolver `host.docker.internal`
- ✅ Agregado `--log-level debug` para mejor diagnóstico

### 2. Webhook Handler

- ✅ Agregado logging detallado con emojis para facilitar debugging
- ✅ Logs en cada paso del proceso de verificación y creación de orden

## Pasos para Solucionar

### 1. Detener contenedores actuales

```bash
docker-compose down
```

### 2. Limpiar y reconstruir

```bash
docker-compose up -d --force-recreate
```

### 3. Verificar logs del Stripe CLI

```bash
docker logs -f nike-ecommerce-stripe
```

Deberías ver:

```
Ready! You are using Stripe API Version [2019-12-03]
Waiting for events...
```

### 4. Obtener el Webhook Secret

Cuando el contenedor inicie, verás un mensaje como:

```
Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**IMPORTANTE**: Copia este secret y actualiza tu `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 5. Reiniciar tu servidor Next.js

```bash
npm run dev
```

### 6. Probar el webhook

Realiza una compra de prueba y verifica los logs:

**En el servidor Next.js** deberías ver:

```
🔔 Webhook received
📝 Signature present: true
🔑 Webhook secret configured
✅ Event verified: checkout.session.completed
💳 Checkout session completed: cs_test_xxxxx
📦 Metadata: { cartId: 'xxx', userId: 'xxx' }
✅ Order created successfully: order-id-xxx
✅ Webhook processed successfully
```

**En el contenedor de Stripe** deberías ver:

```
--> POST http://host.docker.internal:3000/api/stripe [200]
```

## Verificar en la Base de Datos

```sql
-- Ver órdenes creadas
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Ver items de órdenes
SELECT * FROM order_items ORDER BY created_at DESC LIMIT 10;

-- Ver pagos
SELECT * FROM payments ORDER BY paid_at DESC LIMIT 5;
```

## Troubleshooting

### Error: "Connection refused"

- Asegúrate de que tu servidor Next.js esté corriendo en el puerto 3000
- Verifica que no haya firewall bloqueando la conexión

### Error: "Invalid signature"

- El `STRIPE_WEBHOOK_SECRET` en `.env` debe coincidir con el que muestra el contenedor
- Reinicia el servidor Next.js después de actualizar el `.env`

### Error: "Carrito no encontrado"

- Verifica que el checkout incluya `cartId` y `userId` en los metadata
- Revisa el archivo `lib/actions/checkout.ts`

### No se crean órdenes

- Revisa los logs del servidor Next.js
- Verifica que la base de datos esté corriendo
- Comprueba que las tablas existan: `orders`, `order_items`, `payments`

## Alternativa: Stripe CLI Local (sin Docker)

Si sigues teniendo problemas con Docker, puedes usar Stripe CLI directamente:

1. Instala Stripe CLI: https://stripe.com/docs/stripe-cli
2. Autentícate: `stripe login`
3. Ejecuta el webhook:

```bash
stripe listen --forward-to localhost:3000/api/stripe
```

## Notas Importantes

- El webhook secret cambia cada vez que reinicias el contenedor de Stripe CLI
- Siempre actualiza el `.env` con el nuevo secret después de reiniciar
- En producción, usa el webhook secret de tu dashboard de Stripe
