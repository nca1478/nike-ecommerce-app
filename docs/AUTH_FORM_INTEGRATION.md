# 🔗 Integración de AuthForm con Sistema de Autenticación

## 📋 Problema

El componente `AuthForm` espera una función con el siguiente tipo:

```typescript
(formData: FormData) => Promise<{ ok: boolean; userId?: string } | void>;
```

Pero las funciones de autenticación (`signIn`, `signUp`) retornan:

```typescript
Promise<ActionResult<{ userId: string }>>;
// donde ActionResult = { success: boolean; error?: string; data?: T }
```

## ✅ Solución: Funciones Adaptadoras

Se crearon funciones adaptadoras en `lib/auth/form-actions.ts` que:

1. Reciben `FormData` del formulario
2. Extraen los campos necesarios
3. Llaman a las funciones originales de autenticación
4. Convierten el resultado al formato esperado por `AuthForm`

## 📁 Archivo Creado

### `lib/auth/form-actions.ts`

```typescript
"use server";

import { signIn as signInAction, signUp as signUpAction } from "./actions";

/**
 * Adaptador para signIn
 */
export async function signInFormAction(
  formData: FormData
): Promise<{ ok: boolean; userId?: string } | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await signInAction({ email, password });

  if (result.success && result.data) {
    return { ok: true, userId: result.data.userId };
  }

  if (result.error) {
    throw new Error(result.error);
  }

  return { ok: false };
}

/**
 * Adaptador para signUp
 */
export async function signUpFormAction(
  formData: FormData
): Promise<{ ok: boolean; userId?: string } | void> {
  const name = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await signUpAction({ name, email, password });

  if (result.success && result.data) {
    return { ok: true, userId: result.data.userId };
  }

  if (result.error) {
    throw new Error(result.error);
  }

  return { ok: false };
}
```

## 🔄 Flujo de Datos

### Sign In

```
AuthForm (FormData)
    ↓
signInFormAction(formData)
    ↓
Extrae: email, password
    ↓
signInAction({ email, password })
    ↓
Better Auth + Validación Zod
    ↓
Retorna: { success, error?, data? }
    ↓
Convierte a: { ok, userId? }
    ↓
AuthForm recibe resultado
```

### Sign Up

```
AuthForm (FormData)
    ↓
signUpFormAction(formData)
    ↓
Extrae: fullName, email, password
    ↓
signUpAction({ name, email, password })
    ↓
Better Auth + Validación Zod
    ↓
Retorna: { success, error?, data? }
    ↓
Convierte a: { ok, userId? }
    ↓
AuthForm recibe resultado
```

## 📝 Uso en Páginas

### Sign In Page

**Antes:**

```tsx
import { signIn } from "@/lib/auth/actions";

<AuthForm type="sign-in" onSubmit={signIn} />;
// ❌ Error de tipo
```

**Después:**

```tsx
import { signInFormAction } from "@/lib/auth/form-actions";

<AuthForm type="sign-in" onSubmit={signInFormAction} />;
// ✅ Tipos compatibles
```

### Sign Up Page

**Antes:**

```tsx
import { signUp } from "@/lib/auth/actions";

<AuthForm type="sign-up" onSubmit={signUp} />;
// ❌ Error de tipo
```

**Después:**

```tsx
import { signUpFormAction } from "@/lib/auth/form-actions";

<AuthForm type="sign-up" onSubmit={signUpFormAction} />;
// ✅ Tipos compatibles
```

## 🎯 Ventajas de Esta Solución

1. **Separación de Responsabilidades**

   - Las funciones originales mantienen su estructura
   - Los adaptadores manejan la conversión de formato

2. **Reutilización**

   - Las funciones originales (`signIn`, `signUp`) siguen disponibles
   - Útiles para otros componentes que no usen `AuthForm`

3. **Manejo de Errores**

   - Los errores se lanzan como excepciones
   - `AuthForm` los captura en el `catch` block

4. **Type Safety**
   - Todo está correctamente tipado
   - TypeScript valida la compatibilidad

## 🔍 Mapeo de Campos

### FormData → Función de Autenticación

| Campo FormData | Campo Auth | Función |
| -------------- | ---------- | ------- |
| `email`        | `email`    | signIn  |
| `password`     | `password` | signIn  |
| `fullName`     | `name`     | signUp  |
| `email`        | `email`    | signUp  |
| `password`     | `password` | signUp  |

### Resultado Auth → Resultado AuthForm

| Campo Auth      | Campo AuthForm |
| --------------- | -------------- |
| `success: true` | `ok: true`     |
| `data.userId`   | `userId`       |
| `error`         | `throw Error`  |

## 📚 Archivos Modificados

1. ✅ **Creado**: `lib/auth/form-actions.ts`
2. ✅ **Actualizado**: `lib/auth/index.ts` (exporta form-actions)
3. ✅ **Actualizado**: `app/(auth)/sign-in/page.tsx`
4. ✅ **Actualizado**: `app/(auth)/sign-up/page.tsx`

## 🚀 Estado

- ✅ Funciones adaptadoras creadas
- ✅ Páginas actualizadas
- ✅ Tipos compatibles
- ✅ Listo para usar

---

**Fecha:** 15 de Noviembre, 2025
**Versión:** 1.0.0
