# ⚡ Quick Start - Sistema de Autenticación

## 🚀 Inicio Rápido (5 minutos)

### 1. Generar Clave Secreta

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y agrégalo a `.env.local`:

```env
BETTER_AUTH_SECRET=tu_clave_generada_aqui
```

### 2. Aplicar Migraciones

```bash
npm run db:push
```

### 3. Crear Página de Login

Crea `app/auth/signin/page.tsx`:

```tsx
import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
        </div>
        <SignInForm />
        <div className="text-center text-sm">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link href="/auth/signup" className="font-medium hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### 4. Crear Página de Registro

Crea `app/auth/signup/page.tsx`:

```tsx
import { SignUpForm } from "@/components/auth/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Crear Cuenta</h1>
        </div>
        <SignUpForm />
        <div className="text-center text-sm">
          <span className="text-gray-600">¿Ya tienes cuenta? </span>
          <Link href="/auth/signin" className="font-medium hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### 5. Probar el Sistema

```bash
npm run dev
```

Visita:

- http://localhost:3000/auth/signup - Crear cuenta
- http://localhost:3000/auth/signin - Iniciar sesión

## ✅ Verificación

### Verificar Tablas en la Base de Datos

```sql
-- Conectarse a tu base de datos y ejecutar:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user', 'session', 'account', 'verification', 'guest');
```

Deberías ver las 5 tablas creadas.

### Verificar Variables de Entorno

```bash
# Verificar que existan:
# - DATABASE_URL
# - BETTER_AUTH_SECRET
# - BETTER_AUTH_URL
```

## 🎯 Uso Básico

### En Server Components

```tsx
import { getCurrentUser } from "@/lib/auth/actions";

export default async function Page() {
  const user = await getCurrentUser();
  return <div>{user ? `Hola ${user.email}` : "No autenticado"}</div>;
}
```

### Proteger una Ruta

```tsx
import { requireAuth } from "@/lib/auth/actions";

export default async function CheckoutPage() {
  await requireAuth(); // Redirige si no está autenticado
  return <div>Checkout</div>;
}
```

### En Client Components

```tsx
"use client";
import { useAuth } from "@/lib/auth/hooks";

export function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return <div>{isAuthenticated ? "Autenticado" : "No autenticado"}</div>;
}
```

## 📚 Documentación Completa

Para más detalles, consulta:

- **AUTH_SETUP.md** - Documentación técnica completa
- **MIGRATION_GUIDE.md** - Guía detallada de implementación
- **IMPLEMENTATION_SUMMARY.md** - Resumen de archivos creados

## 🐛 Problemas Comunes

### Error: "BETTER_AUTH_SECRET is not defined"

→ Agrega `BETTER_AUTH_SECRET` a tu `.env.local`

### Error: "relation 'user' does not exist"

→ Ejecuta `npm run db:push`

### Error: Cookies no persisten

→ Verifica que `BETTER_AUTH_URL` coincida con tu dominio

## 🎉 ¡Listo!

Tu sistema de autenticación está funcionando. Ahora puedes:

- Registrar usuarios
- Iniciar sesión
- Proteger rutas
- Gestionar sesiones

Para funcionalidades avanzadas (OAuth, verificación de email, etc.), consulta la documentación completa.
