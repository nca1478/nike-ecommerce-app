# ✅ Checklist de Integración de Stripe

## 📦 Instalación y Configuración

- [x] Instalar paquete `stripe`

    ```bash
    npm install stripe
    ```

- [x] Crear archivo `lib/stripe/client.ts`
    - [x] Inicializar cliente de Stripe
    - [x] Validar `STRIPE_SECRET_KEY`

- [x] Configurar variables de entorno en `.env.local`
    - [x] `STRIPE_SECRET_KEY`
    - [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - [x] `STRIPE_WEBHOOK_SECRET`
    - [x] `NEXT_PUBLIC_BASE_URL`

- [x] Actualizar `.env.example` con variables de Stripe

## 🔧 Server Actions

- [x] Crear `lib/actions/checkout.ts`
    - [x] Implementar `createStripeCheckoutSession()`
    - [x] Obtener carrito actual (usuario/invitado)
    - [x] Crear line items de Stripe
    - [x] Configurar URLs de éxito y cancelación
    - [x] Incluir metadata (cartId, userId, guestId)

- [x] Crear `lib/actions/orders.ts`
    - [x] Implementar `createOrder(stripeSessionId)`
    - [x] Verificar estado de pago
    - [x] Crear pedido en base de datos
    - [x] Crear items del pedido
    - [x] Registrar pago
    - [x] Vaciar carrito
    - [x] Implementar `getOrder(orderId)`
    - [x] Implementar `getUserOrders(userId)`

## 🎨 Componentes UI

- [x] Actualizar `components/Cart/CartSummary.tsx`
    - [x] Integrar con `useCartStore`
    - [x] Calcular subtotal, envío, impuestos
    - [x] Botón de checkout
    - [x] Manejar estado de carga
    - [x] Mostrar errores con toast
    - [x] Redirigir a Stripe Checkout

- [x] Crear `components/Cart/OrderSuccess.tsx`
    - [x] Mostrar confirmación de pedido
    - [x] Listar items comprados
    - [x] Mostrar total
    - [x] Botones de acción (continuar comprando, ver pedidos)
    - [x] Estado del pedido visual

## 🔔 Webhook

- [x] Crear `app/api/stripe/route.ts`
    - [x] Verificar firma del webhook
    - [x] Manejar `checkout.session.completed`
    - [x] Manejar `payment_intent.payment_failed`
    - [x] Manejar `payment_intent.succeeded`
    - [x] Logging de eventos
    - [x] Manejo de errores

## 📄 Páginas

- [x] Crear `app/(root)/checkout/success/page.tsx`
    - [x] Obtener session_id de query params
    - [x] Verificar sesión de Stripe
    - [x] Obtener pedido de la base de datos
    - [x] Renderizar `OrderSuccess`
    - [x] Manejar casos de error

## 🔄 Utilidades

- [x] Crear `lib/utils/mergeSessions.ts`
    - [x] Implementar `mergeGuestCartWithUserCart()`
    - [x] Fusionar items del carrito
    - [x] Sumar cantidades de items duplicados
    - [x] Eliminar carrito de invitado

## 📚 Documentación

- [x] Crear `docs/STRIPE_INTEGRATION.md`
    - [x] Descripción general
    - [x] Arquitectura
    - [x] Configuración
    - [x] Flujo de checkout
    - [x] Seguridad
    - [x] Manejo de precios
    - [x] Esquema de base de datos
    - [x] Testing
    - [x] Troubleshooting

- [x] Crear `docs/STRIPE_SETUP_QUICK.md`
    - [x] Guía rápida de configuración
    - [x] Obtener claves de Stripe
    - [x] Configurar webhook
    - [x] Tarjetas de prueba
    - [x] Verificación

- [x] Crear `docs/STRIPE_USAGE_EXAMPLES.md`
    - [x] Ejemplos de componentes
    - [x] Ejemplos de server actions
    - [x] Ejemplos de webhook
    - [x] Ejemplos de testing

## 🧪 Testing

### Configuración de Testing

- [ ] Configurar Stripe CLI
    ```bash
    stripe login
    stripe listen --forward-to localhost:3000/api/stripe
    ```

### Tests Funcionales

- [ ] Probar checkout como invitado
    - [ ] Añadir productos al carrito
    - [ ] Ir a checkout
    - [ ] Completar pago con tarjeta de prueba
    - [ ] Verificar redirección a página de éxito
    - [ ] Verificar creación de pedido en BD

- [ ] Probar checkout como usuario autenticado
    - [ ] Login
    - [ ] Añadir productos al carrito
    - [ ] Completar checkout
    - [ ] Verificar pedido en perfil

- [ ] Probar fusión de carritos
    - [ ] Añadir productos como invitado
    - [ ] Iniciar sesión
    - [ ] Verificar que items se mantienen

- [ ] Probar webhook
    - [ ] Verificar logs en Stripe CLI
    - [ ] Verificar creación de pedido
    - [ ] Verificar vaciado de carrito

### Tests de Tarjetas

- [ ] Tarjeta exitosa: `4242 4242 4242 4242`
- [ ] Tarjeta fallida: `4000 0000 0000 0002`
- [ ] Requiere autenticación: `4000 0025 0000 3155`

### Verificación de Base de Datos

- [ ] Verificar tabla `orders`

    ```sql
    SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
    ```

- [ ] Verificar tabla `order_items`

    ```sql
    SELECT * FROM order_items WHERE order_id = 'xxx';
    ```

- [ ] Verificar tabla `payments`

    ```sql
    SELECT * FROM payments ORDER BY paid_at DESC LIMIT 5;
    ```

- [ ] Verificar que carrito se vació
    ```sql
    SELECT * FROM cart_items WHERE cart_id = 'xxx';
    ```

## 🔐 Seguridad

- [x] Verificar firma de webhook
- [x] Validar estado de pago antes de crear pedido
- [x] Usar variables de entorno para claves secretas
- [x] No exponer claves secretas en el cliente
- [ ] Implementar rate limiting en webhook
- [ ] Implementar idempotencia en creación de pedidos
- [ ] Validar metadata del webhook

## 🚀 Producción

### Antes de Desplegar

- [ ] Cambiar a claves de producción de Stripe
    - [ ] `STRIPE_SECRET_KEY` (sk*live*...)
    - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk*live*...)

- [ ] Configurar webhook en producción
    - [ ] URL: `https://tu-dominio.com/api/stripe`
    - [ ] Eventos: `checkout.session.completed`, etc.
    - [ ] Copiar webhook secret de producción

- [ ] Actualizar `NEXT_PUBLIC_BASE_URL`
    - [ ] Usar URL de producción

- [ ] Verificar configuración de base de datos
    - [ ] Conexión segura (SSL)
    - [ ] Backups configurados

### Después de Desplegar

- [ ] Probar checkout en producción
- [ ] Verificar webhooks en Stripe Dashboard
- [ ] Monitorear logs de errores
- [ ] Configurar alertas para fallos de pago
- [ ] Verificar emails de confirmación (si aplica)

## 📊 Monitoreo

- [ ] Configurar logging de webhooks
- [ ] Monitorear tasa de éxito de pagos
- [ ] Configurar alertas para:
    - [ ] Webhooks fallidos
    - [ ] Pagos fallidos
    - [ ] Errores en creación de pedidos
- [ ] Dashboard de métricas:
    - [ ] Total de ventas
    - [ ] Tasa de conversión
    - [ ] Carritos abandonados

## 🐛 Troubleshooting

### Problemas Comunes

- [ ] Webhook no funciona
    - [ ] Verificar que Stripe CLI está corriendo
    - [ ] Verificar URL del webhook
    - [ ] Verificar eventos configurados

- [ ] Pedido no se crea
    - [ ] Verificar logs del webhook
    - [ ] Verificar estado de pago
    - [ ] Verificar metadata de la sesión

- [ ] Carrito no se vacía
    - [ ] Verificar que `createOrder` se ejecuta
    - [ ] Verificar que no hay errores en la transacción

- [ ] Fusión de carritos no funciona
    - [ ] Verificar cookie de sesión de invitado
    - [ ] Verificar que `mergeGuestCartWithUserCart` se llama

## 📈 Mejoras Futuras

- [ ] Implementar cupones de descuento
- [ ] Añadir soporte para múltiples monedas
- [ ] Implementar suscripciones
- [ ] Añadir Apple Pay / Google Pay
- [ ] Implementar reembolsos
- [ ] Añadir tracking de envío
- [ ] Implementar notificaciones por email
- [ ] Añadir historial de pedidos en perfil
- [ ] Implementar facturación automática

## ✨ Optimizaciones

- [ ] Implementar caché de sesiones de Stripe
- [ ] Optimizar queries de base de datos
- [ ] Implementar retry logic para webhooks
- [ ] Añadir índices a tablas de pedidos
- [ ] Implementar paginación en historial de pedidos
- [ ] Optimizar imágenes de productos
- [ ] Implementar lazy loading de componentes

---

## 📝 Notas

- Todos los precios se almacenan en céntimos (multiplicar por 100)
- Los webhooks deben ser idempotentes
- Siempre verificar el estado del pago antes de crear pedidos
- Mantener logs detallados para debugging
- Probar exhaustivamente antes de producción
