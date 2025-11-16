# Ejemplos de Uso - Product Actions

Este documento proporciona ejemplos prácticos de cómo usar las acciones de productos en diferentes escenarios.

## Escenarios Comunes

### 1. Listado Simple de Productos

```typescript
import { getAllProducts } from '@/lib/actions/product';

// Obtener los primeros 12 productos más recientes
const { products } = await getAllProducts();
```

### 2. Búsqueda de Productos

```typescript
// Buscar productos que contengan "Air Max" en nombre o descripción
const { products, totalCount } = await getAllProducts({
    search: 'Air Max',
});

console.log(`Encontrados ${totalCount} productos`);
```

### 3. Filtrar por Marca

```typescript
// Obtener productos de Nike
const { products } = await getAllProducts({
    brandIds: ['nike-brand-uuid'],
    page: 1,
    limit: 20,
});
```

### 4. Filtrar por Múltiples Criterios

```typescript
// Zapatillas de hombre, rojas o azules, entre $50 y $150
const { products } = await getAllProducts({
    categoryIds: ['sneakers-category-uuid'],
    genderIds: ['men-gender-uuid'],
    colorIds: ['red-color-uuid', 'blue-color-uuid'],
    priceMin: 50,
    priceMax: 150,
    sortBy: 'price_asc',
});
```

### 5. Paginación

```typescript
// Página 2 de resultados
const { products, page, totalPages } = await getAllProducts({
    page: 2,
    limit: 12,
});

console.log(`Página ${page} de ${totalPages}`);
```

### 6. Ordenamiento

```typescript
// Productos más recientes primero
const latest = await getAllProducts({
    sortBy: 'latest',
});

// Productos más baratos primero
const cheapest = await getAllProducts({
    sortBy: 'price_asc',
});

// Productos más caros primero
const expensive = await getAllProducts({
    sortBy: 'price_desc',
});

// Ordenar alfabéticamente
const alphabetical = await getAllProducts({
    sortBy: 'name_asc',
});
```

## Integración con Componentes

### Componente de Listado con Filtros

```typescript
// components/ProductList.tsx
import { getAllProducts } from '@/lib/actions/product';
import { Card } from '@/components/Card';

interface ProductListProps {
    filters: {
        search?: string;
        brandIds?: string[];
        colorIds?: string[];
        priceMin?: number;
        priceMax?: number;
    };
}

export async function ProductList({ filters }: ProductListProps) {
    const { products, totalCount } = await getAllProducts(filters);

    if (products.length === 0) {
        return <div>No se encontraron productos</div>;
    }

    return (
        <div>
            <h2>Productos ({totalCount})</h2>
            <div className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        title={product.name}
                        description={product.description}
                        image={product.primaryImage || '/placeholder.jpg'}
                        price={parseFloat(product.minPrice)}
                        category={product.category?.name}
                    />
                ))}
            </div>
        </div>
    );
}
```

### Página con Parámetros de URL

```typescript
// app/products/page.tsx
import { parseFilters, buildProductQueryObject } from '@/lib/utils/query';
import { getAllProducts } from '@/lib/actions/product';

export default async function ProductsPage({ searchParams }) {
    const params = await searchParams;

    // Convertir parámetros de URL a filtros
    const filters = parseFilters(new URLSearchParams(params).toString());

    // Construir objeto de consulta
    const queryObject = buildProductQueryObject(filters);

    // Obtener productos
    const result = await getAllProducts(queryObject);

    return (
        <div>
            <h1>Productos ({result.totalCount})</h1>
            {/* Renderizar productos */}
        </div>
    );
}
```

### Detalle de Producto con Variantes

```typescript
// app/products/[id]/page.tsx
import { getProduct } from '@/lib/actions/product';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Agrupar variantes por color
    const colorGroups = product.variants.reduce((acc, variant) => {
        if (!acc[variant.color.name]) {
            acc[variant.color.name] = [];
        }
        acc[variant.color.name].push(variant);
        return acc;
    }, {});

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            {/* Selector de Color */}
            <div>
                <h3>Colores Disponibles</h3>
                {Object.entries(colorGroups).map(([colorName, variants]) => (
                    <button key={colorName}>
                        {colorName} ({variants.length} tallas)
                    </button>
                ))}
            </div>

            {/* Selector de Talla */}
            <div>
                <h3>Tallas Disponibles</h3>
                {product.variants.map((variant) => (
                    <button
                        key={variant.id}
                        disabled={parseInt(variant.inStock) === 0}
                    >
                        {variant.size.name}
                        {parseInt(variant.inStock) === 0 && ' (Agotado)'}
                    </button>
                ))}
            </div>

            {/* Galería de Imágenes */}
            <div>
                {product.images.map((image) => (
                    <img key={image.id} src={image.url} alt={product.name} />
                ))}
            </div>
        </div>
    );
}
```

## Casos de Uso Avanzados

### 1. Productos Relacionados

```typescript
// Obtener productos de la misma categoría
async function getRelatedProducts(productId: string, categoryId: string) {
    const { products } = await getAllProducts({
        categoryIds: [categoryId],
        limit: 4,
    });

    // Excluir el producto actual
    return products.filter((p) => p.id !== productId);
}
```

### 2. Productos en Oferta

```typescript
// Obtener productos con precio de oferta
async function getProductsOnSale() {
    const { products } = await getAllProducts({
        sortBy: 'price_desc',
        limit: 10,
    });

    // Filtrar productos con variantes en oferta
    // (esto requeriría una modificación en la acción para incluir salePrice)
    return products;
}
```

### 3. Búsqueda con Autocompletado

```typescript
// Búsqueda rápida para autocompletado
async function searchProducts(query: string) {
    if (query.length < 2) return [];

    const { products } = await getAllProducts({
        search: query,
        limit: 5,
    });

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.primaryImage,
        price: p.minPrice,
    }));
}
```

### 4. Filtros Dinámicos

```typescript
// Obtener opciones de filtro disponibles basadas en productos actuales
async function getAvailableFilters(currentFilters: ProductFilters) {
    const { products } = await getAllProducts(currentFilters);

    // Extraer colores únicos disponibles
    const availableColors = [
        ...new Set(
            products.flatMap((p) => p.variants?.map((v) => v.colorId) || []),
        ),
    ];

    // Extraer tallas únicas disponibles
    const availableSizes = [
        ...new Set(
            products.flatMap((p) => p.variants?.map((v) => v.sizeId) || []),
        ),
    ];

    return {
        colors: availableColors,
        sizes: availableSizes,
    };
}
```

### 5. Exportar Productos

```typescript
// Exportar todos los productos (sin paginación)
async function exportAllProducts() {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const { products, totalPages } = await getAllProducts({
            page,
            limit: 100,
        });

        allProducts = [...allProducts, ...products];
        hasMore = page < totalPages;
        page++;
    }

    return allProducts;
}
```

## Manejo de Estados de Carga

### Con React Suspense

```typescript
// app/products/page.tsx
import { Suspense } from 'react';
import { ProductList } from '@/components/ProductList';

export default function ProductsPage({ searchParams }) {
    return (
        <div>
            <h1>Productos</h1>
            <Suspense fallback={<ProductListSkeleton />}>
                <ProductList searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

function ProductListSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-64" />
            ))}
        </div>
    );
}
```

## Optimización de Rendimiento

### 1. Caché de Resultados

```typescript
import { unstable_cache } from 'next/cache';

// Cachear resultados de productos populares
const getCachedProducts = unstable_cache(
    async (filters: ProductFilters) => {
        return await getAllProducts(filters);
    },
    ['products'],
    {
        revalidate: 3600, // Revalidar cada hora
        tags: ['products'],
    },
);
```

### 2. Revalidación Incremental

```typescript
// app/products/page.tsx
export const revalidate = 3600; // Revalidar cada hora

export default async function ProductsPage() {
    const { products } = await getAllProducts();
    return <div>{/* Renderizar productos */}</div>;
}
```

### 3. Generación Estática

```typescript
// Generar páginas estáticas para productos populares
export async function generateStaticParams() {
    const { products } = await getAllProducts({ limit: 100 });

    return products.map((product) => ({
        id: product.id,
    }));
}
```

## Testing

### Ejemplo de Test

```typescript
import { getAllProducts, getProduct } from '@/lib/actions/product';

describe('Product Actions', () => {
    it('should fetch products with filters', async () => {
        const result = await getAllProducts({
            search: 'test',
            page: 1,
            limit: 10,
        });

        expect(result.products).toBeDefined();
        expect(result.totalCount).toBeGreaterThanOrEqual(0);
        expect(result.page).toBe(1);
    });

    it('should fetch product details', async () => {
        const product = await getProduct('test-product-id');

        expect(product).toBeDefined();
        expect(product?.variants).toBeDefined();
        expect(product?.images).toBeDefined();
    });
});
```

## Notas de Rendimiento

1. **Límite de Resultados**: Siempre especifica un límite razonable para evitar cargar demasiados productos
2. **Índices**: Asegúrate de que los índices de base de datos estén creados (ver `add_performance_indexes.sql`)
3. **Caché**: Usa caché de Next.js para resultados que no cambian frecuentemente
4. **Paginación**: Implementa paginación para listas largas de productos
5. **Lazy Loading**: Considera cargar imágenes de forma diferida para mejorar el rendimiento inicial
