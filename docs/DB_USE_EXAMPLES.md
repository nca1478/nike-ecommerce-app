# 📚 Ejemplos de Uso - Database Queries

## 🔧 Importar el Cliente

```typescript
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and, desc, like } from 'drizzle-orm';
```

## 📦 Productos

### Obtener todos los productos publicados

```typescript
const products = await db.query.products.findMany({
    where: eq(schema.products.isPublished, true),
    with: {
        brand: true,
        category: true,
        gender: true,
        variants: {
            limit: 1,
        },
        images: {
            where: eq(schema.productImages.isPrimary, true),
        },
    },
});
```

### Obtener producto con todas sus variantes

```typescript
const product = await db.query.products.findFirst({
    where: eq(schema.products.id, productId),
    with: {
        brand: true,
        category: true,
        gender: true,
        variants: {
            with: {
                images: true,
            },
        },
        images: true,
        reviews: {
            orderBy: desc(schema.reviews.createdAt),
            limit: 10,
        },
    },
});
```

### Buscar productos por categoría y género

```typescript
const products = await db.query.products.findMany({
    where: and(
        eq(schema.products.categoryId, categoryId),
        eq(schema.products.genderId, genderId),
        eq(schema.products.isPublished, true),
    ),
    with: {
        brand: true,
        variants: true,
    },
});
```

### Crear producto con variantes

```typescript
// 1. Crear producto
const [product] = await db
    .insert(schema.products)
    .values({
        name: 'Air Max 2025',
        description: 'The latest Air Max technology',
        categoryId: categoryId,
        genderId: genderId,
        brandId: brandId,
        isPublished: true,
    })
    .returning();

// 2. Crear variantes
const variants = await db
    .insert(schema.productVariants)
    .values([
        {
            productId: product.id,
            sku: 'AM2025-BLACK-US9',
            price: '180.00',
            colorId: blackColorId,
            sizeId: size9Id,
            inStock: '50',
        },
        {
            productId: product.id,
            sku: 'AM2025-WHITE-US9',
            price: '180.00',
            colorId: whiteColorId,
            sizeId: size9Id,
            inStock: '30',
        },
    ])
    .returning();

// 3. Agregar imágenes
await db.insert(schema.productImages).values({
    productId: product.id,
    url: '/uploads/image.jpg',
    isPrimary: true,
    sortOrder: '0',
});
```

## 🛒 Carrito

### Obtener carrito del usuario

```typescript
const cart = await db.query.carts.findFirst({
    where: eq(schema.carts.userId, userId),
    with: {
        items: {
            with: {
                productVariant: {
                    with: {
                        product: {
                            with: {
                                brand: true,
                                images: {
                                    where: eq(
                                        schema.productImages.isPrimary,
                                        true,
                                    ),
                                },
                            },
                        },
                    },
                },
            },
        },
    },
});
```

### Agregar item al carrito

```typescript
// 1. Buscar o crear carrito
let cart = await db.query.carts.findFirst({
    where: eq(schema.carts.userId, userId),
});

if (!cart) {
    [cart] = await db
        .insert(schema.carts)
        .values({
            userId: userId,
        })
        .returning();
}

// 2. Verificar si el item ya existe
const existingItem = await db.query.cartItems.findFirst({
    where: and(
        eq(schema.cartItems.cartId, cart.id),
        eq(schema.cartItems.productVariantId, variantId),
    ),
});

if (existingItem) {
    // Actualizar cantidad
    await db
        .update(schema.cartItems)
        .set({
            quantity: (parseInt(existingItem.quantity) + quantity).toString(),
        })
        .where(eq(schema.cartItems.id, existingItem.id));
} else {
    // Crear nuevo item
    await db.insert(schema.cartItems).values({
        cartId: cart.id,
        productVariantId: variantId,
        quantity: quantity.toString(),
    });
}
```

### Eliminar item del carrito

```typescript
await db.delete(schema.cartItems).where(eq(schema.cartItems.id, itemId));
```

## 📦 Pedidos

### Crear pedido desde carrito

```typescript
// 1. Obtener carrito con items
const cart = await db.query.carts.findFirst({
    where: eq(schema.carts.userId, userId),
    with: {
        items: {
            with: {
                productVariant: true,
            },
        },
    },
});

// 2. Calcular total
const total = cart.items.reduce((sum, item) => {
    const price = parseFloat(
        item.productVariant.salePrice || item.productVariant.price,
    );
    const quantity = parseInt(item.quantity);
    return sum + price * quantity;
}, 0);

// 3. Crear pedido
const [order] = await db
    .insert(schema.orders)
    .values({
        userId: userId,
        status: 'pending',
        totalAmount: total.toFixed(2),
        shippingAddressId: shippingAddressId,
        billingAddressId: billingAddressId,
    })
    .returning();

// 4. Crear items del pedido
const orderItems = cart.items.map((item) => ({
    orderId: order.id,
    productVariantId: item.productVariantId,
    quantity: item.quantity,
    priceAtPurchase: item.productVariant.salePrice || item.productVariant.price,
}));

await db.insert(schema.orderItems).values(orderItems);

// 5. Limpiar carrito
await db.delete(schema.cartItems).where(eq(schema.cartItems.cartId, cart.id));
```

### Obtener pedidos del usuario

```typescript
const orders = await db.query.orders.findMany({
    where: eq(schema.orders.userId, userId),
    orderBy: desc(schema.orders.createdAt),
    with: {
        items: {
            with: {
                productVariant: {
                    with: {
                        product: {
                            with: {
                                brand: true,
                            },
                        },
                    },
                },
            },
        },
        shippingAddress: true,
        payments: true,
    },
});
```

## ⭐ Wishlist

### Agregar a wishlist

```typescript
await db
    .insert(schema.wishlists)
    .values({
        userId: userId,
        productId: productId,
    })
    .onConflictDoNothing();
```

### Obtener wishlist del usuario

```typescript
const wishlist = await db.query.wishlists.findMany({
    where: eq(schema.wishlists.userId, userId),
    with: {
        product: {
            with: {
                brand: true,
                images: {
                    where: eq(schema.productImages.isPrimary, true),
                },
                variants: {
                    limit: 1,
                },
            },
        },
    },
});
```

## 🎨 Filtros

### Obtener todos los filtros

```typescript
const [genders, colors, sizes, categories] = await Promise.all([
    db.query.genders.findMany(),
    db.query.colors.findMany(),
    db.query.sizes.findMany({
        orderBy: schema.sizes.sortOrder,
    }),
    db.query.categories.findMany({
        where: eq(schema.categories.parentId, null),
    }),
]);
```

## 🔍 Búsqueda

### Buscar productos por nombre

```typescript
const products = await db.query.products.findMany({
    where: and(
        like(schema.products.name, `%${searchTerm}%`),
        eq(schema.products.isPublished, true),
    ),
    with: {
        brand: true,
        images: {
            where: eq(schema.productImages.isPrimary, true),
        },
    },
});
```

## 📊 Estadísticas

### Productos más vendidos

```typescript
const topProducts = await db
    .select({
        productId: schema.orderItems.productVariantId,
        totalSold: sql<number>`sum(cast(${schema.orderItems.quantity} as integer))`,
    })
    .from(schema.orderItems)
    .groupBy(schema.orderItems.productVariantId)
    .orderBy(desc(sql`sum(cast(${schema.orderItems.quantity} as integer))`))
    .limit(10);
```

## 🎫 Cupones

### Validar y aplicar cupón

```typescript
const coupon = await db.query.coupons.findFirst({
    where: and(
        eq(schema.coupons.code, couponCode),
        sql`${schema.coupons.expiresAt} > NOW()`,
        sql`cast(${schema.coupons.usedCount} as integer) < cast(${schema.coupons.maxUsage} as integer)`,
    ),
});

if (coupon) {
    // Aplicar descuento
    let discount = 0;
    if (coupon.discountType === 'percentage') {
        discount = (total * parseFloat(coupon.discountValue)) / 100;
    } else {
        discount = parseFloat(coupon.discountValue);
    }

    // Incrementar uso
    await db
        .update(schema.coupons)
        .set({
            usedCount: (parseInt(coupon.usedCount) + 1).toString(),
        })
        .where(eq(schema.coupons.id, coupon.id));
}
```

## 📝 Validación con Zod

```typescript
import {
    insertProductSchema,
    insertProductVariantSchema,
} from '@/lib/db/schema';

// Validar datos antes de insertar
const validatedProduct = insertProductSchema.parse({
    name: 'Air Max 2025',
    description: 'Latest technology',
    categoryId: categoryId,
    genderId: genderId,
    brandId: brandId,
    isPublished: true,
});

const validatedVariant = insertProductVariantSchema.parse({
    productId: product.id,
    sku: 'AM2025-BLACK-US9',
    price: '180.00',
    colorId: colorId,
    sizeId: sizeId,
    inStock: '50',
});
```

## 🔐 Tipos TypeScript

```typescript
import type {
    Product,
    NewProduct,
    ProductVariant,
    Order,
    Cart,
    CartItem,
} from '@/lib/db/schema';

// Usar tipos inferidos
const product: Product = await db.query.products.findFirst({
    where: eq(schema.products.id, productId),
});

const newProduct: NewProduct = {
    name: 'Air Max 2025',
    description: 'Latest technology',
    categoryId: categoryId,
    genderId: genderId,
    brandId: brandId,
    isPublished: true,
};
```
