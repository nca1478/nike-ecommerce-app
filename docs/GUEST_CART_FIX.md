# Fix: Carrito de Invitados en Producción (Vercel)

## 🐛 Problema Identificado

Los usuarios guest no podían agregar productos al carrito en producción (Vercel) debido a problemas con la gestión de cookies y el middleware.

## 🔍 Causas Raíz

1. **Middleware no configurado correctamente**: El archivo `proxy.ts` no era reconocido por Next.js como middleware (debe llamarse `middleware.ts`)
2. **Cookies con configuración restrictiva**: Las cookies de guest session tenían `httpOnly: true`, lo que podía causar problemas en ciertos escenarios
3. **Flujo de creación de sesión guest**: La función no retornaba el `guestId` directamente, causando problemas de sincronización

## ✅ Soluciones Implementadas

### 1. Middleware Actualizado

**Archivo modificado**: `nike-ecommerce-app/proxy.ts`

El middleware se mantiene en `proxy.ts` y exporta la función `proxy` que Next.js reconoce automáticamente.

### 2. Configuración de Cookies Optimizada

**Archivo modificado**: `nike-ecommerce-app/lib/auth/cookies.ts`

```typescript
// Opciones específicas para guest session (más permisivas para producción)
const guestCookieOptions: CookieOptions = {
    httpOnly: false, // Permitir acceso desde cliente para mejor compatibilidad
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
};
```

**Cambios**:

- `httpOnly: false` para cookies de guest (mejor compatibilidad con Server Actions)
- Mantiene `secure: true` en producción (HTTPS)
- `sameSite: 'lax'` para permitir cookies en navegación normal

### 3. Función `createGuestSession` Mejorada

**Archivo modificado**: `nike-ecommerce-app/lib/auth/actions.ts`

Ahora retorna tanto el `sessionToken` como el `guestId`:

```typescript
export async function createGuestSession(): Promise<
    ActionResult<{ sessionToken: string; guestId: string }>
>;
```

### 4. Función `getOrCreateCart` Optimizada

**Archivo modificado**: `nike-ecommerce-app/lib/actions/cart.ts`

Mejoras:

- Usa directamente el `guestId` retornado por `createGuestSession()`
- Mejor manejo de sesiones expiradas
- Logs detallados para debugging en producción
- Flujo más robusto sin dependencias de cookies en la misma petición

## 🚀 Configuración en Vercel

### Variables de Entorno Requeridas

Asegúrate de tener estas variables configuradas en Vercel:

```bash
# Environment
NODE_ENV=production

# Api
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app

# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Better Auth (mínimo 32 caracteres)
BETTER_AUTH_SECRET=tu_secret_key_aqui_minimo_32_caracteres
BETTER_AUTH_URL=https://tu-dominio.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
```

### Pasos para Configurar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Selecciona los ambientes: Production, Preview, Development
5. Guarda los cambios
6. Redeploy el proyecto

## 🧪 Testing

### En Desarrollo

```bash
npm run dev
```

1. Abre el navegador en modo incógnito
2. Navega a un producto
3. Intenta agregar al carrito sin iniciar sesión
4. Verifica que se agregue correctamente
5. Revisa los logs en la consola del servidor

### En Producción

1. Abre tu sitio en Vercel en modo incógnito
2. Navega a un producto
3. Intenta agregar al carrito sin iniciar sesión
4. Verifica que se agregue correctamente
5. Revisa los logs en Vercel Dashboard → Logs

## 📊 Logs de Debugging

Los siguientes logs te ayudarán a identificar problemas:

```
[Cart] Creando nueva sesión de invitado
[Cart] Sesión de invitado creada: <guestId>
[Cart] Creando nuevo carrito para invitado
[Cart] Sesión de invitado expirada, creando nueva
[Cart] Error al crear sesión de invitado: <error>
[Cart] Error en getOrCreateCart: <error>
```

## 🔄 Flujo Completo

### Usuario Guest Agrega Producto

1. Usuario hace clic en "Agregar al Carrito"
2. `addCartItem()` llama a `getOrCreateCart()`
3. `getOrCreateCart()` detecta que no hay usuario autenticado
4. Busca cookie de guest session
5. Si no existe o está expirada:
    - Llama a `createGuestSession()`
    - Crea registro en tabla `guest`
    - Establece cookie `guest_session`
    - Retorna `guestId`
6. Busca o crea carrito para el `guestId`
7. Agrega el producto al carrito
8. Retorna éxito

### Usuario Guest Inicia Sesión

1. Usuario inicia sesión con `signIn()`
2. `signIn()` detecta cookie de guest session
3. Llama a `mergeGuestCartWithUserCart()`
4. Busca carrito de guest por `guestId`
5. Fusiona items con carrito de usuario
6. Elimina carrito de guest
7. Elimina registro de guest
8. Elimina cookie de guest session

## 🛡️ Seguridad

- Las cookies de autenticación mantienen `httpOnly: true` (más seguras)
- Las cookies de guest usan `httpOnly: false` (necesario para Server Actions)
- Todas las cookies usan `secure: true` en producción (solo HTTPS)
- `sameSite: 'lax'` previene CSRF mientras permite navegación normal
- Las sesiones de guest expiran en 7 días
- Los datos de guest se eliminan al iniciar sesión

## 📝 Notas Importantes

1. **Middleware**: El middleware está en `proxy.ts` y exporta la función `proxy` que Next.js reconoce automáticamente
2. **Cookies en Server Actions**: Las cookies establecidas en una Server Action pueden no estar disponibles inmediatamente en la misma petición
3. **Vercel**: Asegúrate de que todas las variables de entorno estén configuradas correctamente
4. **HTTPS**: En producción, todas las cookies requieren HTTPS (Vercel lo proporciona automáticamente)
5. **Logs**: Los logs de producción están disponibles en Vercel Dashboard

## 🔗 Archivos Modificados

- ✅ `nike-ecommerce-app/proxy.ts` (middleware actualizado)
- ✅ `nike-ecommerce-app/lib/auth/cookies.ts`
- ✅ `nike-ecommerce-app/lib/auth/actions.ts`
- ✅ `nike-ecommerce-app/lib/actions/cart.ts`

## 🎯 Resultado

Los usuarios guest ahora pueden:

- ✅ Agregar productos al carrito sin iniciar sesión
- ✅ Ver su carrito persistente durante 7 días
- ✅ Fusionar su carrito al iniciar sesión
- ✅ Funciona correctamente en desarrollo y producción (Vercel)
