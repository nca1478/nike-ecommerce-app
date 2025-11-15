# 🛒 Integración del Carrito con Autenticación

## Esquema de Base de Datos para Carrito

### Opción 1: Carrito en Base de Datos (Recomendado para Producción)

Crea estos esquemas adicionales:

```typescript
// lib/db/schema/cart.ts
import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { guest } from "./guest";
import { products } from "../schema";

export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => user.id, { onDelete: "cascade" }),
  guestSessionToken: uuid("guestSessionToken").references(
    () => guest.sessionToken,
    {
      onDelete: "cascade",
    }
  ),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const cartItem = pgTable("cart_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cartId")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: integer("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Cart = typeof cart.$inferSelect;
export type NewCart = typeof cart.$inferInsert;
export type CartItem = typeof cartItem.$inferSelect;
export type NewCartItem = typeof cartItem.$inferInsert;
```

### Opción 2: Mantener Zustand + Sincronizar con BD

Si prefieres mantener Zustand para la experiencia de usuario pero sincronizar con la BD:

```typescript
// lib/store/useCartStore.ts (actualizado)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../db/schema";
import { syncCartToDatabase } from "../cart/actions";

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  syncWithServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });

        // Sincronizar con servidor
        await get().syncWithServer();
      },

      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));

        // Sincronizar con servidor
        await get().syncWithServer();
      },

      clearCart: async () => {
        set({ items: [] });
        await get().syncWithServer();
      },

      getTotalPrice: () => {
        const items = get().items;
        return items.reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        );
      },

      syncWithServer: async () => {
        const items = get().items;
        await syncCartToDatabase(items);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
```

## Server Actions para Carrito

```typescript
// lib/cart/actions.ts
"use server";

import { db } from "@/lib/db";
import { cart, cartItem } from "@/lib/db/schema/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import { getGuestSessionCookie } from "@/lib/auth/cookies";
import { eq, and } from "drizzle-orm";

export async function syncCartToDatabase(items: any[]) {
  try {
    const user = await getCurrentUser();
    const guestToken = await getGuestSessionCookie();

    if (!user && !guestToken) {
      return { success: false, error: "No session found" };
    }

    // Buscar o crear carrito
    let userCart = await db.query.cart.findFirst({
      where: user
        ? eq(cart.userId, user.id)
        : eq(cart.guestSessionToken, guestToken!),
    });

    if (!userCart) {
      const [newCart] = await db
        .insert(cart)
        .values({
          userId: user?.id,
          guestSessionToken: guestToken,
        })
        .returning();
      userCart = newCart;
    }

    // Limpiar items existentes
    await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

    // Insertar nuevos items
    if (items.length > 0) {
      await db.insert(cartItem).values(
        items.map((item) => ({
          cartId: userCart!.id,
          productId: item.id,
          quantity: item.quantity,
        }))
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error syncing cart:", error);
    return { success: false, error: "Failed to sync cart" };
  }
}

export async function getCartFromDatabase() {
  try {
    const user = await getCurrentUser();
    const guestToken = await getGuestSessionCookie();

    if (!user && !guestToken) {
      return { success: true, items: [] };
    }

    const userCart = await db.query.cart.findFirst({
      where: user
        ? eq(cart.userId, user.id)
        : eq(cart.guestSessionToken, guestToken!),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!userCart) {
      return { success: true, items: [] };
    }

    return {
      success: true,
      items: userCart.items.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      })),
    };
  } catch (error) {
    console.error("Error getting cart:", error);
    return { success: false, error: "Failed to get cart", items: [] };
  }
}
```

## Actualizar mergeGuestCartWithUserCart

```typescript
// lib/auth/actions.ts (actualizar función existente)

export async function mergeGuestCartWithUserCart(
  guestSessionToken: string,
  userId: string
): Promise<ActionResult> {
  try {
    // Buscar carrito de invitado
    const guestCart = await db.query.cart.findFirst({
      where: eq(cart.guestSessionToken, guestSessionToken),
      with: {
        items: true,
      },
    });

    if (guestCart && guestCart.items.length > 0) {
      // Buscar o crear carrito de usuario
      let userCart = await db.query.cart.findFirst({
        where: eq(cart.userId, userId),
      });

      if (!userCart) {
        const [newCart] = await db
          .insert(cart)
          .values({
            userId,
          })
          .returning();
        userCart = newCart;
      }

      // Migrar items del carrito de invitado al de usuario
      for (const item of guestCart.items) {
        // Verificar si el producto ya existe en el carrito del usuario
        const existingItem = await db.query.cartItem.findFirst({
          where: and(
            eq(cartItem.cartId, userCart.id),
            eq(cartItem.productId, item.productId)
          ),
        });

        if (existingItem) {
          // Actualizar cantidad
          await db
            .update(cartItem)
            .set({ quantity: existingItem.quantity + item.quantity })
            .where(eq(cartItem.id, existingItem.id));
        } else {
          // Insertar nuevo item
          await db.insert(cartItem).values({
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      }

      // Eliminar carrito de invitado
      await db.delete(cart).where(eq(cart.id, guestCart.id));
    }

    // Eliminar sesión de invitado
    await db.delete(guest).where(eq(guest.sessionToken, guestSessionToken));
    await deleteGuestSessionCookie();

    return { success: true };
  } catch (error) {
    console.error("Error en mergeGuestCartWithUserCart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al migrar el carrito",
    };
  }
}
```

## Componente de Carrito Actualizado

```tsx
// components/Cart.tsx
"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { getCartFromDatabase } from "@/lib/cart/actions";

export function Cart() {
  const { items, removeItem, getTotalPrice } = useCartStore();

  // Cargar carrito desde la BD al montar
  useEffect(() => {
    async function loadCart() {
      const result = await getCartFromDatabase();
      if (result.success && result.items.length > 0) {
        // Actualizar Zustand con los items de la BD
        // (necesitarás agregar una función setItems en el store)
      }
    }
    loadCart();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Tu Carrito</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 border rounded"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  ${item.price} x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

## Flujo Completo

### 1. Usuario Invitado Agrega Productos

```
Usuario → Agrega producto → Zustand (localStorage) → Sync a BD con guestSessionToken
```

### 2. Usuario Procede al Checkout

```
Usuario → Click "Checkout" → Middleware detecta no auth → Redirect a /auth/signin?redirect=/checkout
```

### 3. Usuario Inicia Sesión

```
Usuario → Login → mergeGuestCartWithUserCart() → Migra items → Elimina guest session → Redirect a /checkout
```

### 4. Usuario Autenticado Agrega Productos

```
Usuario → Agrega producto → Zustand → Sync a BD con userId
```

## Ventajas de Este Enfoque

1. **Experiencia de Usuario Fluida**: Zustand mantiene el carrito rápido y reactivo
2. **Persistencia**: La BD asegura que el carrito no se pierda
3. **Sincronización**: Los cambios se sincronizan automáticamente
4. **Migración Transparente**: El usuario no pierde su carrito al registrarse
5. **Multi-dispositivo**: El carrito se sincroniza entre dispositivos para usuarios autenticados

## Consideraciones

- **Conflictos**: Si el usuario tiene items en ambos carritos (guest + user), se suman las cantidades
- **Expiración**: Los carritos de invitado expiran junto con la sesión (7 días)
- **Limpieza**: Implementar un cron job para limpiar carritos abandonados
- **Validación**: Verificar disponibilidad de productos antes del checkout

## Próximos Pasos

1. Crear los esquemas de `cart` y `cart_item`
2. Generar y aplicar migraciones
3. Implementar las server actions
4. Actualizar el store de Zustand
5. Probar el flujo completo de guest → user
