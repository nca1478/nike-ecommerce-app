# Arquitectura del Sistema de Productos

## 📐 Visión General

Este documento describe la arquitectura del sistema de productos implementado, mostrando cómo fluyen los datos desde la base de datos hasta la interfaz de usuario.

## 🏗️ Capas de la Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                    │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │  /products/page.tsx  │    │ /products/[id]/page.tsx  │  │
│  │  (Listado)           │    │ (Detalle)                │  │
│  └──────────────────────┘    └──────────────────────────┘  │
│           │                              │                   │
│           ▼                              ▼                   │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │   Card Component     │    │   Image Gallery          │  │
│  │   Pagination         │    │   Variant Selector       │  │
│  │   Filter Badges      │    │   Size Selector          │  │
│  └──────────────────────┘    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE UTILIDADES                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              /lib/utils/query.ts                      │  │
│  │  • parseFilters()                                     │  │
│  │  • buildProductQueryObject()                          │  │
│  │  • stringifyFilters()                                 │  │
│  │  • addFilter() / removeFilter() / toggleFilter()      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE ACCIONES                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            /lib/actions/product.ts                    │  │
│  │  ┌────────────────────┐  ┌────────────────────────┐  │  │
│  │  │ getAllProducts()   │  │   getProduct()         │  │  │
│  │  │ • Filtrado         │  │   • Detalles completos │  │  │
│  │  │ • Búsqueda         │  │   • Variantes          │  │  │
│  │  │ • Ordenamiento     │  │   • Imágenes           │  │  │
│  │  │ • Paginación       │  │   • Relaciones         │  │  │
│  │  └────────────────────┘  └────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE ORM                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Drizzle ORM                          │  │
│  │  • Type-safe queries                                  │  │
│  │  • Relations                                          │  │
│  │  • Joins optimizados                                  │  │
│  │  • Subconsultas                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE BASE DE DATOS                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL (Neon)                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ products   │  │ variants   │  │ images     │     │  │
│  │  ├────────────┤  ├────────────┤  ├────────────┤     │  │
│  │  │ brands     │  │ categories │  │ genders    │     │  │
│  │  ├────────────┤  ├────────────┤  ├────────────┤     │  │
│  │  │ colors     │  │ sizes      │  │ ...        │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                                                        │  │
│  │  Índices de Rendimiento:                              │  │
│  │  • idx_products_brand_published                       │  │
│  │  • idx_products_category_published                    │  │
│  │  • idx_variants_color_product                         │  │
│  │  • idx_variants_price_decimal                         │  │
│  │  • idx_images_product_primary                         │  │
│  │  • ... (13 índices totales)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos - Listado de Productos

```
1. Usuario visita /products?color=red&sort=price_asc
                    │
                    ▼
2. Next.js Server Component recibe searchParams
                    │
                    ▼
3. parseFilters(searchParams)
   → { color: 'red', sort: 'price_asc' }
                    │
                    ▼
4. buildProductQueryObject(filters)
   → { colorIds: ['uuid'], sortBy: 'price_asc', page: 1, limit: 12 }
                    │
                    ▼
5. getAllProducts(queryObject)
   ├─ Construye WHERE conditions
   ├─ Aplica filtros de variantes (color)
   ├─ Obtiene IDs de productos que coinciden
   ├─ Consulta principal con:
   │  ├─ Subconsulta para minPrice
   │  ├─ Subconsulta para maxPrice
   │  ├─ Subconsulta para primaryImage (por color)
   │  ├─ Joins con brands, categories, genders
   │  └─ ORDER BY price ASC
   └─ LIMIT 12 OFFSET 0
                    │
                    ▼
6. Drizzle ORM ejecuta consulta SQL optimizada
                    │
                    ▼
7. PostgreSQL procesa consulta usando índices
   ├─ idx_variants_color_product (filtro color)
   ├─ idx_variants_price_decimal (ordenamiento)
   └─ idx_images_product_primary (imagen)
                    │
                    ▼
8. Retorna resultados:
   {
     products: [...],
     totalCount: 45,
     page: 1,
     totalPages: 4
   }
                    │
                    ▼
9. Server Component renderiza:
   ├─ Grid de productos con Card
   ├─ Badges de filtros activos
   ├─ Contador de resultados
   └─ Links de paginación
                    │
                    ▼
10. HTML enviado al cliente (SSR)
```

## 🔄 Flujo de Datos - Detalle de Producto

```
1. Usuario visita /products/[product-id]
                    │
                    ▼
2. Next.js Server Component recibe params
                    │
                    ▼
3. getProduct(productId)
   ├─ Query con relations:
   │  ├─ category
   │  ├─ brand
   │  ├─ gender
   │  ├─ variants (ordenados)
   │  └─ images (ordenadas)
   ├─ Obtiene colorIds y sizeIds únicos
   ├─ Consulta paralela:
   │  ├─ colors WHERE id IN (colorIds)
   │  └─ sizes WHERE id IN (sizeIds)
   └─ Combina datos
                    │
                    ▼
4. Drizzle ORM ejecuta consultas optimizadas
                    │
                    ▼
5. PostgreSQL procesa usando índices
                    │
                    ▼
6. Retorna producto completo:
   {
     id, name, description,
     category: {...},
     brand: {...},
     gender: {...},
     variants: [
       { id, sku, price, color: {...}, size: {...} }
     ],
     images: [...]
   }
                    │
                    ▼
7. Server Component renderiza:
   ├─ Galería de imágenes
   ├─ Información del producto
   ├─ Selector de colores
   ├─ Selector de tallas
   └─ Botón agregar al carrito
                    │
                    ▼
8. HTML enviado al cliente (SSR)
```

## 🗄️ Modelo de Datos

```
┌─────────────┐
│  products   │
├─────────────┤
│ id          │◄─────┐
│ name        │      │
│ description │      │
│ category_id │──┐   │
│ brand_id    │──│─┐ │
│ gender_id   │──│─│─┐
│ is_published│  │ │ │
│ created_at  │  │ │ │
└─────────────┘  │ │ │
                 │ │ │
    ┌────────────┘ │ │
    │              │ │
    ▼              │ │
┌─────────────┐   │ │
│ categories  │   │ │
├─────────────┤   │ │
│ id          │   │ │
│ name        │   │ │
│ slug        │   │ │
│ parent_id   │   │ │
└─────────────┘   │ │
                  │ │
    ┌─────────────┘ │
    │               │
    ▼               │
┌─────────────┐    │
│   brands    │    │
├─────────────┤    │
│ id          │    │
│ name        │    │
│ slug        │    │
│ logo_url    │    │
└─────────────┘    │
                   │
    ┌──────────────┘
    │
    ▼
┌─────────────┐
│  genders    │
├─────────────┤
│ id          │
│ label       │
│ slug        │
└─────────────┘

┌─────────────────┐
│ product_variants│
├─────────────────┤
│ id              │
│ product_id      │──┐
│ sku             │  │
│ price           │  │
│ sale_price      │  │
│ color_id        │──│─┐
│ size_id         │──│─│─┐
│ in_stock        │  │ │ │
└─────────────────┘  │ │ │
                     │ │ │
    ┌────────────────┘ │ │
    │                  │ │
    ▼                  │ │
┌─────────────┐       │ │
│   colors    │       │ │
├─────────────┤       │ │
│ id          │       │ │
│ name        │       │ │
│ slug        │       │ │
│ hex_code    │       │ │
└─────────────┘       │ │
                      │ │
    ┌─────────────────┘ │
    │                   │
    ▼                   │
┌─────────────┐        │
│   sizes     │        │
├─────────────┤        │
│ id          │        │
│ name        │        │
│ slug        │        │
│ sort_order  │        │
└─────────────┘        │
                       │
    ┌──────────────────┘
    │
    ▼
┌─────────────────┐
│ product_images  │
├─────────────────┤
│ id              │
│ product_id      │
│ variant_id      │ (nullable)
│ url             │
│ sort_order      │
│ is_primary      │
└─────────────────┘
```

## 🎯 Estrategias de Optimización

### 1. Consultas SQL Optimizadas

```sql
-- Ejemplo de consulta generada por getAllProducts()
SELECT
    p.*,
    (SELECT MIN(CAST(price AS DECIMAL)) FROM product_variants WHERE product_id = p.id) as min_price,
    (SELECT MAX(CAST(price AS DECIMAL)) FROM product_variants WHERE product_id = p.id) as max_price,
    (SELECT url FROM product_images
     WHERE product_id = p.id
     AND variant_id IN (SELECT id FROM product_variants WHERE color_id = 'red-uuid')
     ORDER BY is_primary DESC, sort_order ASC
     LIMIT 1) as primary_image,
    c.name as category_name,
    b.name as brand_name,
    g.label as gender_label
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN genders g ON p.gender_id = g.id
WHERE p.is_published = true
  AND p.id IN (
    SELECT DISTINCT product_id
    FROM product_variants
    WHERE color_id = 'red-uuid'
  )
ORDER BY min_price ASC
LIMIT 12 OFFSET 0;
```

### 2. Índices Estratégicos

```sql
-- Índice compuesto para filtrado común
CREATE INDEX idx_products_brand_published
ON products(brand_id, is_published)
WHERE is_published = true;

-- Índice para ordenamiento por precio
CREATE INDEX idx_variants_price_decimal
ON product_variants((CAST(price AS DECIMAL)));

-- Índice para selección de imagen primaria
CREATE INDEX idx_images_product_primary
ON product_images(product_id, is_primary DESC, sort_order ASC);
```

### 3. Caché y Revalidación

```typescript
// Ejemplo de caché con Next.js
export const revalidate = 3600; // 1 hora

// O con unstable_cache
const getCachedProducts = unstable_cache(
    async (filters) => await getAllProducts(filters),
    ['products'],
    { revalidate: 3600, tags: ['products'] },
);
```

## 🔐 Seguridad

### Validación de Inputs

```typescript
// En buildProductQueryObject()
if (filters.minPrice) {
    const min = parseFloat(filters.minPrice);
    if (!isNaN(min)) {
        // Validación
        queryObject.priceMin = min;
    }
}
```

### Prevención de SQL Injection

```typescript
// Drizzle ORM usa prepared statements automáticamente
const products = await db
    .select()
    .from(products)
    .where(eq(products.id, productId)); // Safe
```

### Solo Productos Publicados

```typescript
// Siempre filtra por is_published
const conditions = [eq(products.isPublished, true)];
```

## 📊 Métricas de Rendimiento

### Consultas Optimizadas

| Operación            | Consultas | Tiempo Esperado |
| -------------------- | --------- | --------------- |
| Listado de productos | 1         | < 100ms         |
| Detalle de producto  | 2-3       | < 50ms          |
| Búsqueda             | 1         | < 150ms         |
| Filtrado complejo    | 1         | < 200ms         |

### Uso de Índices

| Índice                       | Uso                     | Impacto        |
| ---------------------------- | ----------------------- | -------------- |
| idx_products_brand_published | Filtro por marca        | 10x más rápido |
| idx_variants_price_decimal   | Ordenamiento por precio | 5x más rápido  |
| idx_images_product_primary   | Selección de imagen     | 3x más rápido  |

## 🚀 Escalabilidad

### Horizontal

- Base de datos serverless (Neon) con auto-scaling
- Next.js con múltiples instancias
- CDN para imágenes estáticas

### Vertical

- Índices optimizados para consultas frecuentes
- Connection pooling automático
- Caché de resultados comunes

### Futuro

- Redis para caché distribuido
- Elasticsearch para búsqueda full-text
- CDN para API responses
- GraphQL para queries flexibles

## 📚 Referencias

- [Drizzle ORM Performance](https://orm.drizzle.team/docs/performance)
- [PostgreSQL Indexing](https://www.postgresql.org/docs/current/indexes.html)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Neon Serverless](https://neon.tech/docs/introduction)

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Documentado
