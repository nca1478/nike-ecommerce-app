# 🏗️ Esquema de Base de Datos - Nike eCommerce

## 📊 Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTENTICACIÓN (Better Auth)                 │
├─────────────────────────────────────────────────────────────────┤
│  user ──┬── account                                              │
│         ├── session                                              │
│         └── verification                                         │
│  guest                                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTOS                                │
├─────────────────────────────────────────────────────────────────┤
│  brands ──┐                                                      │
│           │                                                      │
│  categories ──┐                                                  │
│               │                                                  │
│  genders ──┐  │                                                  │
│            │  │                                                  │
│            ├──┴── products ──┬── product_variants ──┐           │
│            │                 │                       │           │
│  colors ───┤                 ├── product_images      │           │
│            │                 │                       │           │
│  sizes ────┘                 └── reviews             │           │
│                                                      │           │
│  collections ──── product_collections ───────────────┘           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CARRITO Y PEDIDOS                           │
├─────────────────────────────────────────────────────────────────┤
│  user/guest ──── carts ──── cart_items ──── product_variants    │
│                                                                  │
│  user ──── addresses ──┬── orders ──┬── order_items             │
│                        │            │                           │
│                        └────────────┴── payments                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CARACTERÍSTICAS                             │
├─────────────────────────────────────────────────────────────────┤
│  user ──── wishlists ──── products                              │
│                                                                  │
│  coupons (standalone)                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Resumen de Tablas

### Autenticación (5 tablas)

- ✅ `user` - Usuarios registrados
- ✅ `account` - Cuentas de autenticación
- ✅ `session` - Sesiones activas
- ✅ `guest` - Usuarios invitados
- ✅ `verification` - Tokens de verificación

### Productos (11 tablas)

- ✅ `products` - Productos principales
- ✅ `product_variants` - Variantes (color + talla)
- ✅ `product_images` - Imágenes de productos
- ✅ `reviews` - Reseñas de productos
- ✅ `categories` - Categorías (con subcategorías)
- ✅ `brands` - Marcas
- ✅ `collections` - Colecciones
- ✅ `product_collections` - Relación productos-colecciones
- ✅ `genders` - Filtro de género
- ✅ `colors` - Filtro de colores
- ✅ `sizes` - Filtro de tallas

### Carrito y Pedidos (8 tablas)

- ✅ `carts` - Carritos de compra
- ✅ `cart_items` - Items del carrito
- ✅ `orders` - Pedidos
- ✅ `order_items` - Items del pedido
- ✅ `payments` - Pagos
- ✅ `addresses` - Direcciones

### Características (2 tablas)

- ✅ `wishlists` - Lista de deseos
- ✅ `coupons` - Cupones de descuento

## 🎯 Total: 24 Tablas

## 🔑 Características Clave

### ✨ Normalización

- Separación de productos y variantes
- Filtros independientes (colores, tallas, géneros)
- Direcciones reutilizables

### 🔐 Integridad Referencial

- Foreign keys con acciones CASCADE/RESTRICT
- Constraints UNIQUE en campos críticos
- Validación Zod en todos los esquemas

### 📈 Escalabilidad

- UUID como identificadores
- Estructura modular
- Soporte para subcategorías
- Múltiples imágenes por producto/variante

### 🛡️ Seguridad

- Precios como texto (precisión decimal)
- Enums para estados y tipos
- Validación en capa de aplicación

## 📦 Datos Iniciales (Seed)

- **4** géneros
- **11** colores
- **14** tallas
- **1** marca (Nike)
- **5** categorías
- **3** colecciones
- **15** productos
- **~150+** variantes (combinaciones color-talla)
- **15** imágenes copiadas a `/public/uploads/`

## 🚀 Comandos

```bash
# Generar migraciones
npm run db:generate

# Aplicar a base de datos
npm run db:push

# Poblar con datos
npm run db:seed
```

## ✅ Estado: COMPLETADO

Todos los esquemas han sido implementados, migrados y poblados exitosamente.
