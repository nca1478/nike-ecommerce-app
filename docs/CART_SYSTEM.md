# Sistema de Carrito - Documentación

## Descripción General

Sistema de carrito de compras totalmente funcional que soporta tanto usuarios autenticados como sesiones de invitado, con sincronización automática del estado en todas las páginas.

## Arquitectura

### Estado Global (Zustand)

- **Ubicación**: `lib/store/cart.store.ts`
- **Funcionalidades**:
    - Gestión del estado del carrito en el cliente
    - Sincronización automática con el servidor
    - Cálculo de totales y cantidades
    - Operaciones CRUD sobre artículos

### Server Actions

- **Ubicación**: `lib/actions/cart.ts`
- **Funciones principales**:
    - `getCart()` - Obtener todos los artículos del carrito
    - `addCartItem(productVariantId, quantity)` - Añadir producto al carrito
    - `updateCartItem(itemId, quantity)` - Actualizar cantidad
    - `removeCartItem(itemId)` - Eliminar artículo
    - `clearCart()` - Vaciar carrito
    - `mergeGuestCartToUser(guestId, userId)` - Migrar carrito de invitado a usuario

### Componentes

#### CartIcon

- **Ubicación**: `components/Cart/CartIcon.tsx`
- **Uso**: Integrado en el Navbar
- **Funcionalidad**: Muestra el número total de artículos en el carrito

#### CartItem

- **Ubicación**: `components/Cart/CartItem.tsx`
- **Funcionalidad**:
    - Muestra detalles del producto
    - Controles de cantidad (+/-)
    - Botón de eliminar
    - Responsive (móvil/escritorio)

#### CartList

- **Ubicación**: `components/Cart/CartList.tsx`
- **Funcionalidad**:
    - Lista todos los artículos del carrito
    - Carga inicial desde el servidor
    - Mensaje de carrito vacío

#### CartSummary

- **Ubicación**: `components/Cart/CartSummary.tsx`
- **Funcionalidad**:
    - Muestra subtotal, envío y total
    - Botón de checkout
    - Validación de autenticación antes del checkout

#### AddToCartButton

- **Ubicación**: `components/Cart/AddToCartButton.tsx`
- **Uso**: En páginas de producto
- **Funcionalidad**: Añadir productos al carrito con feedback visual

### Página del Carrito

- **Ubicación**: `app/(root)/cart/page.tsx`
- **Layout**: Grid responsive (2 columnas en desktop, 1 en móvil)
- **Secciones**:
    - Lista de artículos (izquierda)
    - Resumen y checkout (derecha)

## Flujo de Sesiones

### Usuario Invitado

1. Al añadir un producto al carrito, se crea automáticamente una sesión de invitado
2. La sesión se almacena en una cookie
3. El carrito se asocia con la sesión de invitado en la BD

### Usuario Autenticado

1. El carrito se asocia directamente con el ID del usuario
2. Persistencia completa entre sesiones

### Migración de Carrito (Invitado → Usuario)

1. Cuando un invitado se registra o inicia sesión
2. Se ejecuta automáticamente `mergeGuestCartToUser()`
3. Los artículos del carrito de invitado se fusionan con el carrito del usuario
4. Si hay artículos duplicados, se suman las cantidades
5. Se elimina la sesión de invitado

## Flujo de Checkout

1. Usuario hace clic en "Proceed to Checkout"
2. Se verifica si está autenticado
3. **Si NO está autenticado**:
    - Redirige a `/auth?redirect=/cart`
    - Después del login/registro, se fusiona el carrito
    - Redirige de vuelta al carrito
4. **Si está autenticado**:
    - Procede directamente al checkout

## Integración con Autenticación

### Archivo Modificado

- `lib/auth/actions.ts`
    - Función `mergeGuestCartWithUserCart()` actualizada
    - Integración con `mergeGuestCartToUser()` del sistema de carrito

### Hooks de Autenticación

- Al hacer `signUp()` o `signIn()`, se ejecuta automáticamente la migración del carrito

## Esquema de Base de Datos

### Tabla `carts`

```typescript
{
  id: uuid (PK)
  userId: uuid (FK → user.id) | nullable
  guestId: uuid (FK → guest.id) | nullable
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Tabla `cart_items`

```typescript
{
  id: uuid (PK)
  cartId: uuid (FK → carts.id)
  productVariantId: uuid (FK → product_variants.id)
  quantity: text (número como string)
}
```

## Uso en Componentes

### Añadir al Carrito

```tsx
import { AddToCartButton } from '@/components';

<AddToCartButton
    productVariantId={variant.id}
    productName={product.name}
    productImage={image.url}
    price={parseFloat(variant.price)}
    salePrice={variant.salePrice ? parseFloat(variant.salePrice) : undefined}
    size={size.name}
    color={color.name}
    category={category.name}
/>;
```

### Acceder al Estado del Carrito

```tsx
import { useCartStore } from '@/lib/store/cart.store';

const { items, getTotalItems, getSubtotal } = useCartStore();
```

## Características Responsive

- **Móvil**: Layout de una columna, imágenes de ancho completo
- **Tablet**: Layout adaptativo con mejor uso del espacio
- **Desktop**: Grid de 2 columnas (lista + resumen)

## Notificaciones

Se utiliza `react-hot-toast` para feedback visual:

- Producto añadido al carrito
- Producto eliminado
- Errores en operaciones

## Mejores Prácticas

1. **Siempre usar server actions** para operaciones de carrito
2. **Actualizar el estado global** después de operaciones exitosas
3. **Revalidar rutas** con `revalidatePath('/cart')` después de cambios
4. **Manejar estados de carga** para mejor UX
5. **Validar autenticación** antes del checkout

## Próximos Pasos

- [ ] Implementar página de checkout
- [ ] Añadir validación de stock antes de añadir al carrito
- [ ] Implementar cupones de descuento
- [ ] Añadir cálculo dinámico de envío según ubicación
- [ ] Implementar guardado de carritos abandonados
