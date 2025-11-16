# Product Listing Page - Documentación

## Descripción General

Página de listado de productos con filtros y ordenación completamente funcional, renderizada en el servidor con componentes de cliente para la interacción de filtros.

## Estructura de Archivos

```
/app/(root)/products/
  └── page.tsx                    # Página principal renderizada en servidor

/components/
  ├── Filters.tsx                 # Componente de filtros (cliente)
  ├── Sort.tsx                    # Componente de ordenación (cliente)
  └── Card.tsx                    # Componente de tarjeta de producto (reutilizado)

/lib/
  ├── utils/
  │   └── query.ts                # Utilidades para manejo de URL
  └── data/
      └── mock-products.ts        # Datos simulados de productos
```

## Características Implementadas

### 1. Renderizado en el Servidor

- La página `/products` lee los parámetros de búsqueda de la URL
- Filtra y ordena los productos en el servidor
- Renderiza el HTML completo con los resultados

### 2. Filtros (Componente Cliente)

- **Género**: Men, Women, Kids (checkboxes)
- **Talla**: Selección múltiple con botones
- **Color**: Selección visual con círculos de color
- **Rango de Precio**: Checkboxes para rangos predefinidos

#### Características de Filtros:

- Sincronización automática con URL
- Selección múltiple en todos los filtros
- Botón "Clear All Filters" para limpiar
- Responsive:
    - Desktop: Barra lateral fija
    - Mobile: Cajón deslizante desde la izquierda con overlay

### 3. Ordenación (Componente Cliente)

- Featured (destacados con badges)
- Newest (más recientes)
- Price: High to Low
- Price: Low to High

#### Características de Ordenación:

- Dropdown con opciones
- Sincronización con URL
- Resetea a página 1 al cambiar ordenación

### 4. Sincronización de URL

- Todos los filtros y ordenación se reflejan en la URL
- Funciona con botones atrás/adelante del navegador
- Navegación superficial (sin recarga completa)
- Formato de URL: `/products?gender=men,women&size=8,9&color=black&sort=price_asc`

### 5. Badges de Filtros Activos

- Muestra los filtros aplicados como badges
- Click en badge para remover filtro individual
- Contador de filtros activos

### 6. Estado Vacío

- Mensaje cuando no hay productos que coincidan
- Botón para limpiar todos los filtros

## Uso de Utilidades

### `lib/utils/query.ts`

```typescript
// Parsear parámetros de URL
const filters = parseFilters(searchParams.toString());

// Convertir filtros a string de URL
const queryString = stringifyFilters(filters);

// Agregar un filtro
const newFilters = addFilter(filters, 'gender', 'men');

// Remover un filtro
const newFilters = removeFilter(filters, 'gender', 'men');

// Toggle un filtro
const newFilters = toggleFilter(filters, 'gender', 'men');

// Verificar si un filtro está activo
const isActive = isFilterActive(filters, 'gender', 'men');

// Obtener cantidad de filtros activos
const count = getActiveFilterCount(filters);
```

## Navegación con Filtros Pre-aplicados

Los enlaces en el Navbar ahora apuntan a la página de productos con filtros:

```typescript
// Navbar links
{ href: '/products?gender=men', label: 'Men' }
{ href: '/products?gender=women', label: 'Women' }
{ href: '/products?gender=kids', label: 'Kids' }
```

## Datos Simulados

Los productos simulados incluyen:

- 15 productos de ejemplo
- Imágenes reales de `/public/shoes/`
- Variedad de géneros, tallas, colores
- Algunos con badges (Best Seller, Extra 20% off, etc.)
- Algunos con precios de oferta

## Responsive Design

### Desktop (lg+)

- Barra lateral de filtros fija (264px)
- Grid de productos 3 columnas
- Dropdown de ordenación completo

### Tablet (md-lg)

- Grid de productos 2 columnas
- Cajón de filtros móvil

### Mobile (sm)

- Grid de productos 1 columna
- Botón flotante para abrir filtros
- Cajón de filtros con overlay

## Accesibilidad

- HTML semántico
- Checkboxes navegables con teclado
- Estados de enfoque visibles
- Labels apropiados
- ARIA labels en botones

## Próximos Pasos Sugeridos

1. **Paginación**: Agregar paginación para grandes cantidades de productos
2. **Integración con Base de Datos**: Reemplazar datos simulados con queries reales
3. **Búsqueda**: Agregar barra de búsqueda de productos
4. **Vista de Cuadrícula/Lista**: Toggle entre vistas
5. **Filtros Avanzados**: Agregar más opciones de filtrado
6. **Persistencia**: Guardar preferencias de filtros en localStorage
7. **Analytics**: Tracking de filtros más usados

## Tecnologías Utilizadas

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **query-string** (manejo de URL)
- **lucide-react** (iconos)

## Notas de Implementación

- Los filtros se aplican **inmediatamente** sin botón "Aplicar"
- La URL es la fuente de verdad para el estado de filtros
- Los componentes de filtro y ordenación son **solo cliente**
- La página principal es **renderizada en servidor**
- Las imágenes usan Next.js Image con optimización automática
