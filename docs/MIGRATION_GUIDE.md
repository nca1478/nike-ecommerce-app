# Guía de Migración - Sistema de Productos

## 📋 Resumen

Esta guía te ayudará a migrar de la implementación anterior (con datos mock) a la nueva implementación con acciones de servidor optimizadas y base de datos real.

## 🔄 Pasos de Migración

### Paso 1: Verificar Dependencias

Asegúrate de tener todas las dependencias necesarias:

```bash
npm install
```

Dependencias requeridas:

- `drizzle-orm` ✅
- `@neondatabase/serverless` ✅
- `next` (v14+) ✅
- `query-string` ✅

### Paso 2: Configurar Variables de Entorno

Verifica que tu archivo `.env.local` tenga la conexión a la base de datos:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### Paso 3: Aplicar Esquema e Índices de Rendimiento

Los índices son cruciales para el rendimiento. Usa el script automatizado:

#### Opción A: Setup Completo (Recomendado)

```bash
# Aplica el esquema + índices automáticamente
npm run db:setup
```

Este comando ejecuta:

1. `npm run db:push` - Sincroniza el esquema de Drizzle (incluye índices básicos)
2. `npm run db:indexes` - Aplica índices adicionales (búsqueda de texto, precio)

#### Opción B: Paso a Paso

```bash
# 1. Aplicar esquema con índices básicos
npm run db:push

# 2. Aplicar índices adicionales
npm run db:indexes
```

#### Opción C: Usando psql (Manual)

```bash
psql -d your_database_name -f drizzle/migrations/add_performance_indexes.sql
```

### Paso 4: Verificar Esquema de Base de Datos

Asegúrate de que todas las tablas necesarias existan:

```sql
-- Verificar tablas principales
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'products',
    'product_variants',
    'product_images',
    'brands',
    'categories',
    'genders',
    'colors',
    'sizes'
);
```

Deberías ver 8 tablas.

### Paso 5: Verificar Índices

Verifica que los índices se hayan creado correctamente:

```sql
-- Listar todos los índices en las tablas de productos
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('products', 'product_variants', 'product_images')
ORDER BY tablename, indexname;
```

Deberías ver al menos 13 índices nuevos.

### Paso 6: Seed de Datos (Opcional)

Si necesitas datos de prueba:

```bash
npm run db:seed
```

### Paso 7: Actualizar Importaciones

Si tienes código que usa las acciones antiguas, actualiza las importaciones:

#### Antes:

```typescript
import { getAllProducts } from '@/app/actions/products';
```

#### Después:

```typescript
import { getAllProducts } from '@/lib/actions/product';
```

**Nota:** El archivo `@/app/actions/products.ts` ahora re-exporta las nuevas acciones para compatibilidad hacia atrás.

### Paso 8: Actualizar Componentes

Si tienes componentes personalizados que usan productos, actualízalos para usar los nuevos tipos:

```typescript
import type { ProductWithDetails } from '@/lib/actions/product';

interface MyComponentProps {
    products: ProductWithDetails[];
}
```

### Paso 9: Probar la Implementación

1. **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

2. **Probar el listado de productos:**

    ```
    http://localhost:3000/products
    ```

3. **Probar filtros:**

    ```
    http://localhost:3000/products?sort=price_asc
    http://localhost:3000/products?search=nike
    ```

4. **Probar detalle de producto:**
    ```
    http://localhost:3000/products/[algún-id-de-producto]
    ```

### Paso 10: Verificar Rendimiento

Usa las herramientas de desarrollo de tu navegador para verificar:

- ✅ Tiempo de carga de página < 1s
- ✅ Tiempo de respuesta de API < 200ms
- ✅ No hay consultas N+1 (verifica logs de Drizzle)

## 🔍 Verificación de Migración

### Checklist de Verificación

- [ ] Variables de entorno configuradas
- [ ] Base de datos conectada
- [ ] Índices aplicados
- [ ] Datos de prueba cargados (opcional)
- [ ] Página de productos carga correctamente
- [ ] Filtros funcionan
- [ ] Búsqueda funciona
- [ ] Paginación funciona
- [ ] Detalle de producto carga
- [ ] Imágenes se muestran correctamente
- [ ] No hay errores en consola

### Comandos de Verificación

```bash
# Verificar conexión a base de datos
npm run db:push

# Verificar que no hay errores de TypeScript
npx tsc --noEmit

# Verificar que no hay errores de ESLint
npm run lint

# Construir para producción (verifica que todo compila)
npm run build
```

## 🐛 Solución de Problemas

### Problema: "DATABASE_URL is not defined"

**Solución:**

```bash
# Verifica que .env.local existe
cat .env.local

# Si no existe, créalo
cp .env.example .env.local
# Edita .env.local con tus credenciales
```

### Problema: "relation 'products' does not exist"

**Solución:**

```bash
# Ejecuta las migraciones
npm run db:migrate

# O empuja el esquema
npm run db:push
```

### Problema: Consultas lentas

**Solución:**

```bash
# Verifica que los índices existen
psql -d your_database -c "\di"

# Si no existen, aplícalos
psql -d your_database -f drizzle/migrations/add_performance_indexes.sql
```

### Problema: "Cannot find module '@/lib/actions/product'"

**Solución:**

```bash
# Verifica que el archivo existe
ls -la lib/actions/product.ts

# Verifica la configuración de paths en tsconfig.json
cat tsconfig.json | grep -A 5 "paths"
```

### Problema: Imágenes no se muestran

**Solución:**

1. Verifica que las URLs de imágenes en la base de datos son válidas
2. Verifica que Next.js está configurado para permitir dominios externos:

```javascript
// next.config.ts
const nextConfig = {
    images: {
        domains: ['your-image-domain.com'],
    },
};
```

### Problema: Filtros no funcionan

**Solución:**

1. Verifica que los IDs en los filtros son UUIDs válidos
2. Verifica que los productos tienen variantes con esos colores/tallas
3. Revisa los logs de la consola del servidor

## 📊 Monitoreo Post-Migración

### Métricas a Monitorear

1. **Rendimiento de Consultas:**

    ```sql
    -- Ver consultas lentas
    SELECT
        query,
        mean_exec_time,
        calls
    FROM pg_stat_statements
    WHERE query LIKE '%products%'
    ORDER BY mean_exec_time DESC
    LIMIT 10;
    ```

2. **Uso de Índices:**

    ```sql
    -- Ver uso de índices
    SELECT
        schemaname,
        tablename,
        indexname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch
    FROM pg_stat_user_indexes
    WHERE tablename IN ('products', 'product_variants', 'product_images')
    ORDER BY idx_scan DESC;
    ```

3. **Tamaño de Tablas:**
    ```sql
    -- Ver tamaño de tablas
    SELECT
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
    FROM pg_tables
    WHERE tablename IN ('products', 'product_variants', 'product_images')
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    ```

## 🔄 Rollback (Si es necesario)

Si necesitas revertir la migración:

### Paso 1: Restaurar Archivos Antiguos

```bash
# Si usas Git
git checkout HEAD~1 -- app/(root)/products/page.tsx
git checkout HEAD~1 -- lib/utils/query.ts
```

### Paso 2: Eliminar Índices (Opcional)

```sql
-- Solo si los índices causan problemas
DROP INDEX IF EXISTS idx_products_brand_published;
DROP INDEX IF EXISTS idx_products_category_published;
-- ... etc
```

### Paso 3: Restaurar Importaciones

Revierte las importaciones a usar datos mock si es necesario.

## 📚 Recursos Adicionales

- [Documentación de Acciones](./PRODUCT_ACTIONS.md)
- [Ejemplos de Uso](./PRODUCT_EXAMPLES.md)
- [Resumen de Implementación](./IMPLEMENTATION_SUMMARY.md)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## 🆘 Soporte

Si encuentras problemas durante la migración:

1. Revisa los logs del servidor: `npm run dev`
2. Revisa los logs de la base de datos
3. Verifica la documentación en `/docs`
4. Revisa los ejemplos en `PRODUCT_EXAMPLES.md`

## ✅ Migración Completada

Una vez que hayas completado todos los pasos y verificaciones, tu aplicación estará usando el nuevo sistema de productos optimizado con:

- ✅ Consultas SQL optimizadas
- ✅ Índices de rendimiento
- ✅ Filtrado avanzado
- ✅ Búsqueda potente
- ✅ Paginación eficiente
- ✅ SSR completo
- ✅ TypeScript completo
- ✅ Documentación completa

¡Felicitaciones! 🎉
