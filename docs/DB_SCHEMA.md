# Database Schema Documentation

## 📁 Estructura de Esquemas

La base de datos está organizada de forma modular para facilitar el mantenimiento y la escalabilidad.

### Esquemas de Autenticación (Better Auth)

- `user.ts` - Usuarios del sistema
- `account.ts` - Cuentas de autenticación (OAuth, credenciales)
- `session.ts` - Sesiones de usuario
- `guest.ts` - Usuarios invitados
- `verification.ts` - Tokens de verificación

### Esquemas Core

- `products.ts` - Productos, variantes, imágenes y reseñas
- `categories.ts` - Categorías de productos (con soporte para subcategorías)
- `brands.ts` - Marcas de productos
- `collections.ts` - Colecciones de productos (ej: "Summer 2025")
- `addresses.ts` - Direcciones de envío y facturación
- `carts.ts` - Carritos de compra y sus items
- `orders.ts` - Pedidos, items de pedidos y pagos
- `coupons.ts` - Cupones de descuento
- `wishlists.ts` - Lista de deseos

### Filtros

- `filters/genders.ts` - Géneros (Men, Women, Unisex, Kids)
- `filters/colors.ts` - Colores con códigos hexadecimales
- `filters/sizes.ts` - Tallas ordenadas

## 🗄️ Tablas Principales

### Products

```typescript
- id: uuid (pk)
- name: string
- description: text
- category_id: uuid (fk)
- gender_id: uuid (fk)
- brand_id: uuid (fk)
- is_published: boolean
- default_variant_id: uuid (nullable)
- created_at: timestamp
- updated_at: timestamp
```

### Product Variants

```typescript
- id: uuid (pk)
- product_id: uuid (fk)
- sku: string (unique)
- price: text
- sale_price: text (nullable)
- color_id: uuid (fk)
- size_id: uuid (fk)
- in_stock: text
- weight: text
- dimensions: text (JSON)
- created_at: timestamp
```

### Orders

```typescript
- id: uuid (pk)
- user_id: uuid (fk)
- status: enum (pending, paid, shipped, delivered, cancelled)
- total_amount: text
- shipping_address_id: uuid (fk)
- billing_address_id: uuid (fk)
- created_at: timestamp
```

## 🔧 Scripts Disponibles

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push

# Poblar base de datos con datos de prueba
npm run db:seed
```

## 📊 Datos de Seed

El script de seed incluye:

- 4 géneros (Men, Women, Unisex, Kids)
- 11 colores con códigos hex
- 14 tallas (US 6 - US 13)
- 1 marca (Nike)
- 5 categorías (Running, Basketball, Training, Lifestyle, Soccer)
- 3 colecciones (Summer 2025, Best Sellers, New Arrivals)
- 15 productos Nike con múltiples variantes (colores y tallas)
- Imágenes copiadas a `/public/uploads/`

## 🔐 Validación

Todos los esquemas incluyen validación Zod para:

- Inserción de datos (`insertSchema`)
- Selección de datos (`selectSchema`)
- Tipos TypeScript inferidos automáticamente

## 🔗 Relaciones

Las relaciones están definidas usando `relations()` de Drizzle ORM:

- One-to-Many: Product → Variants, Product → Images
- Many-to-One: Variant → Product, Order → User
- Many-to-Many: Products ↔ Collections

## 📝 Notas

- Todos los IDs son UUID v4
- Los precios se almacenan como texto para evitar problemas de precisión
- Las cantidades también se almacenan como texto
- Las dimensiones se almacenan como JSON string
- Snake_case en la base de datos, camelCase en TypeScript
