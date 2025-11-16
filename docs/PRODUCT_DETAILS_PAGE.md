# Documentación de la Página de Detalles del Producto (PDP)

## Resumen

La Página de Detalles del Producto es una página totalmente renderizada por el servidor que muestra información completa del producto, incluida una galería interactiva, variantes de color, selección de tallas y productos relacionados.

## Arquitectura

### Componentes de Servidor

- **`app/(root)/products/[id]/page.tsx`**: Página principal renderizada por el servidor que obtiene los datos del producto y compone el diseño

### Componentes de Cliente

- **`ProductGallery.tsx`**: Galería de imágenes interactiva con navegación de miniaturas y soporte de teclado
- **`ColorVariantPicker.tsx`**: Selector de variantes de color que actualiza la galería
- **`SizePicker.tsx`**: Interfaz de selección de tallas
- **`CollapsibleSection.tsx`**: Secciones expandibles para detalles del producto, envío y reseñas
- **`ProductGalleryWrapper.tsx`**: Envoltorio de cliente que gestiona el estado de la variante

## Características

### 1\. Galería de Productos

- Visualización de la imagen principal con conservación de la relación de aspecto
- Tira de miniaturas con desplazamiento horizontal en móvil
- Navegación por teclado (teclas de flecha)
- Validación automática de imágenes (omite imágenes rotas)
- Estado vacío con icono de _fallback_
- Flechas de navegación al pasar el ratón (_hover_)

### 2\. Variantes de Color

- Muestras de color visuales con miniaturas de producto
- Indicación de estado seleccionado con marca de verificación
- Actualiza la galería cuando se selecciona una variante
- Accesible por teclado

### 3\. Selección de Talla

- Diseño en cuadrícula (_grid_) sensible al tamaño de la pantalla
- Retroalimentación visual para la talla seleccionada
- Soporte de navegación por teclado
- Sin lógica de _backend_ (solo UI)

### 4\. Información del Producto

- Nombre y categoría del producto
- Precio con precio de comparación opcional
- Cálculo de _badge_ de descuento
- Visualización de calificación por estrellas
- Contador de reseñas

### 5\. Secciones Plegables

- Detalles del Producto (lista de características)
- Información de Envío y Devoluciones
- Reseñas con visualización de calificación
- Animación suave de expansión/colapso

### 6\. Productos Relacionados

- Sección "También te Puede Gustar"
- Reutiliza el componente `Card`
- Enlaces a otras páginas de productos
- Filtra el producto actual

## Diseño Responsivo

### Escritorio (lg+)

- Diseño de dos columnas (galería izquierda, información derecha)
- Galería de ancho completo con miniaturas lado a lado
- Sección espaciosa de información del producto

### Tableta (md)

- Se mantiene el diseño de dos columnas
- Espaciado y _padding_ ajustados
- Tamaños de miniaturas optimizados

### Móvil (sm e inferiores)

- Diseño apilado de una sola columna
- Galería en la parte superior con ancho completo
- Miniaturas con desplazamiento horizontal
- Información del producto debajo de la galería
- Selector de tallas optimizado para toque

## Accesibilidad

### Navegación por Teclado

- Las teclas de flecha navegan por las imágenes de la galería
- Navegación con `Tab` a través de todos los elementos interactivos
- `Enter`/`Space` para seleccionar tallas y variantes
- Indicadores de enfoque en todos los elementos interactivos

### Etiquetas ARIA

- Etiquetas descriptivas para todos los botones
- Estados `aria-pressed` apropiados
- Estructura HTML semántica
- Texto alternativo (_Alt text_) para todas las imágenes

### Soporte para Lectores de Pantalla

- Etiquetas de botón significativas
- Anuncios de estado
- Jerarquía de encabezados adecuada

## Estructura de Datos

### Objeto Producto

```typescript
{
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  sizes: string[];
  variants: ColorVariant[];
}
```

### Objeto Variante de Color

```typescript
{
  id: string;
  name: string;
  images: string[];
  thumbnail: string;
}
```

## Datos Mock

Actualmente utiliza datos _mock_ estáticos definidos en `page.tsx`:

- 4 productos de muestra con detalles completos
- Múltiples variantes de color por producto
- Productos relacionados para recomendaciones

## Mejoras Futuras

- Conectar a una base de datos real
- Funcionalidad de añadir al carrito
- Funcionalidad de lista de deseos/favoritos
- Sistema de reseñas de productos
- Verificación de disponibilidad de tallas
- Funcionalidad de zoom para imágenes
- Soporte de vídeo en la galería
- Compartir en redes sociales
- Productos vistos recientemente

## Estilizado

- Utiliza Tailwind CSS con _tokens_ de tema personalizados de `globals.css`
- Sigue el sistema de diseño de Nike
- Espaciado y tipografía consistentes
- Transiciones suaves y efectos de _hover_

## Rendimiento

- Renderizado del lado del servidor para la carga inicial
- Optimización de imágenes de Next.js
- Carga perezosa (_Lazy loading_) para productos relacionados
- Mínimo JavaScript del lado del cliente
- Gestión eficiente del estado

## Lista de Verificación de Pruebas

- [ ] La navegación por la galería funciona con ratón y teclado
- [ ] Las variantes de color actualizan la galería correctamente
- [ ] La selección de tallas proporciona retroalimentación visual
- [ ] Las secciones plegables se expanden/contraen suavemente
- [ ] Los productos relacionados enlazan correctamente
- [ ] El diseño responsivo funciona en todos los tamaños de pantalla
- [ ] Las imágenes cargan con _fallbacks_ adecuados
- [ ] Las funciones de accesibilidad funcionan con lectores de pantalla
- [ ] La gestión del enfoque es lógica
- [ ] No hay errores o advertencias en la consola
