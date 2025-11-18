# Guía de Integración del Carrito

## Integración en Página de Producto

### Ejemplo Completo

Para integrar el botón "Add to Cart" en la página de detalles del producto, sigue estos pasos:

#### 1. Importar el Componente

```tsx
import { AddToCartButton } from '@/components';
```

#### 2. Preparar los Datos

Necesitas tener disponible la siguiente información:

- `productVariantId` - ID de la variante seleccionada
- `productName` - Nombre del producto
- `productImage` - URL de la imagen principal
- `price` - Precio base
- `salePrice` - Precio de oferta (opcional)
- `size` - Talla seleccionada
- `color` - Color seleccionado
- `category` - Categoría del producto

#### 3. Implementar el Botón

```tsx
'use client';

import { useState } from 'react';
import { AddToCartButton } from '@/components';

export function ProductActions({
    product,
    variants,
    sizes,
}: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);

    // Encontrar la variante específica según color y talla
    const currentVariant = variants.find(
        (v) =>
            v.colorId === selectedVariant.colorId && v.sizeId === selectedSize,
    );

    return (
        <div className="space-y-6">
            {/* Selector de Color */}
            <ColorVariantPicker
                variants={variants}
                onSelect={setSelectedVariant}
            />

            {/* Selector de Talla */}
            <SizePicker
                sizes={sizes}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
            />

            {/* Botón Añadir al Carrito */}
            <AddToCartButton
                productVariantId={currentVariant?.id || ''}
                productName={product.name}
                productImage={selectedVariant.images[0] || ''}
                price={parseFloat(currentVariant?.price || '0')}
                salePrice={
                    currentVariant?.salePrice
                        ? parseFloat(currentVariant.salePrice)
                        : undefined
                }
                size={sizes.find((s) => s.id === selectedSize)?.name || ''}
                color={selectedVariant.colorName}
                category={product.category.name}
                disabled={!selectedSize || !currentVariant}
            />
        </div>
    );
}
```

### Validaciones Importantes

#### 1. Validar Talla Seleccionada

```tsx
const isSizeSelected = selectedSize !== null;
const isVariantAvailable =
    currentVariant && parseInt(currentVariant.inStock) > 0;

<AddToCartButton
    // ... otros props
    disabled={!isSizeSelected || !isVariantAvailable}
/>;
```

#### 2. Mostrar Mensaje de Stock

```tsx
{
    !isVariantAvailable && selectedSize && (
        <p className="text-red text-caption">
            This size is currently out of stock
        </p>
    );
}
```

#### 3. Validar Antes de Añadir

```tsx
const handleAddToCart = () => {
    if (!selectedSize) {
        toast.error('Please select a size');
        return;
    }

    if (!currentVariant) {
        toast.error('Selected variant is not available');
        return;
    }

    // Proceder con añadir al carrito
};
```

## Integración en Navbar

El `CartIcon` ya está integrado en el Navbar. Se actualiza automáticamente cuando se añaden o eliminan productos.

### Código del Navbar

```tsx
import { CartIcon } from '@/components/Cart/CartIcon';

// En el componente Navbar
<div className="hidden md:flex items-center space-x-6">
    {/* ... otros elementos ... */}
    <CartIcon />
</div>;
```

## Manejo de Sesiones de Invitado

### Creación Automática

El sistema crea automáticamente una sesión de invitado cuando:

1. Un usuario no autenticado añade un producto al carrito
2. No existe una sesión de invitado previa válida

### Código Interno (Referencia)

```tsx
// En lib/actions/cart.ts
async function getOrCreateCart() {
    const user = await getCurrentUser();

    if (user) {
        // Lógica para usuario autenticado
    } else {
        // Crear sesión de invitado si no existe
        let guestSessionToken = await getGuestSessionCookie();

        if (!guestSessionToken) {
            const result = await createGuestSession();
            guestSessionToken = result.data?.sessionToken;
        }

        // Crear o recuperar carrito de invitado
    }
}
```

## Flujo de Checkout con Autenticación

### Implementación en CartSummary

```tsx
const handleCheckout = async () => {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        // Redirigir a login con parámetro de redirección
        router.push('/auth?redirect=/cart');
    } else {
        // Proceder al checkout
        router.push('/checkout');
    }
};
```

### Página de Autenticación

Asegúrate de que tu página de autenticación maneje el parámetro `redirect`:

```tsx
// En app/(auth)/auth/page.tsx
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const redirectTo = searchParams.get('redirect') || '/';

    const handleSuccess = () => {
        router.push(redirectTo);
    };

    return <AuthForm onSuccess={handleSuccess} />;
}
```

## Sincronización del Estado

### Actualizar Estado Después de Operaciones

```tsx
import { useCartStore } from '@/lib/store/cart.store';

const { addItem, updateItem, removeItem } = useCartStore();

// Después de añadir al carrito
const result = await addCartItem(variantId, quantity);
if (result.success) {
    addItem({
        id: result.data.itemId,
        // ... otros datos
    });
}

// Después de actualizar cantidad
const result = await updateCartItem(itemId, newQuantity);
if (result.success) {
    updateItem(itemId, newQuantity);
}

// Después de eliminar
const result = await removeCartItem(itemId);
if (result.success) {
    removeItem(itemId);
}
```

## Notificaciones de Usuario

### Configurar Toast

Asegúrate de tener el `Toaster` en tu layout:

```tsx
// En app/layout.tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#111',
                            color: '#fff',
                        },
                    }}
                />
            </body>
        </html>
    );
}
```

### Usar Notificaciones

```tsx
import toast from 'react-hot-toast';

// Éxito
toast.success('Product added to cart');

// Error
toast.error('Failed to add product');

// Personalizado
toast('Item removed', {
    icon: '🗑️',
});
```

## Optimizaciones de Rendimiento

### 1. Lazy Loading del Carrito

```tsx
import dynamic from 'next/dynamic';

const CartIcon = dynamic(
    () =>
        import('@/components/Cart/CartIcon').then((mod) => ({
            default: mod.CartIcon,
        })),
    { ssr: false },
);
```

### 2. Debounce en Actualización de Cantidad

```tsx
import { useCallback } from 'react';
import { debounce } from 'lodash';

const debouncedUpdate = useCallback(
    debounce(async (itemId: string, quantity: number) => {
        await updateCartItem(itemId, quantity);
    }, 500),
    [],
);
```

### 3. Optimistic Updates

```tsx
const handleUpdateQuantity = async (newQuantity: number) => {
    // Actualizar UI inmediatamente
    updateItem(id, newQuantity);

    // Sincronizar con servidor
    const result = await updateCartItem(id, newQuantity);

    if (!result.success) {
        // Revertir si falla
        updateItem(id, quantity);
        toast.error('Failed to update quantity');
    }
};
```

## Testing

### Escenarios de Prueba

1. **Usuario Invitado**
    - Añadir producto sin estar autenticado
    - Verificar creación de sesión de invitado
    - Verificar persistencia del carrito

2. **Usuario Autenticado**
    - Añadir producto estando autenticado
    - Verificar asociación con userId

3. **Migración de Carrito**
    - Añadir productos como invitado
    - Iniciar sesión
    - Verificar que los productos se mantienen

4. **Operaciones CRUD**
    - Añadir producto
    - Actualizar cantidad
    - Eliminar producto
    - Vaciar carrito

5. **Checkout**
    - Intentar checkout sin autenticación
    - Verificar redirección a login
    - Verificar retorno al carrito después del login

## Troubleshooting

### Problema: El carrito no se actualiza en el Navbar

**Solución**: Asegúrate de llamar a `setItems()` después de operaciones exitosas:

```tsx
const result = await addCartItem(variantId, 1);
if (result.success) {
    const cartResult = await getCart();
    if (cartResult.success && cartResult.data) {
        setItems(cartResult.data);
    }
}
```

### Problema: Sesión de invitado no se crea

**Solución**: Verifica que la tabla `guest` existe y tiene los campos correctos:

```sql
SELECT * FROM guest LIMIT 1;
```

### Problema: Carrito no se migra después del login

**Solución**: Verifica que `mergeGuestCartWithUserCart()` se llama en `signIn()` y `signUp()`:

```tsx
// En lib/auth/actions.ts
const guestSessionToken = await getGuestSessionCookie();
if (guestSessionToken) {
    await mergeGuestCartWithUserCart(guestSessionToken, result.user.id);
}
```
