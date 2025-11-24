# Testing: Carrito de Invitados

## 🧪 Guía de Testing Completa

### Pre-requisitos

1. Base de datos configurada y corriendo
2. Variables de entorno configuradas
3. Aplicación corriendo (`npm run dev` o desplegada en Vercel)

## 📋 Checklist de Testing

### ✅ Test 1: Usuario Guest - Agregar al Carrito

**Objetivo**: Verificar que un usuario sin autenticar puede agregar productos al carrito

**Pasos**:

1. Abre el navegador en modo incógnito
2. Navega a la página principal
3. Selecciona un producto
4. Selecciona talla y color
5. Haz clic en "Agregar al Carrito"
6. Verifica que aparezca el mensaje de éxito
7. Verifica que el contador del carrito se actualice
8. Navega a `/cart`
9. Verifica que el producto esté en el carrito

**Resultado Esperado**: ✅ Producto agregado exitosamente

**Logs Esperados** (en consola del servidor):

```
[Cart] Creando nueva sesión de invitado
[Cart] Sesión de invitado creada: <uuid>
[Cart] Creando nuevo carrito para invitado
```

---

### ✅ Test 2: Usuario Guest - Persistencia de Carrito

**Objetivo**: Verificar que el carrito persiste entre sesiones

**Pasos**:

1. Con el carrito del Test 1 con productos
2. Cierra el navegador completamente
3. Abre el navegador nuevamente (modo incógnito)
4. Navega a `/cart`
5. Verifica que los productos sigan ahí

**Resultado Esperado**: ✅ Carrito persiste con los productos

**Nota**: La cookie `guest_session` tiene una duración de 7 días

---

### ✅ Test 3: Usuario Guest - Múltiples Productos

**Objetivo**: Verificar que se pueden agregar múltiples productos

**Pasos**:

1. En modo incógnito con carrito vacío
2. Agrega Producto A (talla M, color Negro)
3. Agrega Producto B (talla L, color Blanco)
4. Agrega Producto A nuevamente (misma talla y color)
5. Navega a `/cart`
6. Verifica que:
    - Producto A tiene cantidad 2
    - Producto B tiene cantidad 1

**Resultado Esperado**: ✅ Cantidades correctas

---

### ✅ Test 4: Usuario Guest → Login → Fusión de Carritos

**Objetivo**: Verificar que el carrito de guest se fusiona al iniciar sesión

**Pasos**:

1. En modo incógnito, agrega 2 productos al carrito como guest
2. Inicia sesión con una cuenta existente
3. Verifica que los productos del carrito guest se mantengan
4. Navega a `/cart`
5. Verifica que todos los productos estén ahí

**Resultado Esperado**: ✅ Carrito fusionado correctamente

**Logs Esperados**:

```
Migrando carrito de invitado a usuario
Carrito fusionado exitosamente
```

---

### ✅ Test 5: Usuario Autenticado + Guest → Login → Fusión

**Objetivo**: Verificar fusión cuando ambos carritos tienen productos

**Pasos**:

1. Inicia sesión con Usuario A
2. Agrega Producto X al carrito
3. Cierra sesión
4. En modo incógnito, agrega Producto Y al carrito como guest
5. Inicia sesión con Usuario A
6. Navega a `/cart`
7. Verifica que ambos productos estén en el carrito

**Resultado Esperado**: ✅ Ambos productos en el carrito

---

### ✅ Test 6: Productos Duplicados en Fusión

**Objetivo**: Verificar que las cantidades se suman al fusionar

**Pasos**:

1. Inicia sesión con Usuario A
2. Agrega Producto X (cantidad 1) al carrito
3. Cierra sesión
4. En modo incógnito, agrega el mismo Producto X (cantidad 2) como guest
5. Inicia sesión con Usuario A
6. Navega a `/cart`
7. Verifica que Producto X tenga cantidad 3

**Resultado Esperado**: ✅ Cantidad = 3

---

### ✅ Test 7: Expiración de Sesión Guest

**Objetivo**: Verificar que las sesiones expiradas se manejan correctamente

**Pasos**:

1. Agrega productos como guest
2. Modifica manualmente la fecha de expiración en la BD:
    ```sql
    UPDATE guest SET expires_at = NOW() - INTERVAL '1 day' WHERE session_token = '<token>';
    ```
3. Intenta agregar otro producto
4. Verifica que se cree una nueva sesión
5. Verifica que el carrito anterior no esté disponible

**Resultado Esperado**: ✅ Nueva sesión creada, carrito nuevo

---

### ✅ Test 8: Cookies en Producción (Vercel)

**Objetivo**: Verificar que las cookies funcionan en HTTPS

**Pasos**:

1. Despliega en Vercel
2. Abre el sitio en modo incógnito
3. Abre DevTools → Application → Cookies
4. Agrega un producto al carrito
5. Verifica que aparezca la cookie `guest_session`:
    - `Secure`: ✅
    - `SameSite`: Lax
    - `Path`: /
    - `Expires`: ~7 días

**Resultado Esperado**: ✅ Cookie configurada correctamente

---

### ✅ Test 9: Middleware - Rutas Protegidas

**Objetivo**: Verificar que el middleware protege rutas correctamente

**Pasos**:

1. En modo incógnito (sin autenticar)
2. Intenta acceder a `/profile`
3. Verifica que redirija a `/sign-in?redirect=/profile`
4. Intenta acceder a `/orders`
5. Verifica que redirija a `/sign-in?redirect=/orders`
6. Intenta acceder a `/` (home)
7. Verifica que NO redirija

**Resultado Esperado**: ✅ Rutas protegidas correctamente

---

### ✅ Test 10: Middleware - Rutas Públicas

**Objetivo**: Verificar que las rutas públicas son accesibles

**Pasos**:

1. En modo incógnito
2. Accede a `/checkout/success`
3. Verifica que NO redirija a login
4. Verifica que la página cargue correctamente

**Resultado Esperado**: ✅ Acceso sin autenticación

---

## 🔍 Debugging en Producción

### Ver Logs en Vercel

1. Ve a Vercel Dashboard
2. Selecciona tu proyecto
3. Ve a "Logs" o "Runtime Logs"
4. Filtra por:
    - `[Cart]` para logs del carrito
    - `Error` para errores
    - `guest` para operaciones de guest

### Verificar Cookies en Producción

```javascript
// En la consola del navegador
document.cookie;
```

Deberías ver algo como:

```
guest_session=<uuid>; path=/; secure; samesite=lax
```

### Verificar Base de Datos

```sql
-- Ver sesiones de guest activas
SELECT * FROM guest WHERE expires_at > NOW();

-- Ver carritos de guest
SELECT c.*, g.session_token
FROM carts c
JOIN guest g ON c.guest_id = g.id
WHERE g.expires_at > NOW();

-- Ver items en carritos de guest
SELECT ci.*, c.guest_id, g.session_token
FROM cart_items ci
JOIN carts c ON ci.cart_id = c.id
JOIN guest g ON c.guest_id = g.id
WHERE g.expires_at > NOW();
```

## 🐛 Problemas Comunes

### Problema: "No se pudo crear el carrito"

**Causa**: Error al crear sesión de guest

**Solución**:

1. Verifica que la tabla `guest` exista
2. Verifica que las migraciones estén aplicadas
3. Revisa los logs del servidor
4. Verifica la conexión a la base de datos

### Problema: Carrito no persiste

**Causa**: Cookie no se está estableciendo

**Solución**:

1. Verifica que `BETTER_AUTH_URL` esté configurado correctamente
2. En producción, debe ser `https://tu-dominio.vercel.app`
3. Verifica que las cookies estén habilitadas en el navegador
4. Revisa las DevTools → Application → Cookies

### Problema: Carrito no se fusiona al login

**Causa**: Cookie de guest no se encuentra

**Solución**:

1. Verifica que la cookie `guest_session` exista antes del login
2. Revisa los logs de `mergeGuestCartWithUserCart`
3. Verifica que el registro de guest exista en la BD

### Problema: Error en producción pero funciona en desarrollo

**Causa**: Variables de entorno no configuradas en Vercel

**Solución**:

1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Verifica que todas las variables estén configuradas
3. Especialmente `BETTER_AUTH_URL` debe ser la URL de producción
4. Redeploy después de cambiar variables

## 📊 Métricas de Éxito

Todos los tests deben pasar:

- ✅ Test 1: Agregar al carrito como guest
- ✅ Test 2: Persistencia de carrito
- ✅ Test 3: Múltiples productos
- ✅ Test 4: Fusión de carritos
- ✅ Test 5: Fusión con productos en ambos
- ✅ Test 6: Suma de cantidades
- ✅ Test 7: Manejo de expiración
- ✅ Test 8: Cookies en producción
- ✅ Test 9: Rutas protegidas
- ✅ Test 10: Rutas públicas

## 🎯 Resultado Final

Si todos los tests pasan, el sistema de carrito de invitados está funcionando correctamente en desarrollo y producción.
