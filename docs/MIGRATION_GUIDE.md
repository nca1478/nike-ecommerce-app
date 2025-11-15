# 🚀 Guía de Migración - Sistema de Autenticación

## Pasos para Implementar el Sistema de Autenticación

### 1. Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` contenga:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database_name?sslmode=require

# Better Auth (IMPORTANTE: Genera una clave secreta segura)
BETTER_AUTH_SECRET=tu_clave_secreta_minimo_32_caracteres_aqui
BETTER_AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Generar BETTER_AUTH_SECRET:**

```bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# O en terminal Unix/Mac
openssl rand -hex 32
```

### 2. Generar y Aplicar Migraciones

```bash
# Opción 1: Generar migraciones y aplicarlas
npm run db:generate
npm run db:migrate

# Opción 2: Push directo (recomendado para desarrollo)
npm run db:push
```

### 3. Verificar las Tablas Creadas

Conéctate a tu base de datos y verifica que se crearon las siguientes tablas:

- `user`
- `session`
- `account`
- `verification`
- `guest`
- `products` (ya existente)

### 4. Crear Páginas de Autenticación

#### Página de Inicio de Sesión: `app/auth/signin/page.tsx`

```tsx
import { SignInForm } from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
                    <p className="mt-2 text-gray-600">
                        Accede a tu cuenta de Nike Store
                    </p>
                </div>

                <SignInForm />

                <div className="text-center text-sm">
                    <span className="text-gray-600">¿No tienes cuenta? </span>
                    <Link
                        href="/auth/signup"
                        className="font-medium hover:underline"
                    >
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
```

#### Página de Registro: `app/auth/signup/page.tsx`

```tsx
import { SignUpForm } from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Crear Cuenta</h1>
                    <p className="mt-2 text-gray-600">Únete a Nike Store</p>
                </div>

                <SignUpForm />

                <div className="text-center text-sm">
                    <span className="text-gray-600">¿Ya tienes cuenta? </span>
                    <Link
                        href="/auth/signin"
                        className="font-medium hover:underline"
                    >
                        Inicia sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
```

### 5. Actualizar el Header/Navbar

Ejemplo de cómo integrar el menú de usuario en tu header:

```tsx
// app/components/Header.tsx
import { getCurrentUser } from '@/lib/auth/actions';
import { UserMenu } from '@/components/auth/UserMenu';
import Link from 'next/link';

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Nike Store
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/products">Productos</Link>
                    <Link href="/cart">Carrito</Link>

                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <div className="flex gap-4">
                            <Link
                                href="/auth/signin"
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
```

### 6. Proteger la Página de Checkout

```tsx
// app/checkout/page.tsx
import { requireAuth, getCurrentUser } from '@/lib/auth/actions';

export default async function CheckoutPage() {
    // Redirige automáticamente a /auth/signin si no está autenticado
    await requireAuth('/auth/signin?redirect=/checkout');

    const user = await getCurrentUser();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <p>Bienvenido, {user?.name || user?.email}</p>
            {/* Tu formulario de checkout aquí */}
        </div>
    );
}
```

### 7. Implementar Sesión de Invitado (Opcional)

Si quieres crear automáticamente sesiones de invitado:

```tsx
// app/layout.tsx o un componente de inicialización
'use client';

import { useEffect } from 'react';
import { createGuestSession, isAuthenticated } from '@/lib/auth/actions';

export function GuestSessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        async function initGuestSession() {
            const authenticated = await isAuthenticated();

            if (!authenticated) {
                // Crear sesión de invitado si no está autenticado
                await createGuestSession();
            }
        }

        initGuestSession();
    }, []);

    return <>{children}</>;
}
```

### 8. Probar el Sistema

1. **Registro de Usuario:**
    - Ve a `/auth/signup`
    - Crea una cuenta con email y contraseña
    - Verifica que seas redirigido correctamente

2. **Inicio de Sesión:**
    - Ve a `/auth/signin`
    - Inicia sesión con tus credenciales
    - Verifica que la sesión persista

3. **Protección de Rutas:**
    - Intenta acceder a `/checkout` sin estar autenticado
    - Verifica que seas redirigido a `/auth/signin`
    - Inicia sesión y verifica que seas redirigido de vuelta

4. **Cerrar Sesión:**
    - Usa el botón de cerrar sesión
    - Verifica que la sesión se elimine correctamente

### 9. Verificar en la Base de Datos

Después de crear un usuario, verifica en tu base de datos:

```sql
-- Ver usuarios creados
SELECT * FROM "user";

-- Ver sesiones activas
SELECT * FROM "session";

-- Ver cuentas (credentials)
SELECT * FROM "account";

-- Ver sesiones de invitado
SELECT * FROM "guest";
```

## 🔧 Troubleshooting

### Error: "Cannot find module 'better-auth'"

```bash
npm install better-auth
```

### Error: "Cannot find module 'zod'"

```bash
npm install zod
```

### Error: Migraciones no se aplican

```bash
# Eliminar migraciones anteriores
rm -rf drizzle

# Regenerar
npm run db:generate
npm run db:push
```

### Error: Cookies no persisten

- Verifica que `BETTER_AUTH_URL` coincida con tu dominio
- En desarrollo, usa `http://localhost:3000`
- En producción, usa tu dominio real con HTTPS

## 📚 Próximos Pasos

1. **Implementar Carrito de Compras:**
    - Crear esquema de carrito
    - Asociar carrito con `userId` o `guestSessionToken`
    - Implementar migración de carrito en `mergeGuestCartWithUserCart`

2. **Agregar Verificación de Email:**
    - Configurar servicio de email (Resend, SendGrid, etc.)
    - Implementar flujo de verificación
    - Actualizar `emailVerified` en la tabla `user`

3. **Implementar OAuth:**
    - Configurar proveedores (Google, GitHub, etc.)
    - Actualizar configuración de Better Auth
    - Agregar botones de OAuth en formularios

4. **Agregar Recuperación de Contraseña:**
    - Crear flujo de "Olvidé mi contraseña"
    - Usar tabla `verification` para tokens
    - Implementar página de reset

## ✅ Checklist de Implementación

- [ ] Variables de entorno configuradas
- [ ] Migraciones aplicadas
- [ ] Tablas verificadas en la base de datos
- [ ] Páginas de signin/signup creadas
- [ ] Header actualizado con menú de usuario
- [ ] Middleware configurado
- [ ] Página de checkout protegida
- [ ] Sistema probado end-to-end
- [ ] Sesiones de invitado implementadas (opcional)
- [ ] Documentación revisada

¡Tu sistema de autenticación está listo para usar! 🎉
