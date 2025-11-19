# 📦 Sistema de Historial de Pedidos

## 🎯 Descripción General

Sistema completo de historial de pedidos que permite a los usuarios ver todos sus pedidos, revisar detalles, descargar facturas y reordenar productos.

## ✨ Características Implementadas

### 1. Listado de Pedidos (`/orders`)

- ✅ Vista de todos los pedidos del usuario
- ✅ Ordenados por fecha (más recientes primero)
- ✅ Badges de estado visual (Pendiente, Pagado, Enviado, Entregado, Cancelado)
- ✅ Información resumida de cada pedido
- ✅ Imagen del primer producto
- ✅ Contador de artículos
- ✅ Total del pedido
- ✅ Fecha de creación
- ✅ Estado vacío con CTA a productos

### 2. Detalle de Pedido (`/orders/[orderId]`)

- ✅ Información completa del pedido
- ✅ Timeline visual del estado
- ✅ Lista de productos con imágenes
- ✅ Detalles de variantes (talla, color)
- ✅ Dirección de envío
- ✅ Resumen de costos (subtotal, envío, impuestos, total)
- ✅ Botón de reordenar
- ✅ Botón de descargar factura
- ✅ Enlace a soporte

### 3. Estados de Pedido

```typescript
- pending: Pedido Recibido
- paid: Pago Confirmado
- shipped: En Camino
- delivered: Entregado
- cancelled: Cancelado
```

### 4. Timeline Visual

- ✅ Progreso visual del pedido
- ✅ Indicadores de estado completado
- ✅ Estado actual resaltado
- ✅ Manejo especial para pedidos cancelados

### 5. Funcionalidad de Reordenar

- ✅ Agregar todos los productos del pedido al carrito
- ✅ Notificación de éxito
- ✅ Redirección automática al carrito
- ✅ Manejo de errores

### 6. Descarga de Factura (PDF)

- ✅ Generación de factura en formato PDF
- ✅ Información completa del pedido
- ✅ Detalles de productos
- ✅ Dirección de envío
- ✅ Resumen de costos
- ✅ Diseño profesional
- ✅ Descarga automática

## 📁 Estructura de Archivos

```
nike-ecommerce-app/
├── app/
│   ├── (root)/
│   │   └── orders/
│   │       ├── page.tsx                    # Listado de pedidos
│   │       └── [orderId]/
│   │           └── page.tsx                # Detalle de pedido
│   └── api/
│       └── orders/
│           └── [orderId]/
│               └── invoice/
│                   └── route.ts            # API para generar PDF
│
├── components/
│   └── Orders/
│       ├── OrdersList.tsx                  # Lista de pedidos
│       ├── OrderDetails.tsx                # Detalle completo
│       ├── OrderStatusBadge.tsx            # Badge de estado
│       ├── OrderTimeline.tsx               # Timeline visual
│       ├── ReorderButton.tsx               # Botón reordenar
│       └── DownloadInvoiceButton.tsx       # Botón descargar
│
├── lib/
│   ├── actions/
│   │   └── orders.ts                       # Server actions (ya existía)
│   └── utils/
│       └── pdf.ts                          # Generador de PDF
│
└── docs/
    └── ORDER_HISTORY.md                    # Esta documentación
```

## 🔧 Server Actions

### `getUserOrders(userId: string)`

Obtiene todos los pedidos de un usuario.

```typescript
const result = await getUserOrders(user.id);

if (result.success && result.data) {
    // result.data contiene array de pedidos
}
```

### `getOrder(orderId: string)`

Obtiene un pedido específico con todos sus detalles.

```typescript
const result = await getOrder(orderId);

if (result.success && result.data) {
    const { order, items } = result.data;
}
```

## 🎨 Componentes

### OrdersList

Lista de pedidos con información resumida.

```tsx
import { OrdersList } from '@/components/Orders/OrdersList';

<OrdersList orders={orders} />;
```

**Props:**

- `orders`: Array de pedidos con items

### OrderDetails

Vista detallada de un pedido.

```tsx
import { OrderDetails } from '@/components/Orders/OrderDetails';

<OrderDetails order={order} items={items} />;
```

**Props:**

- `order`: Objeto de pedido
- `items`: Array de items con detalles

### OrderStatusBadge

Badge visual del estado del pedido.

```tsx
import { OrderStatusBadge } from '@/components/Orders/OrderStatusBadge';

<OrderStatusBadge status="paid" />;
```

**Props:**

- `status`: Estado del pedido (pending, paid, shipped, delivered, cancelled)

### OrderTimeline

Timeline visual del progreso del pedido.

```tsx
import { OrderTimeline } from '@/components/Orders/OrderTimeline';

<OrderTimeline status="shipped" />;
```

**Props:**

- `status`: Estado actual del pedido

### ReorderButton

Botón para volver a pedir los productos.

```tsx
import { ReorderButton } from '@/components/Orders/ReorderButton';

<ReorderButton items={items} />;
```

**Props:**

- `items`: Array de items del pedido

### DownloadInvoiceButton

Botón para descargar la factura en PDF.

```tsx
import { DownloadInvoiceButton } from '@/components/Orders/DownloadInvoiceButton';

<DownloadInvoiceButton orderId={orderId} orderNumber={orderNumber} />;
```

**Props:**

- `orderId`: ID del pedido
- `orderNumber`: Número corto del pedido (para el nombre del archivo)

## 🔐 Seguridad

### Protección de Rutas

Las páginas de pedidos están protegidas y requieren autenticación:

```typescript
const user = await getCurrentUser();

if (!user) {
    redirect('/sign-in?redirect=/orders');
}
```

### Verificación de Propiedad

Se verifica que el pedido pertenezca al usuario:

```typescript
if (result.data.order.userId !== user.id) {
    redirect('/orders');
}
```

### API de Factura

La API verifica autenticación y propiedad antes de generar el PDF:

```typescript
// Verificar autenticación
if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}

// Verificar propiedad
if (result.data.order.userId !== user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
}
```

## 🎯 Flujo de Usuario

### 1. Ver Historial de Pedidos

```
Usuario autenticado → Click "Mis Pedidos" en Navbar
    ↓
Carga /orders
    ↓
getUserOrders(userId)
    ↓
Muestra lista de pedidos con OrdersList
```

### 2. Ver Detalle de Pedido

```
Click en un pedido
    ↓
Navega a /orders/[orderId]
    ↓
getOrder(orderId)
    ↓
Verifica propiedad
    ↓
Muestra OrderDetails con timeline, productos, dirección
```

### 3. Descargar Factura

```
Click "Descargar Factura"
    ↓
Fetch /api/orders/[orderId]/invoice
    ↓
Verifica autenticación y propiedad
    ↓
generateInvoicePDF()
    ↓
Descarga automática del PDF
```

### 4. Reordenar

```
Click "Volver a Pedir"
    ↓
Agrega productos al carrito
    ↓
Muestra notificación de éxito
    ↓
Redirige a /cart
```

## 📊 Datos Mostrados

### En el Listado

- Número de pedido (primeros 8 caracteres del UUID)
- Imagen del primer producto
- Nombre del producto + contador de productos adicionales
- Total de artículos
- Estado con badge visual
- Fecha de creación
- Total del pedido

### En el Detalle

- Número completo del pedido
- Fecha y hora de creación
- Estado con badge
- Timeline de progreso
- Lista completa de productos con:
    - Imagen
    - Nombre
    - Talla y color
    - Cantidad
    - Precio unitario
    - Total por producto
- Dirección de envío completa
- Resumen financiero:
    - Subtotal
    - Envío (gratis)
    - Impuestos (10%)
    - Total

## 🎨 Diseño y UX

### Colores de Estado

```typescript
pending:   bg-yellow-100 text-yellow-800  (Amarillo)
paid:      bg-green-100 text-green-800    (Verde)
shipped:   bg-blue-100 text-blue-800      (Azul)
delivered: bg-purple-100 text-purple-800  (Morado)
cancelled: bg-red-100 text-red-800        (Rojo)
```

### Iconos

- `Clock` - Pendiente
- `CheckCircle` - Pagado
- `Truck` - Enviado
- `Package` - Entregado
- `XCircle` - Cancelado

### Responsive

- ✅ Mobile-first design
- ✅ Grid adaptativo (1 columna en móvil, 3 en desktop)
- ✅ Imágenes optimizadas
- ✅ Botones táctiles grandes

## 🚀 Mejoras Futuras

### Corto Plazo

- [ ] Tracking de envío en tiempo real
- [ ] Notificaciones push de cambio de estado
- [ ] Filtros de pedidos (por estado, fecha)
- [ ] Búsqueda de pedidos
- [ ] Paginación para muchos pedidos

### Medio Plazo

- [ ] Sistema de devoluciones
- [ ] Cancelación de pedidos (si está en pending)
- [ ] Modificación de dirección (antes de envío)
- [ ] Chat de soporte integrado
- [ ] Calificación de productos después de entrega

### Largo Plazo

- [ ] Suscripciones y pedidos recurrentes
- [ ] Programa de puntos por compra
- [ ] Historial de devoluciones
- [ ] Análisis de compras (productos favoritos, gasto total)
- [ ] Recomendaciones basadas en historial

## 📝 Notas de Implementación

### Generación de PDF

Actualmente, el PDF se genera con HTML simple. Para producción, se recomienda:

```bash
# Instalar puppeteer para PDFs reales
npm install puppeteer

# O usar pdfkit
npm install pdfkit
```

Ejemplo con puppeteer:

```typescript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(html);
const pdf = await page.pdf({ format: 'A4' });
await browser.close();

return pdf;
```

### Reordenar

La funcionalidad de reordenar actualmente es básica. Para producción:

1. Verificar disponibilidad de stock
2. Verificar que las variantes aún existen
3. Manejar productos descontinuados
4. Sugerir alternativas si no hay stock

### Performance

Para muchos pedidos, considerar:

- Paginación en el backend
- Infinite scroll
- Caché de pedidos recientes
- Lazy loading de imágenes

## ✅ Testing

### Casos de Prueba

1. **Usuario sin pedidos**
    - Debe mostrar estado vacío
    - Debe mostrar CTA a productos

2. **Usuario con pedidos**
    - Debe mostrar lista ordenada por fecha
    - Debe mostrar información correcta

3. **Detalle de pedido**
    - Debe mostrar todos los datos
    - Timeline debe reflejar estado correcto
    - Botones deben funcionar

4. **Seguridad**
    - Usuario no autenticado → redirect a login
    - Pedido de otro usuario → redirect a /orders
    - API sin auth → 401
    - API pedido ajeno → 403

5. **Descarga de factura**
    - Debe generar PDF
    - Debe descargar automáticamente
    - Debe tener nombre correcto

6. **Reordenar**
    - Debe agregar productos al carrito
    - Debe mostrar notificación
    - Debe redirigir a carrito

## 📚 Referencias

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Puppeteer PDF](https://pptr.dev/api/puppeteer.page.pdf)
- [React Hot Toast](https://react-hot-toast.com/)

---

**Versión:** 1.0.0  
**Fecha:** Noviembre 2025  
**Estado:** ✅ Implementado y Funcional
