# Problema con Filtros - Slugs vs UUIDs

## 🐛 Problema Identificado

Los filtros en la UI están enviando **slugs** (como "men", "women", "red") pero la base de datos espera **UUIDs**.

### Error Original

```
Error: invalid input syntax for type uuid: "men"
```

## ✅ Solución Temporal Implementada

Se agregó validación en `buildProductQueryObject()` para **ignorar valores que no sean UUIDs válidos**.

```typescript
// Ahora solo se aceptan UUIDs válidos
function isValidUUID(str: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

// Los filtros con slugs se ignoran automáticamente
if (filters.gender) {
    const validGenders = filterValidUUIDs(filters.gender);
    if (validGenders.length > 0) {
        queryObject.genderIds = validGenders;
    }
}
```

### Resultado

- ✅ La página `/products` carga sin errores
- ⚠️ Los filtros actuales NO funcionan (se ignoran porque son slugs)
- ✅ La búsqueda y ordenamiento SÍ funcionan
- ✅ La paginación SÍ funciona

## 🔧 Solución Permanente (Pendiente)

Hay 3 opciones para solucionar esto correctamente:

### Opción 1: Modificar Filtros para Usar UUIDs (Recomendado)

Actualizar `filterOptions` en `/lib/data/mock-products.ts` para usar UUIDs reales de la base de datos.

**Antes:**

```typescript
export const filterOptions = {
    genders: [
        { label: 'Men', value: 'men' },
        { label: 'Women', value: 'women' },
    ],
    // ...
};
```

**Después:**

```typescript
export const filterOptions = {
    genders: [
        { label: 'Men', value: 'uuid-del-genero-men' },
        { label: 'Women', value: 'uuid-del-genero-women' },
    ],
    // ...
};
```

**Pasos:**

1. Obtener UUIDs reales de la base de datos:

    ```sql
    SELECT id, label, slug FROM genders;
    SELECT id, name, slug FROM colors;
    SELECT id, name, slug FROM sizes;
    ```

2. Actualizar `filterOptions` con los UUIDs reales

3. Los filtros funcionarán automáticamente

### Opción 2: Crear Server Action para Resolver Slugs

Crear una función que convierta slugs a UUIDs antes de la consulta.

```typescript
// lib/actions/filters.ts
export async function resolveFilterSlugs(filters: FilterParams) {
    const resolved: ProductFilters = {};

    // Resolver gender slugs a IDs
    if (filters.gender) {
        const genders = await db
            .select()
            .from(gendersTable)
            .where(
                inArray(
                    gendersTable.slug,
                    Array.isArray(filters.gender)
                        ? filters.gender
                        : [filters.gender],
                ),
            );
        resolved.genderIds = genders.map((g) => g.id);
    }

    // Similar para colors, sizes, etc.

    return resolved;
}
```

**Ventajas:**

- URLs amigables con slugs
- Flexibilidad para cambiar UUIDs

**Desventajas:**

- Consultas adicionales a la base de datos
- Más complejo

### Opción 3: Cargar Filtros Dinámicamente desde la Base de Datos

Crear un Server Component que cargue los filtros disponibles desde la base de datos.

```typescript
// components/DynamicFilters.tsx
export async function DynamicFilters() {
    const genders = await db.select().from(gendersTable);
    const colors = await db.select().from(colorsTable);
    const sizes = await db.select().from(sizesTable);

    return <FiltersUI genders={genders} colors={colors} sizes={sizes} />;
}
```

**Ventajas:**

- Siempre sincronizado con la base de datos
- No necesita mantenimiento manual

**Desventajas:**

- Consulta adicional en cada carga
- Más complejo de implementar

## 📋 Implementación Recomendada (Opción 1)

### Paso 1: Obtener UUIDs de la Base de Datos

```bash
# Conectarse a la base de datos
psql -d your_database

# Obtener IDs
SELECT id, label, slug FROM genders;
SELECT id, name, slug, hex_code FROM colors;
SELECT id, name, slug FROM sizes;
```

### Paso 2: Actualizar filterOptions

```typescript
// lib/data/mock-products.ts
export const filterOptions = {
    genders: [
        { label: 'Men', value: 'uuid-aqui', slug: 'men' },
        { label: 'Women', value: 'uuid-aqui', slug: 'women' },
        { label: 'Unisex', value: 'uuid-aqui', slug: 'unisex' },
    ],
    colors: [
        { label: 'Black', value: 'uuid-aqui', hex: '#000000', slug: 'black' },
        { label: 'White', value: 'uuid-aqui', hex: '#FFFFFF', slug: 'white' },
        // ...
    ],
    sizes: [
        { label: 'XS', value: 'uuid-aqui', slug: 'xs' },
        { label: 'S', value: 'uuid-aqui', slug: 's' },
        // ...
    ],
    // ...
};
```

### Paso 3: Actualizar Componente de Filtros

El componente `Filters.tsx` ya usa `option.value`, así que no necesita cambios.

### Paso 4: Probar

```bash
npm run dev
# Visitar http://localhost:3000/products
# Probar filtros
```

## 🎯 Estado Actual

### Funciona ✅

- Listado de productos
- Búsqueda por texto
- Ordenamiento (precio, fecha, nombre)
- Paginación
- Navegación a detalle de producto

### No Funciona ⚠️

- Filtros por género (se ignoran)
- Filtros por color (se ignoran)
- Filtros por talla (se ignoran)
- Filtros por marca (se ignoran)
- Filtros por categoría (se ignoran)

### Funciona Parcialmente 🟡

- Filtros por precio (funcionan porque no usan UUIDs)

## 📚 Referencias

- [buildProductQueryObject()](../lib/utils/query.ts) - Función con validación UUID
- [Filters Component](../components/Filters.tsx) - Componente de filtros UI
- [filterOptions](../lib/data/mock-products.ts) - Opciones de filtros actuales

## 🔄 Próximos Pasos

1. [ ] Decidir qué opción implementar (Recomendado: Opción 1)
2. [ ] Obtener UUIDs reales de la base de datos
3. [ ] Actualizar `filterOptions` con UUIDs
4. [ ] Probar que los filtros funcionen
5. [ ] Actualizar documentación

---

**Última actualización:** Noviembre 2025  
**Estado:** ⚠️ Solución temporal implementada  
**Prioridad:** 🔴 Alta - Los filtros son funcionalidad core
