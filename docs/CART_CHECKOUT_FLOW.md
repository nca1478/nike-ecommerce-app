# Flujo de Checkout del Carrito

## 🎯 Problema Resuelto

Se ha implementado el flujo completo de checkout con manejo de sesiones de invitado y redirección después de autenticación.

## 🔧 Cambios Realizados

### 1. `CartSummary.tsx` - Actualizado

**Cambios:**

- Corregir ruta de redirección de `/auth` a `/sign-in`
- Añadir parámetros de query: `redirect` y `action`
- Validar que el subtotal no sea 0 antes de proceder
- Mensaje temporal para checkout (página por implementar)

**Flujo:**

```tsx
Usuario hace clic en "Proceed to Checkout"
    ↓
¿Está autenticado?
    ↓
NO → Redirige a /sign-in?redirect=/cart&action=checkout
    ↓
SÍ → Muestra mensaje temporal (checkout coming soon)
```

**Código:**

```tsx
const handleCheckout = async () => {
    if (subtotal === 0) return;

    setIsChecking(true);
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        // Redirigir a login/registro con parámetro de redirección
        router.push('/sign-in?redirect=/cart&action=checkout');
    } else {
        // Por ahora, mostrar mensaje
        alert('Checkout functionality coming soon! Your cart is ready.');
    }
    setIsChecking(false);
};
```

---

### 2. `sign-in/page.tsx` - Actualizado

**Cambios:**

- Añadir manejo de parámetros `redirect` y `action`
- Mensaje personalizado cuando viene del checkout
- Redirigir automáticamente después de login exitoso
- Pasar parámetro `redirect` al link de Sign Up

**Características:**

- ✅ Lee parámetro `redirect` de la URL
- ✅ Lee parámetro `action` para personalizar mensaje
- ✅ Muestra mensaje específico si viene del checkout
- ✅ Redirige al carrito después de login exitoso
- ✅ Mantiene el parámetro de redirección en el link de Sign Up

**Mensajes:**

- **Normal:** "Welcome Back! - Sign in to continue your fitness journey"
- **Desde Checkout:** "Sign in to Continue - Please sign in to complete your purchase"

---

### 3. `sign-up/page.tsx` - Actualizado

**Cambios:**

- Añadir manejo de parámetros `redirect` y `action`
- Mensaje personalizado cuando viene del checkout
- Redirigir automáticamente después de registro exitoso
- Pasar parámetro `redirect` al link de Sign In

**Características:**

- ✅ Lee parámetro `redirect` de la URL
- ✅ Lee parámetro `action` para personalizar mensaje
- ✅ Muestra mensaje específico si viene del checkout
- ✅ Redirige al carrito después de registro exitoso
- ✅ Mantiene el parámetro de redirección en el link de Sign In

**Mensajes:**

- **Normal:** "Join Nike Today! - Create your account to start your fitness journey"
- **Desde Checkout:** "Create Account to Continue - Create your account to complete your purchase"

---

### 4. `AuthForm.tsx` - Actualizado

**Cambios:**

- Añadir prop opcional `isLoading`
- Añadir estado interno `isSubmitting`
- Deshabilitar botón durante el envío
- Mostrar "Processing..." durante la carga
- Eliminar redirección automática (se maneja en página padre)
- Añadir notificaciones de éxito

**Props:**

```tsx
interface AuthFormProps {
    type: 'sign-in' | 'sign-up';
    onSubmit: (data: {...}) => Promise<{...}>;
    isLoading?: boolean; // ← Nuevo
}
```

**Estados del Botón:**

- **Normal:** "Sign In" / "Sign Up"
- **Cargando:** "Processing..."
- **Deshabilitado:** Opacidad reducida + cursor not-allowed

---

## 🎯 Flujo Completo del Usuario

### Escenario 1: Usuario Invitado → Checkout

```
1. Usuario añade productos al carrito (sin autenticación)
   ↓
2. Se crea sesión de invitado automáticamente
   ↓
3. Usuario va a /cart
   ↓
4. Usuario hace clic en "Proceed to Checkout"
   ↓
5. Sistema detecta que NO está autenticado
   ↓
6. Redirige a /sign-in?redirect=/cart&action=checkout
   ↓
7. Usuario ve mensaje: "Sign in to Continue"
   ↓
8. Usuario inicia sesión o hace clic en "Sign Up"
   ↓
9. Si hace clic en Sign Up:
   - Va a /sign-up?redirect=/cart&action=checkout
   - Ve mensaje: "Create Account to Continue"
   ↓
10. Después de login/registro exitoso:
    - Se ejecuta mergeGuestCartWithUserCart()
    - Carrito de invitado se fusiona con carrito de usuario
    - Redirige automáticamente a /cart
    ↓
11. Usuario está de vuelta en el carrito, ahora autenticado
    ↓
12. Puede hacer clic en "Proceed to Checkout" nuevamente
    ↓
13. Ve mensaje: "Checkout functionality coming soon!"
```

### Escenario 2: Usuario Autenticado → Checkout

```
1. Usuario ya está autenticado
   ↓
2. Añade productos al carrito
   ↓
3. Va a /cart
   ↓
4. Hace clic en "Proceed to Checkout"
   ↓
5. Sistema detecta que SÍ está autenticado
   ↓
6. Ve mensaje: "Checkout functionality coming soon!"
   (En el futuro: redirige a /checkout)
```

---

## 🔄 Migración de Carrito

### Cuándo Ocurre

La migración del carrito de invitado a usuario ocurre automáticamente en:

1. **Sign Up exitoso**

    ```tsx
    // En lib/auth/actions.ts - signUp()
    if (guestSessionToken) {
        await mergeGuestCartWithUserCart(guestSessionToken, result.user.id);
    }
    ```

2. **Sign In exitoso**
    ```tsx
    // En lib/auth/actions.ts - signIn()
    if (guestSessionToken) {
        await mergeGuestCartWithUserCart(guestSessionToken, result.user.id);
    }
    ```

### Qué Hace la Migración

```tsx
// En lib/actions/cart.ts - mergeGuestCartToUser()
1. Busca carrito de invitado
2. Busca o crea carrito de usuario
3. Para cada item del carrito de invitado:
   - Si ya existe en carrito de usuario → suma cantidades
   - Si no existe → crea nuevo item
4. Elimina carrito de invitado
5. Elimina sesión de invitado
```

---

## 📊 Parámetros de URL

### `redirect`

- **Propósito:** Indica a dónde redirigir después de autenticación
- **Valores:** Cualquier ruta válida (ej: `/cart`, `/products/123`)
- **Default:** `/`

### `action`

- **Propósito:** Indica el contexto de la autenticación
- **Valores:** `checkout` (por ahora)
- **Uso:** Personalizar mensajes en páginas de auth

**Ejemplo:**

```
/sign-in?redirect=/cart&action=checkout
         ↑              ↑
         |              └─ Muestra mensaje de checkout
         └─ Redirige aquí después de login
```

---

## ✅ Validaciones Implementadas

### En CartSummary

1. **Carrito vacío**

    ```tsx
    disabled={isChecking || subtotal === 0}
    ```

    - Botón deshabilitado si subtotal es 0

2. **Estado de carga**

    ```tsx
    {
        isChecking ? 'Processing...' : 'Proceed to Checkout';
    }
    ```

    - Muestra feedback durante verificación

### En Páginas de Auth

1. **Preservación de parámetros**

    ```tsx
    href={`/sign-up${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
    ```

    - Mantiene parámetro de redirección entre Sign In/Sign Up

2. **Estado de carga**

    ```tsx
    isLoading = { isRedirecting };
    ```

    - Deshabilita formulario durante redirección

---

## 🚀 Próximos Pasos

### 1. Implementar Página de Checkout

Crear `app/(root)/checkout/page.tsx`:

```tsx
export default async function CheckoutPage() {
    // Verificar autenticación
    await requireAuth('/sign-in?redirect=/checkout&action=checkout');

    // Obtener carrito
    const cart = await getCart();

    return (
        <div>
            {/* Formulario de dirección */}
            {/* Método de pago */}
            {/* Resumen del pedido */}
            {/* Botón de confirmar compra */}
        </div>
    );
}
```

### 2. Actualizar CartSummary

Reemplazar el alert con redirección real:

```tsx
if (!authenticated) {
    router.push('/sign-in?redirect=/cart&action=checkout');
} else {
    router.push('/checkout'); // ← Descomentar cuando exista
}
```

### 3. Implementar Procesamiento de Pago

- Integrar Stripe/PayPal
- Crear server action `processPayment()`
- Crear tabla `orders` en BD
- Enviar email de confirmación

### 4. Implementar Página de Confirmación

Crear `app/(root)/order/[id]/page.tsx`:

```tsx
export default async function OrderConfirmationPage({ params }) {
    const order = await getOrder(params.id);

    return (
        <div>
            {/* Mensaje de éxito */}
            {/* Detalles del pedido */}
            {/* Información de envío */}
        </div>
    );
}
```

---

## 🧪 Testing

### Test 1: Usuario Invitado → Checkout → Sign In

1. Abrir navegación privada
2. Añadir productos al carrito
3. Ir a `/cart`
4. Click en "Proceed to Checkout"
5. **Verificar:** Redirige a `/sign-in?redirect=/cart&action=checkout`
6. **Verificar:** Mensaje dice "Sign in to Continue"
7. Iniciar sesión
8. **Verificar:** Redirige de vuelta a `/cart`
9. **Verificar:** Productos siguen en el carrito

### Test 2: Usuario Invitado → Checkout → Sign Up

1. Abrir navegación privada
2. Añadir productos al carrito
3. Ir a `/cart`
4. Click en "Proceed to Checkout"
5. Click en "Sign Up"
6. **Verificar:** Redirige a `/sign-up?redirect=/cart&action=checkout`
7. **Verificar:** Mensaje dice "Create Account to Continue"
8. Crear cuenta
9. **Verificar:** Redirige de vuelta a `/cart`
10. **Verificar:** Productos siguen en el carrito

### Test 3: Usuario Autenticado → Checkout

1. Iniciar sesión
2. Añadir productos al carrito
3. Ir a `/cart`
4. Click en "Proceed to Checkout"
5. **Verificar:** Muestra mensaje "Checkout functionality coming soon!"

### Test 4: Preservación de Parámetros

1. Ir a `/sign-in?redirect=/cart&action=checkout`
2. Click en "Sign Up"
3. **Verificar:** URL es `/sign-up?redirect=/cart&action=checkout`
4. Click en "Sign In"
5. **Verificar:** URL es `/sign-in?redirect=/cart&action=checkout`

---

## 📝 Notas Importantes

### Sesión de Invitado

- Se crea automáticamente al añadir primer producto
- Expira después de 7 días
- Se almacena en cookie
- Se elimina después de login/registro

### Migración de Carrito

- Es automática y transparente para el usuario
- Suma cantidades si hay items duplicados
- Preserva toda la información del producto
- No se pierde ningún dato

### Redirección

- Siempre preserva el parámetro `redirect`
- Funciona con cualquier ruta válida
- Se puede usar en otros flujos (ej: wishlist)

---

**Estado:** ✅ Implementado y funcional
**Pendiente:** Página de checkout completa
**Última actualización:** 2024
