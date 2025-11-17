Aquí tienes la traducción al español, manteniendo el formato Markdown:

# Implementación de la Página de Detalles del Producto (PDP)

## Resumen

Este documento describe la implementación de la Página de Detalles del Producto totalmente integrada utilizando datos reales del _backend_ provenientes del esquema Drizzle ORM.

## Arquitectura

### Acciones de Servidor (`lib/actions/product.ts`)

#### `getProduct(productId: string)`

- Obtiene los detalles completos del producto, incluyendo variantes, imágenes y metadatos
- Devuelve `null` si el producto no existe o no está publicado
- Utiliza las relaciones Drizzle para evitar consultas N+1
- Incluye:
    - Metadatos del producto (nombre, descripción, categoría, marca, género)
    - Todas las variantes con detalles de color y talla
    - Todas las imágenes del producto con orden de clasificación
    - Información de _stock_ por variante

#### `getProductReviews(productId: string)`

- Devuelve las reseñas aprobadas para un producto
- Ordenadas por las más recientes primero
- Limitadas a 10 reseñas
- Devuelve _array_ vacío en caso de error para evitar fallos en la página
- Anonimiza los ID de usuario por privacidad

#### `getRecommendedProducts(productId: string)`

- Obtiene 6 productos relacionados basados en:
    - Misma categoría
    - Misma marca
    - Mismo género
- Filtra los productos sin imágenes válidas
- Devuelve _array_ vacío en caso de error para evitar fallos en la página

### Estructura de la Página (`app/(root)/products/[id]/page.tsx`)

#### Componente de Servidor

- Obtiene los datos del producto usando `getProduct()`
- Devuelve una página 404 personalizada si el producto no se encuentra
- Agrupa las imágenes por variante de color
- Calcula el precio (precio mínimo, precio de venta, descuento)
- Prepara las opciones de talla con información de _stock_
- Envuelve los componentes de cliente en `VariantProvider`

#### Límites de Suspense

- La sección de Reseñas está envuelta en `Suspense` con `ReviewsSkeleton`
- Los productos recomendados están envueltos en `Suspense` con `RecommendedSkeleton`
- Evita bloquear el renderizado principal del producto

### Componentes de Cliente

#### `ProductVariantManager.tsx`

- **VariantProvider**: Proveedor de contexto para el estado de la variante
- **ProductGalleryClient**: Muestra imágenes para la variante de color seleccionada
- **ColorVariantPickerClient**: Selector de color con vista previa en miniatura
- Soporte de navegación por teclado (teclas de flecha, Enter, Espacio)
- Atributos de accesibilidad (`aria-label`, `aria-pressed`)

#### `SizePickerWithStock.tsx`

- Muestra las tallas disponibles en una cuadrícula (_grid_)
- Muestra el estado del _stock_ (en _stock_ / agotado)
- Deshabilita las tallas agotadas
- Soporte de navegación por teclado
- Cumple con la accesibilidad

#### `ProductReviews.tsx`

- Componente de servidor que obtiene y muestra reseñas
- Muestra la calificación promedio con visualización de estrellas
- Muestra el autor de la reseña, la fecha y el contenido
- Estado vacío para productos sin reseñas

#### `RecommendedProducts.tsx`

- Componente de servidor que obtiene productos relacionados
- Utiliza el componente `Card` existente para la consistencia
- Enlaza a las páginas de detalles del producto
- Oculta la sección si no hay recomendaciones disponibles

### Diseño Responsivo

#### Escritorio (punto de quiebre lg y superior)

- Diseño de dos columnas (galería izquierda, información derecha)
- Columna vertical de miniaturas a la izquierda de la imagen principal
- Flechas de navegación al pasar el ratón (_hover_)
- Botones de acción de ancho completo

#### Móvil/Tableta

- Diseño de una sola columna
- Imagen principal en la parte superior
- Miniaturas desplazables horizontalmente debajo de la imagen
- Controles optimizados para el tacto
- Secciones de contenido apiladas

### Manejo de Imágenes

#### Lógica de Agrupación

1.  Las imágenes se agrupan por variante de color
2.  Las imágenes con `variantId` se asignan a un color específico
3.  Las imágenes sin `variantId` se añaden a todos los colores
4.  La primera imagen de cada color se convierte en la miniatura
5.  _Fallback_ a la variante predeterminada si no se encuentran imágenes

#### Características de la Galería

- Diseño responsivo (vertical en escritorio, horizontal en móvil)
- Navegación por teclado (teclas de flecha)
- Soporte táctil/_swipe_ en móvil
- Carga perezosa (_Lazy loading_) para el rendimiento
- Atributo `sizes` adecuado para una carga de imágenes óptima

### Flujo de Datos

```
El usuario hace clic en la tarjeta del producto
    ↓
Navega a /products/[id]
    ↓
El servidor obtiene datos del producto (getProduct)
    ↓
Si no se encuentra → Mostrar página 404
    ↓
Si se encuentra → Procesar datos:
    - Agrupar imágenes por color
    - Calcular precios
    - Preparar opciones de talla
    ↓
Renderizar la sección principal del producto (servidor)
    ↓
Cargar reseñas en Suspense (servidor)
    ↓
Cargar recomendaciones en Suspense (servidor)
```

### Manejo de Errores

1.  **Producto No Encontrado**: Página 404 personalizada con enlace para explorar productos
2.  **Sin Imágenes**: `ProductGallery` muestra estado vacío con icono
3.  **Sin Reseñas**: Muestra el mensaje "Sé el primero en opinar"
4.  **Sin Recomendaciones**: La sección se oculta
5.  **Errores del Servidor**: Reseñas y recomendaciones devuelven _arrays_ vacíos

### Accesibilidad

- Estructura HTML semántica
- Texto alternativo (_Alt text_) para todas las imágenes
- Soporte de navegación por teclado
- Etiquetas y atributos ARIA
- Gestión del enfoque
- Compatible con lectores de pantalla

### Optimizaciones de Rendimiento

1.  **Consultas a la Base de Datos**:
    - Consulta única para el producto con relaciones
    - Obtención paralela de colores y tallas
    - Consultas indexadas para recomendaciones

2.  **Carga de Imágenes**:
    - Carga prioritaria para la primera imagen
    - Carga perezosa (_Lazy loading_) para miniaturas
    - Atributo `sizes` adecuado
    - Optimizado con el componente `Next.js Image`

3.  **Límites de Suspense**:
    - Carga de reseñas sin bloqueo
    - Carga de recomendaciones sin bloqueo
    - Estados de esqueleto para una mejor experiencia de usuario

### Mejoras Futuras

- Funcionalidad de añadir al carrito
- Funcionalidad de lista de deseos/favoritos
- Formulario de envío de reseñas
- Zoom de imagen al pasar el ratón (_hover_)
- Comparación de productos
- Productos vistos recientemente
- Compartir en redes sociales
- Recomendación de tallas basada en el perfil de usuario

## Archivos Creados/Modificados

### Creados

- `app/(root)/products/[id]/ProductVariantManager.tsx`
- `app/(root)/products/[id]/SizePickerWithStock.tsx`
- `app/(root)/products/[id]/ProductReviews.tsx`
- `app/(root)/products/[id]/RecommendedProducts.tsx`
- `app/(root)/products/[id]/ReviewsSkeleton.tsx`
- `app/(root)/products/[id]/RecommendedSkeleton.tsx`

### Modificados

- `lib/actions/product.ts` - Se agregaron acciones de reseña y recomendación
- `app/(root)/products/[id]/page.tsx` - Reescriptura completa con datos reales
- `components/ProductGallery.tsx` - Se agregó diseño móvil responsivo
- `app/globals.css` - Se agregó la utilidad `scrollbar-hide`

### Eliminados

- `app/(root)/products/[id]/ProductGalleryWrapper.tsx` - Reemplazado por `ProductVariantManager`

## Lista de Verificación de Pruebas

- [ ] El producto carga correctamente con un ID válido
- [ ] Se muestra la página 404 para un ID no válido
- [ ] Las imágenes se muestran correctamente para cada variante de color
- [ ] El selector de tallas muestra el estado de _stock_ correcto
- [ ] La sección de reseñas carga sin bloquear
- [ ] La sección de recomendaciones carga sin bloquear
- [ ] El diseño móvil es _responsive_
- [ ] El diseño de escritorio es _pixel-perfect_
- [ ] La navegación por teclado funciona
- [ ] La accesibilidad con lector de pantalla funciona
- [ ] Los enlaces a otros productos funcionan correctamente
- [ ] El rendimiento es óptimo (sin consultas N+1)
