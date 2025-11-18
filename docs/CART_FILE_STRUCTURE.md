# Estructura de Archivos del Sistema de Carrito

## 📁 Árbol de Archivos

```
nike-ecommerce-app/
│
├── app/
│   └── (root)/
│       └── cart/
│           └── page.tsx                    ✨ Página principal del carrito
│
├── components/
│   ├── Cart/
│   │   ├── AddToCartButton.tsx            ✨ Botón para añadir productos
│   │   ├── CartIcon.tsx                   ✨ Icono del carrito en Navbar
│   │   ├── CartItem.tsx                   ✨ Tarjeta de producto en carrito
│   │   ├── CartList.tsx                   ✨ Lista de artículos
│   │   └── CartSummary.tsx                ✨ Resumen y checkout
│   │
│   ├── Shared/
│   │   └── Navbar.tsx                     🔄 Modificado (integración CartIcon)
│   │
│   └── index.ts                           🔄 Modificado (exportaciones)
│
├── lib/
│   ├── actions/
│   │   └── cart.ts                        ✨ Server actions del carrito
│   │
│   ├── auth/
│   │   └── actions.ts                     🔄 Modificado (migración de carrito)
│   │
│   ├── store/
│   │   └── cart.store.ts                  ✨ Estado global con Zustand
│   │
│   └── utils/
│       └── session.ts                     ✨ Utilidades de sesión
│
└── docs/
    ├── CART_SYSTEM.md                     ✨ Documentación técnica
    ├── CART_INTEGRATION_GUIDE.md          ✨ Guía de integración
    ├── CART_USAGE_EXAMPLES.md             ✨ Ejemplos de uso
    ├── CART_CHECKLIST.md                  ✨ Checklist de implementación
    └── CART_FILE_STRUCTURE.md             ✨ Este archivo

✨ = Archivo nuevo
🔄 = Archivo modificado
```

## 📄 Descripción de Archivos

### Páginas

#### `app/(root)/cart/page.tsx`

- Página principal del carrito
- Layout responsive con grid
- Integra CartList y CartSummary
- Metadata configurada

### Componentes

#### `components/Cart/AddToCartButton.tsx`

- Botón para añadir productos al carrito
- Maneja estados de carga
- Integración con store y server actions
- Notificaciones de éxito/error

#### `components/Cart/CartIcon.tsx`

- Icono del carrito con contador
- Se actualiza automáticamente
- Integrado en el Navbar
- Link a la página del carrito

#### `components/Cart/CartItem.tsx`

- Tarjeta de producto individual
- Controles de cantidad (+/-)
- Botón de eliminar
- Diseño responsive
- Muestra imagen, nombre, precio, talla

#### `components/Cart/CartList.tsx`

- Lista todos los artículos del carrito
- Carga inicial desde el servidor
- Mensaje de carrito vacío
- Integración con useCartStore

#### `components/Cart/CartSummary.tsx`

- Resumen del carrito (subtotal, envío, total)
- Botón de checkout
- Validación de autenticación
- Sticky en desktop

### Estado y Lógica

#### `lib/store/cart.store.ts`

- Store de Zustand para el carrito
- Tipos: `CartItemType`, `CartStore`
- Funciones:
    - `setItems()` - Establecer artículos
    - `addItem()` - Añadir artículo
    - `updateItem()` - Actualizar cantidad
    - `removeItem()` - Eliminar artículo
    - `clearCart()` - Vaciar carrito
    - `getTotalItems()` - Obtener total de artículos
    - `getSubtotal()` - Calcular subtotal

#### `lib/actions/cart.ts`

- Server actions para operaciones del carrito
- Funciones principales:
    - `getCart()` - Obtener carrito con detalles
    - `addCartItem()` - Añadir producto
    - `updateCartItem()` - Actualizar cantidad
    - `removeCartItem()` - Eliminar artículo
    - `clearCart()` - Vaciar carrito
    - `mergeGuestCartToUser()` - Migrar carrito
- Gestión automática de sesiones
- Revalidación de rutas

#### `lib/utils/session.ts`

- Utilidades para gestión de sesiones
- Función `ensureSession()` para crear sesión si no existe

### Integraciones

#### `lib/auth/actions.ts` (Modificado)

- Función `mergeGuestCartWithUserCart()` actualizada
- Integración con `mergeGuestCartToUser()`
- Llamada automática en `signUp()` y `signIn()`

#### `components/Shared/Navbar.tsx` (Modificado)

- Integración del `CartIcon`
- Versión desktop y móvil
- Actualización automática del contador

#### `components/index.ts` (Modificado)

- Exportaciones de componentes del carrito:
    - `CartIcon`
    - `CartItem`
    - `CartList`
    - `CartSummary`
    - `AddToCartButton`

### Documentación

#### `docs/CART_SYSTEM.md`

- Descripción general del sistema
- Arquitectura y componentes
- Flujo de sesiones
- Esquema de base de datos
- Uso en componentes

#### `docs/CART_INTEGRATION_GUIDE.md`

- Guía paso a paso de integración
- Ejemplos de código
- Validaciones importantes
- Manejo de sesiones
- Flujo de checkout
- Troubleshooting

#### `docs/CART_USAGE_EXAMPLES.md`

- Ejemplo 1: Página de producto completa
- Ejemplo 2: Selector de variantes con carrito
- Ejemplo 3: Quick add desde grid
- Ejemplo 4: Mini cart dropdown
- Ejemplo 5: Carrito con cupones
- Ejemplo 6: Persistencia del carrito
- Ejemplo 7: Carrito con animaciones

#### `docs/CART_CHECKLIST.md`

- Lista de tareas completadas
- Funcionalidades implementadas
- Tareas opcionales
- Verificación final
- Próximos pasos

## 🔗 Dependencias entre Archivos

```
CartIcon (Navbar)
    ↓
useCartStore ← CartList → CartItem
    ↓              ↓
cart.store.ts  CartSummary
    ↓              ↓
cart.ts (server actions)
    ↓
auth/actions.ts
```

## 📊 Estadísticas

- **Archivos nuevos**: 11
- **Archivos modificados**: 3
- **Líneas de código**: ~1,500+
- **Componentes**: 5
- **Server actions**: 6
- **Documentos**: 5

## 🎯 Puntos de Entrada

### Para Desarrolladores

1. **Añadir al carrito**: `components/Cart/AddToCartButton.tsx`
2. **Ver carrito**: `app/(root)/cart/page.tsx`
3. **Estado global**: `lib/store/cart.store.ts`
4. **Server actions**: `lib/actions/cart.ts`

### Para Usuarios

1. **Añadir producto**: Botón "Add to Cart" en página de producto
2. **Ver carrito**: Click en "My Cart" en Navbar
3. **Modificar cantidad**: Botones +/- en cada artículo
4. **Eliminar producto**: Icono de papelera en cada artículo
5. **Checkout**: Botón "Proceed to Checkout" en resumen

## 🔍 Búsqueda Rápida

### Buscar por Funcionalidad

- **Añadir al carrito**: `AddToCartButton.tsx`, `cart.ts` (addCartItem)
- **Actualizar cantidad**: `CartItem.tsx`, `cart.ts` (updateCartItem)
- **Eliminar producto**: `CartItem.tsx`, `cart.ts` (removeCartItem)
- **Ver carrito**: `page.tsx`, `CartList.tsx`
- **Checkout**: `CartSummary.tsx`
- **Migración**: `auth/actions.ts`, `cart.ts` (mergeGuestCartToUser)

### Buscar por Tipo

- **Componentes UI**: `components/Cart/`
- **Lógica de negocio**: `lib/actions/cart.ts`
- **Estado**: `lib/store/cart.store.ts`
- **Páginas**: `app/(root)/cart/`
- **Documentación**: `docs/CART_*.md`

## 📝 Convenciones de Nombres

### Componentes

- PascalCase: `CartIcon`, `AddToCartButton`
- Sufijo descriptivo: `Button`, `Icon`, `List`, `Summary`

### Funciones

- camelCase: `addCartItem`, `updateCartItem`
- Prefijos estándar: `get`, `add`, `update`, `remove`, `clear`

### Archivos

- kebab-case para docs: `cart-system.md`
- PascalCase para componentes: `CartIcon.tsx`
- camelCase para utils: `cart.store.ts`

## 🚀 Próximos Archivos a Crear

Si decides extender el sistema:

```
app/
└── (root)/
    └── checkout/
        └── page.tsx                    # Página de checkout

components/
└── Checkout/
    ├── CheckoutForm.tsx               # Formulario de checkout
    ├── PaymentMethod.tsx              # Métodos de pago
    └── OrderSummary.tsx               # Resumen del pedido

lib/
├── actions/
│   ├── checkout.ts                    # Actions de checkout
│   └── payment.ts                     # Actions de pago
└── store/
    └── checkout.store.ts              # Estado de checkout
```
