# 🔐 Sistema de Autenticación - Nike E-commerce

## 📋 Descripción General

Sistema de autenticación robusto y escalable construido con **Better Auth**, **Drizzle ORM** y **PostgreSQL**. Soporta usuarios autenticados y sesiones de invitado con migración automática de datos.

## 🏗️ Arquitectura

### Stack Tecnológico

- **Base de Datos**: PostgreSQL
- **ORM**: Drizzle ORM
- **Framework**: Next.js 14+ (App Router)
- **Autenticación**: Better Auth
- **Validación**: Zod
- **Gestión de Estado**: Server Actions

### Estructura de Carpetas

```
lib/
├── auth/
│   ├── actions.ts          # Server Actions para autenticación
│   ├── validation.ts       # Esquemas Zod de validación
│   ├── cookies.ts          # Utilidades para gestión de cookies
│   ├── hooks.ts            # Hooks de React para cliente
│   └── index.ts            # Exportaciones principales
├── db/
│   └── schema/
│       ├── user.ts         # Esquema de usuarios
│       ├── session.ts      # Esquema de sesiones
│       ├── account.ts      # Esquema de cuentas (OAuth + credentials)
│       ├── verification.ts # Esquema de verificación
│       ├── guest.ts        # Esquema de sesiones de invitado
│       └── index.ts        # Exportaciones de esquemas
└── auth.ts                 # Configuración de Better Auth

app/
└── api/
    └── auth/
        └── [...all]/
            └── route.ts    # Rutas de API de Better Auth

components/
└── auth/
    ├── SignInForm.tsx      # Formulario de inicio de sesión
    ├── SignUpForm.tsx      # Formulario de registro
    └── UserMenu.tsx        # Menú de usuario

middleware.ts               # Middleware de protección de rutas
```

## 📊 Esquema de Base de Datos

### Tabla `user`

```sql
- id: UUID (PK)
- name: TEXT (nullable)
- email: TEXT (unique, not null)
- emailVerified: BOOLEAN (default: false)
- image: TEXT (nullable)
- createdAt: TIMESTAMP (default: now)
- updatedAt: TIMESTAMP (default: now)
```

### Tabla `session`

```sql
- id: UUID (PK)
- userId: UUID (FK -> user.id, cascade delete)
- token: TEXT (unique, not null)
- ipAddress: TEXT (nullable)
- userAgent: TEXT (nullable)
- expiresAt: TIMESTAMP (not null)
- createdAt: TIMESTAMP (default: now)
- updatedAt: TIMESTAMP (default: now)
```

### Tabla `account`

```sql
- id: UUID (PK)
- userId: TEXT (FK -> user.id, cascade delete)
- accountId: TEXT (not null)
- providerId: TEXT (not null) # "credentials", "google", etc.
- accessToken: TEXT (nullable)
- refreshToken: TEXT (nullable)
- accessTokenExpiresAt: TIMESTAMP (nullable)
- refreshTokenExpiresAt: TIMESTAMP (nullable)
- scope: TEXT (nullable)
- idToken: TEXT (nullable)
- password: TEXT (nullable) # Solo para credentials
- createdAt: TIMESTAMP (default: now)
- updatedAt: TIMESTAMP (default: now)
```

### Tabla `verification`

```sql
- id: UUID (PK)
- identifier: TEXT (not null) # email
- value: TEXT (not null) # token/código
- expiresAt: TIMESTAMP (not null)
- createdAt: TIMESTAMP (default: now)
- updatedAt: TIMESTAMP (default: now)
```

### Tabla `guest`

```sql
- id: UUID (PK)
- sessionToken: TEXT (unique, not null)
- createdAt: TIMESTAMP (default: now)
- expiresAt: TIMESTAMP (not null)
```

## 🔧 Configuración

### 1. Variables de Entorno

Actualiza tu archivo `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database_name?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=tu_clave_secreta_aqui_minimo_32_caracteres
BETTER_AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Generar y Aplicar Migraciones

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# O push directo (desarrollo)
npm run db:push
```

## 🚀 Uso

### Server Actions

#### Registro de Usuario

```typescript
import { signUp } from '@/lib/auth/actions';

const result = await signUp({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'Password123',
});

if (result.success) {
    // Usuario creado exitosamente
    console.log('User ID:', result.data?.userId);
}
```

#### Inicio de Sesión

```typescript
import { signIn } from '@/lib/auth/actions';

const result = await signIn({
    email: 'juan@example.com',
    password: 'Password123',
});

if (result.success) {
    // Sesión iniciada exitosamente
}
```

#### Cerrar Sesión

```typescript
import { signOut } from '@/lib/auth/actions';

await signOut();
```

#### Crear Sesión de Invitado

```typescript
import { createGuestSession } from '@/lib/auth/actions';

const result = await createGuestSession();
if (result.success) {
    console.log('Guest token:', result.data?.sessionToken);
}
```

#### Obtener Usuario Actual

```typescript
import { getCurrentUser } from '@/lib/auth/actions';

const user = await getCurrentUser();
if (user) {
    console.log('Logged in as:', user.email);
}
```

### Componentes de Cliente

#### Formulario de Inicio de Sesión

```tsx
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <SignInForm />
        </div>
    );
}
```

#### Formulario de Registro

```tsx
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <SignUpForm />
        </div>
    );
}
```

#### Menú de Usuario

```tsx
import { getCurrentUser } from '@/lib/auth/actions';
import { UserMenu } from '@/components/auth/UserMenu';

export default async function Header() {
    const user = await getCurrentUser();

    return (
        <header>
            {user ? (
                <UserMenu user={user} />
            ) : (
                <a href="/auth/signin">Iniciar Sesión</a>
            )}
        </header>
    );
}
```

### Hook de Cliente

```tsx
'use client';

import { useAuth } from '@/lib/auth/hooks';

export function MyComponent() {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            {isAuthenticated ? (
                <p>Bienvenido, {user.email}</p>
            ) : (
                <p>No autenticado</p>
            )}
        </div>
    );
}
```

## 🛡️ Protección de Rutas

### Middleware Automático

El middleware protege automáticamente las rutas definidas:

```typescript
// Rutas protegidas (requieren autenticación)
const protectedRoutes = ['/checkout', '/profile', '/orders'];

// Rutas públicas (acceso libre)
const publicRoutes = ['/', '/products', '/categories', '/cart'];
```

### Protección Manual en Server Components

```typescript
import { requireAuth } from "@/lib/auth/actions";

export default async function CheckoutPage() {
  // Redirige a /auth/signin si no está autenticado
  await requireAuth();

  return <div>Página de Checkout</div>;
}
```

## 🔄 Flujo de Invitado a Usuario

### 1. Usuario Navega como Invitado

```typescript
// Crear sesión de invitado automáticamente
const result = await createGuestSession();
// Cookie 'guest_session' establecida
```

### 2. Usuario Agrega Productos al Carrito

```typescript
// El carrito se asocia con guest_session
// (Implementación pendiente en esquema de carrito)
```

### 3. Usuario Procede al Checkout

```typescript
// Middleware redirige a /auth/signin?redirect=/checkout
```

### 4. Usuario Inicia Sesión o Se Registra

```typescript
// Automáticamente:
// 1. Se migra el carrito de invitado al usuario
// 2. Se elimina la sesión de invitado
// 3. Se establece cookie 'auth_session'
// 4. Se redirige a /checkout
```

## 🔒 Seguridad

### Cookies

- **HttpOnly**: ✅ Previene acceso desde JavaScript
- **Secure**: ✅ Solo HTTPS en producción
- **SameSite**: `strict` - Previene CSRF
- **Path**: `/` - Disponible en toda la app
- **MaxAge**: 7 días

### Validación

- Todas las entradas validadas con Zod
- Contraseñas con requisitos mínimos:
    - Mínimo 8 caracteres
    - Al menos 1 mayúscula
    - Al menos 1 minúscula
    - Al menos 1 número

### Sesiones

- Tokens únicos generados con `crypto.randomUUID()`
- Expiración automática después de 7 días
- Limpieza automática de sesiones expiradas

## 📝 Próximos Pasos (Post-MVP)

- [ ] Verificación de email
- [ ] OAuth (Google, GitHub, etc.)
- [ ] Autenticación de dos factores (2FA)
- [ ] Recuperación de contraseña
- [ ] Sistema de roles y permisos
- [ ] Límite de intentos de inicio de sesión
- [ ] Logs de actividad de usuario

## 🐛 Troubleshooting

### Error: "BETTER_AUTH_SECRET is not defined"

Asegúrate de tener `BETTER_AUTH_SECRET` en tu `.env.local` con al menos 32 caracteres.

### Error: "Database connection failed"

Verifica que `DATABASE_URL` esté correctamente configurada y que la base de datos esté accesible.

### Sesión no persiste

Verifica que las cookies estén habilitadas en el navegador y que `BETTER_AUTH_URL` coincida con tu dominio.

## 📚 Referencias

- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Zod Documentation](https://zod.dev)
