# Product Actions - Documentación

## Descripción General

Este documento describe las acciones de servidor implementadas para la gestión de productos en la aplicación de comercio electrónico Nike.

## Acciones Disponibles

### 1. `getAllProducts(filters)`

Obtiene una lista paginada de productos con soporte completo para filtrado, búsqueda, clasificación y paginación.

#### Parámetros

```typescript
interface ProductFilters {
    search?: string; // Búsqueda por nombre o descripción
    brandIds?: string[]; // Filtrar por IDs de marca
    categoryIds?: string[]; // Filtrar por IDs de categoría
    genderIds?: string[]; // Filtrar por IDs de género
    colorIds?: string[]; // Filtrar por IDs de color
    sizeIds?: string[]; // Filtrar por IDs de talla
    priceMin?: number; // Precio mínimo
    priceMax?: number; // Precio máximo
    sortBy?: 'price_asc' | 'price_desc' | 'latest' | 'name_asc' | 'name_desc';
    page?: number; // Número de página (default: 1)
    limit?: number; // Productos por página (default: 12)
}
```

#### Retorno

```typescript
interface GetAllProductsResult {
    products: ProductWithDetails[]; // Lista de productos
    totalCount: number; // Total de productos que coinciden
    page: number; // Página actual
    limit: number; // Límite por página
    totalPages: number; // Total de páginas
}
```

#### Ejemplo de Uso

```typescript
import { getAllProducts } from '@/lib/actions/product';

// Obtener productos con filtros
const result = await getAllProducts({
    search: 'Air Max',
    brandIds: ['brand-uuid-1'],
    colorIds: ['color-uuid-1', 'color-uuid-2'],
    priceMin: 50,
    priceMax: 200,
    sortBy: 'price_asc',
    page: 1,
    limit: 12,
});

console.log(result.products); // Array de productos
console.log(result.totalCount); // Total de productos
console.log(result.totalPages); // Total de páginas
```

### 2. `getProduct(productId)`

Obtiene los detalles completos de un producto específico, incluyendo todas sus variantes e imágenes.

#### Parámetros

- `productId: string` - ID del producto a obtener

#### Retorno

```typescript
interface ProductDetailWithVariants {
    id: string;
    name: string;
    description: string;
    category: Category;
    brand: Brand;
    gender: Gender;
    variants: Array<{
        id: string;
        sku: string;
        price: string;
        salePrice: string | null;
        inStock: string;
        color: Color;
        size: Size;
    }>;
    images: Array<{
        id: string;
        url: string;
        variantId: string | null;
        sortOrder: string;
        isPrimary: boolean;
    }>;
}
```

#### Ejemplo de Uso

```typescript
import { getProduct } from '@/lib/actions/product';

// Obtener detalles de un producto
const product = await getProduct('product-uuid');

if (product) {
    console.log(product.name);
    console.log(product.variants); // Todas las variantes
    console.log(product.images); // Todas las imágenes
}
```

## Utilidades de Consulta

### `parseFilters(searchParams)`

Convierte los parámetros de URL en un objeto de filtros estructurado.

```typescript
import { parseFilters } from '@/lib/utils/query';

const filters = parseFilters(searchParams.toString());
// filters = { gender: ['men'], color: ['red', 'blue'], ... }
```

### `buildProductQueryObject(filters)`

Convierte los filtros parseados en un objeto de consulta para la base de datos.

```typescript
import { buildProductQueryObject } from '@/lib/utils/query';

const queryObject = buildProductQueryObject(filters);
// queryObject = { genderIds: [...], colorIds: [...], page: 1, limit: 12 }
```

## Optimizaciones de Rendimiento

### 1. Consultas Optimizadas

- **Una sola consulta principal**: Todos los datos se obtienen en una consulta con subconsultas para agregaciones
- **Sin N+1**: Las relaciones se cargan usando joins eficientes
- **Agregaciones en SQL**: Los precios min/max se calculan en la base de datos

### 2. Filtrado Eficiente

- Los filtros de variantes (color, talla, precio) se aplican primero en una subconsulta
- Solo se cargan los productos que coinciden con todos los filtros
- Los filtros se combinan con `AND` para máxima precisión

### 3. Imágenes Inteligentes

- Si se filtra por color, se devuelven imágenes específicas de ese color
- Si no hay filtro de color, se devuelven imágenes genéricas del producto
- La imagen primaria se selecciona automáticamente

### 4. Paginación

- Límite por defecto de 12 productos por página
- Offset calculado automáticamente
- Total de páginas incluido en la respuesta

## Índices Recomendados

Para optimizar el rendimiento, se recomiendan los siguientes índices compuestos:

```sql
-- Índice para productos publicados por marca
CREATE INDEX idx_products_brand_published
ON products(brand_id, is_published);

-- Índice para productos publicados por categoría
CREATE INDEX idx_products_category_published
ON products(category_id, is_published);

-- Índice para productos publicados por género
CREATE INDEX idx_products_gender_published
ON products(gender_id, is_published);

-- Índice para variantes por color y producto
CREATE INDEX idx_variants_color_product
ON product_variants(color_id, product_id);

-- Índice para variantes por talla y producto
CREATE INDEX idx_variants_size_product
ON product_variants(size_id, product_id);

-- Índice para variantes por precio
CREATE INDEX idx_variants_price
ON product_variants(CAST(price AS DECIMAL));

-- Índice para imágenes primarias
CREATE INDEX idx_images_primary
ON product_images(product_id, is_primary, sort_order);

-- Índice para imágenes por variante
CREATE INDEX idx_images_variant
ON product_images(variant_id, sort_order);

-- Índice para búsqueda de texto
CREATE INDEX idx_products_name_search
ON products USING gin(to_tsvector('english', name));

CREATE INDEX idx_products_description_search
ON products USING gin(to_tsvector('english', description));
```

## Uso en Páginas

### Página de Listado de Productos

```typescript
// app/(root)/products/page.tsx
export default async function ProductsPage({ searchParams }) {
    const params = await searchParams;
    const filters = parseFilters(new URLSearchParams(params).toString());
    const queryObject = buildProductQueryObject(filters);

    const { products, totalCount, page, totalPages } =
        await getAllProducts(queryObject);

    return (
        <div>
            {products.map(product => (
                <Card
                    key={product.id}
                    title={product.name}
                    image={product.primaryImage}
                    price={parseFloat(product.minPrice)}
                />
            ))}
        </div>
    );
}
```

### Página de Detalle de Producto

```typescript
// app/(root)/products/[id]/page.tsx
export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            {/* Renderizar variantes, imágenes, etc. */}
        </div>
    );
}
```

## Manejo de Errores

Todas las acciones incluyen manejo de errores:

```typescript
try {
    const result = await getAllProducts(filters);
    // Usar result
} catch (error) {
    console.error('Error fetching products:', error);
    // Manejar error apropiadamente
}
```

## Tipos TypeScript

Todos los tipos están completamente tipados con TypeScript para máxima seguridad de tipos:

- `ProductFilters` - Parámetros de filtrado
- `ProductWithDetails` - Producto con datos agregados
- `ProductDetailWithVariants` - Producto completo con variantes
- `GetAllProductsResult` - Resultado de getAllProducts

## Notas Importantes

1. **Productos Publicados**: Solo se devuelven productos con `isPublished = true`
2. **Valores por Defecto**: Si no se especifican, se usan valores sensatos (página 1, límite 12, orden por fecha)
3. **Filtros Vacíos**: Si no hay productos que coincidan, se devuelve un array vacío
4. **Imágenes Faltantes**: Si un producto no tiene imágenes, `primaryImage` será `null`
5. **Precios**: Los precios se almacenan como texto para evitar problemas de precisión, pero se pueden convertir a número con `parseFloat()`
