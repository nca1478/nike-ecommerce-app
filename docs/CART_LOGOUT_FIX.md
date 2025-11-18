# Fix: Actualización del Carrito al Cerrar Sesión

## 🐛 Problema Identificado

Cuando un usuario cierra sesión, el contador de productos en el Navbar no se actualiza automáticamente. El carrito sigue mostrando la cantidad de productos del usuario anterior en lugar de cargar el carrito de invitado (que está vacío).

## 🔍 Causa Raíz

El `CartIcon` solo carga el carrito una vez cuando se monta el componente (en el `useEffect` inicial). Cuando el usuario cierra sesión:

1. El estado de autenticación cambia (usuario → null)
2. Se crea una nueva sesión de invitado
3. Pero el `CartIcon` NO recarga el carrito
4. El contador sigue mostrando los productos del usuario anterior

### Código Problemático

```tsx
// ❌ Solo se ejecuta una vez al montar
useEffect(() => {
    const loadCart = async () => {
        const result = await getCart();
        if (result.success && result.data) {
            setItems(result.data);
        }
    };
    loadCart();
}, [setItems]); // No reacciona a cambios de usuario
```

## ✅ Solución Implementada

### 1. Actualizar `CartIcon.tsx`

**Cambio:** Añadir `user` como dependencia del `useEffect` para recargar el carrito cuando cambia el estado de autenticación.

```tsx
// ✅ Se ejecuta cuando cambia el usuario
import { useAuth } from '@/lib/auth/hooks';

export function CartIcon() {
    const { items, setItems } = useCartStore();
    const { user } = useAuth(); // ← Obtener usuario

    useEffect(() => {
        const loadCart = async () => {
            const result = await getCart();
            if (result.success && result.data) {
                setItems(result.data);
            }
        };
        loadCart();
    }, [setItems, user]); // ← Recargar cuando cambia user

    // ...
}
```

**Beneficios:**

- ✅ Recarga automática al iniciar sesión
- ✅ Recarga automática al cerrar sesión
- ✅ Recarga automática al registrarse

### 2. Actualizar `Navbar.tsx`

**Cambio:** Limpiar el store del carrito antes de recargar la página al cerrar sesión.

```tsx
const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
        await refresh(); // Actualizar el estado del usuario

        // Limpiar el carrito del store para forzar recarga
        const { useCartStore } = await import('@/lib/store/cart.store');
        useCartStore.getState().clearCart();

        router.push('/');
        router.refresh();
    }
};
```

**Beneficios:**

- ✅ Limpia el estado del carrito inmediatamente
- ✅ Evita mostrar datos del usuario anterior
- ✅ Fuerza recarga del carrito de invitado

## 🎯 Flujo Completo

### Escenario: Usuario Cierra Sesión

```
1. Usuario hace clic en "Logout"
   ↓
2. handleLogout() se ejecuta
   ↓
3. signOut() cierra la sesión
   ↓
4. refresh() actualiza el estado del usuario (user → null)
   ↓
5. clearCart() limpia el store del carrito
   ↓
6. router.refresh() recarga la página
   ↓
7. CartIcon detecta cambio en user (useEffect se ejecuta)
   ↓
8. getCart() obtiene carrito de invitado (vacío)
   ↓
9. setItems([]) actualiza el store
   ↓
10. UI se actualiza: "My Cart" (sin número)
```

### Escenario: Usuario Inicia Sesión

```
1. Usuario inicia sesión exitosamente
   ↓
2. Redirige a la página anterior
   ↓
3. CartIcon detecta cambio en user (null → user)
   ↓
4. useEffect se ejecuta automáticamente
   ↓
5. getCart() obtiene carrito del usuario
   ↓
6. setItems(cartData) actualiza el store
   ↓
7. UI se actualiza: "My Cart (3)"
```

## 📊 Comparación Antes/Después

### Antes del Fix

| Acción   | Estado Usuario | Contador Navbar | ¿Correcto? |
| -------- | -------------- | --------------- | ---------- |
| Login    | null → user    | Se actualiza    | ✅         |
| Logout   | user → null    | NO se actualiza | ❌         |
| Registro | null → user    | Se actualiza    | ✅         |

### Después del Fix

| Acción   | Estado Usuario | Contador Navbar | ¿Correcto? |
| -------- | -------------- | --------------- | ---------- |
| Login    | null → user    | Se actualiza    | ✅         |
| Logout   | user → null    | Se actualiza    | ✅         |
| Registro | null → user    | Se actualiza    | ✅         |

## 🔧 Archivos Modificados

### 1. `components/Cart/CartIcon.tsx`

**Cambios:**

- Importar `useAuth` hook
- Obtener `user` del hook
- Añadir `user` como dependencia del `useEffect`

**Líneas modificadas:** 3

### 2. `components/Shared/Navbar.tsx`

**Cambios:**

- Importar dinámicamente `useCartStore`
- Llamar a `clearCart()` antes de redirigir
- Limpiar estado del carrito al cerrar sesión

**Líneas modificadas:** 3

## ✅ Validaciones

### Test 1: Logout con Carrito Lleno

1. Iniciar sesión con usuario que tiene productos en el carrito
2. Verificar que Navbar muestra "My Cart (3)"
3. Hacer clic en "Logout"
4. **Resultado esperado:** Navbar muestra "My Cart" (sin número)

### Test 2: Login con Carrito Vacío

1. Estar como invitado sin productos
2. Iniciar sesión con usuario que tiene productos
3. **Resultado esperado:** Navbar muestra "My Cart (3)"

### Test 3: Logout y Login Múltiples Veces

1. Login → Logout → Login → Logout
2. **Resultado esperado:** Contador siempre correcto

### Test 4: Registro Nuevo Usuario

1. Añadir productos como invitado
2. Registrarse
3. **Resultado esperado:** Contador mantiene los productos (migración)

## 🎓 Lecciones Aprendidas

### 1. Dependencias de useEffect

Los `useEffect` deben incluir todas las variables que afectan su comportamiento:

```tsx
// ❌ Incompleto
useEffect(() => {
    loadData();
}, []);

// ✅ Completo
useEffect(() => {
    loadData(user);
}, [user]); // Reacciona a cambios
```

### 2. Limpieza de Estado

Al cambiar de contexto (usuario → invitado), siempre limpiar el estado anterior:

```tsx
// ✅ Limpiar antes de cambiar
clearCart();
router.refresh();
```

### 3. Hooks de Autenticación

Usar hooks de autenticación para detectar cambios de usuario:

```tsx
const { user } = useAuth(); // Reactivo a cambios
```

## 🚀 Mejoras Futuras

### 1. Loading State

Mostrar indicador de carga mientras se recarga el carrito:

```tsx
const [isLoadingCart, setIsLoadingCart] = useState(false);

useEffect(() => {
    const loadCart = async () => {
        setIsLoadingCart(true);
        const result = await getCart();
        if (result.success && result.data) {
            setItems(result.data);
        }
        setIsLoadingCart(false);
    };
    loadCart();
}, [setItems, user]);
```

### 2. Optimistic Updates

Limpiar el carrito inmediatamente en la UI:

```tsx
const handleLogout = async () => {
    // Limpiar UI inmediatamente
    clearCart();

    // Luego hacer logout
    const result = await signOut();
    // ...
};
```

### 3. Persistencia Local

Guardar carrito de invitado en localStorage como backup:

```tsx
useEffect(() => {
    if (!user) {
        // Guardar carrito de invitado
        localStorage.setItem('guestCart', JSON.stringify(items));
    }
}, [items, user]);
```

## 📝 Notas Importantes

### Comportamiento Esperado

- **Login:** Carrito se carga desde BD del usuario
- **Logout:** Carrito se limpia y se carga carrito de invitado (vacío)
- **Registro:** Carrito de invitado se migra al usuario

### Sesión de Invitado

- Se crea automáticamente al añadir primer producto
- Se elimina al hacer login/registro
- Expira después de 7 días

### Migración de Carrito

- Ocurre automáticamente en `signIn()` y `signUp()`
- Preserva todos los productos del invitado
- Suma cantidades si hay items duplicados

## 🐛 Troubleshooting

### Problema: Contador no se actualiza después de logout

**Solución:** Verificar que:

1. `user` está en las dependencias del `useEffect`
2. `clearCart()` se llama antes de `router.refresh()`
3. `useAuth()` está funcionando correctamente

### Problema: Carrito muestra productos incorrectos

**Solución:** Verificar que:

1. `getCart()` obtiene el carrito correcto (usuario/invitado)
2. La sesión de invitado se crea correctamente
3. La migración de carrito funciona

### Problema: Múltiples recargas del carrito

**Solución:** Verificar que:

1. No hay múltiples instancias de `CartIcon`
2. Las dependencias del `useEffect` son correctas
3. No hay loops infinitos

---

**Estado:** ✅ Corregido y verificado
**Impacto:** Alto - Afecta la experiencia de usuario
**Prioridad:** Crítica
**Última actualización:** 2024
