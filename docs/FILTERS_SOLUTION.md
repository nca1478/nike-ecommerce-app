# Solución de Filtros - Slugs a UUIDs

## ✅ Problema Resuelto

Los filtros ahora funcionan correctamente convirtiendo slugs a UUIDs automáticamente.

## 🔧 Solución Implementada

Se creó una Server Action `resolveFilterSlugs()` que convierte slugs amigables a UUIDs de base de datos.

### Archivo Creado: `/lib/actions/filters.ts`

```typescript
export async function resolveFilterSlugs(
    filters: FilterParams,
): Promise<ProductFilters> {
    const resolved: ProductFilters = {};

    // Resolver gender slugs a IDs
    if (filters.gender) {
        const genderSlugs = Array.isArray(filters.gender)
            ? filters.gender
            : [filters.gender];

        const genderResults = await db
            .select({ id: genders.id })
            .from(genders)
            .where(inArray(genders.slug, genderSlugs));

        if (genderResults.length > 0) {
            resolved.genderIds = genderResults.map((g) => g.id);
        }
    }

    // Similar para colors, sizes, brands, categories...

    return resolved;
}
```

### Actualización en `/app/(root)/products/page.tsx`

```typescript
// Antes
const queryObject = buildProductQueryObject(filters);

// Después
const queryObject = await resolveFilterSlugs(filters);
```

## 🎯 Ventajas de Esta Solución

1. **URLs Amigables**: `/products?gender=men&color=red`
2. **Flexibilidad**: Los UUIDs pueden cambiar sin afectar las URLs
3. **Mantenibilidad**: No necesitas actualizar manualmente los IDs
4. **Sincronización**: Siempre usa los datos actuales de la base de datos

## 📊 Estado Actual

### Funciona Completamente ✅

- ✅ Listado de productos
- ✅ Búsqueda por texto
- ✅ Filtros por género
- ✅ Filtros por color
- ✅ Filtros por talla
- ✅ Filtros por marca
- ✅ Filtros por categoría
- ✅ Filtros por precio
- ✅ Ordenamiento (precio, fecha, nombre)
- ✅ Paginación
- ✅ Navegación a detalle de producto

## 🔄 Flujo de Datos

```
1. Usuario selecciona filtro "Men" en UI
                    ↓
2. URL: /products?gender=men
                    ↓
3. parseFilters() → { gender: 'men' }
                    ↓
4. resolveFilterSlugs() consulta DB:
   SELECT id FROM genders WHERE slug = 'men'
   → Retorna UUID: 'abc-123-...'
                    ↓
5. getAllProducts({ genderIds: ['abc-123-...'] })
                    ↓
6. Query SQL con UUID correcto
                    ↓
7. Productos filtrados correctamente
```

## 📝 Ejemplo de Uso

### Filtrar por Género

```
URL: /products?gender=men
Resultado: Solo productos de hombre
```

### Filtrar por Color

```
URL: /products?color=red
Resultado: Solo productos rojos
```

### Múltiples Filtros

```
URL: /products?gender=women&color=black&size=m
Resultado: Productos de mujer, negros, talla M
```

### Con Búsqueda

```
URL: /products?search=nike&gender=men
Resultado: Productos Nike de hombre
```

## 🚀 Rendimiento

### Consultas Adicionales

La solución agrega consultas para resolver slugs:

- 1 consulta por tipo de filtro activo
- Máximo 5 consultas adicionales (gender, color, size, brand, category)
- Consultas muy rápidas (índices en columna slug)

### Optimización Futura

Si el rendimiento es crítico, se puede implementar caché:

```typescript
import { unstable_cache } from 'next/cache';

const getCachedFilterIds = unstable_cache(
    async (slugs: string[], type: string) => {
        // Resolver slugs...
    },
    ['filter-ids'],
    { revalidate: 3600 }, // 1 hora
);
```

## 📚 Archivos Modificados/Creados

### Creados

- ✅ `/lib/actions/filters.ts` - Resolución de slugs

### Modificados

- ✅ `/app/(root)/products/page.tsx` - Usa resolveFilterSlugs
- ✅ `/lib/utils/query.ts` - Mantiene validación UUID como fallback

## 🎓 Función Adicional: getFilterOptions()

También se creó una función para obtener opciones de filtros dinámicamente:

```typescript
export async function getFilterOptions() {
    const [gendersData, colorsData, sizesData] = await Promise.all([
        db.select().from(genders),
        db.select().from(colors),
        db.select().from(sizes),
    ]);

    return {
        genders: gendersData.map((g) => ({
            label: g.label,
            value: g.slug,
            id: g.id,
        })),
        // ...
    };
}
```

**Uso futuro**: Reemplazar `filterOptions` estático con datos dinámicos de la base de datos.

## ✅ Verificación

Para verificar que los filtros funcionan:

1. **Visita** `/products`
2. **Selecciona** un filtro (ej: "Men")
3. **Verifica** que la URL cambie: `/products?gender=men`
4. **Confirma** que los productos se filtren correctamente
5. **Prueba** múltiples filtros combinados

## 🎉 Conclusión

Los filtros ahora funcionan completamente con:

- ✅ URLs amigables (slugs)
- ✅ Base de datos con UUIDs
- ✅ Conversión automática
- ✅ Sin errores
- ✅ Rendimiento óptimo

---

**Última actualización:** Noviembre 2025  
**Estado:** ✅ Completamente funcional  
**Prioridad:** ✅ Resuelto
