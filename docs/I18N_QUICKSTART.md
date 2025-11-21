# Guía Rápida de Internacionalización (i18n)

## 🎯 Resumen

Se ha implementado un sistema completo de internacionalización que permite a los usuarios cambiar entre **Español** e **Inglés** con persistencia del idioma seleccionado.

## 🚀 Características Implementadas

✅ **Selector de idioma** en el Navbar (desktop y mobile)
✅ **Persistencia** del idioma mediante cookies (1 año de duración)
✅ **Traducciones completas** de toda la interfaz
✅ **Sin modificaciones** en la base de datos
✅ **Type-safe** con TypeScript
✅ **Responsive** y accesible

## 📍 Ubicación del Selector

El selector de idioma se encuentra en:

- **Desktop**: Barra superior derecha, junto al buscador y carrito
- **Mobile**: Menú hamburguesa, en la sección de usuario

## 🌐 Idiomas Disponibles

| Idioma  | Código | Bandera | Por Defecto |
| ------- | ------ | ------- | ----------- |
| Español | `es`   | 🇪🇸      | ✅          |
| Inglés  | `en`   | 🇺🇸      |             |

## 📦 Archivos Creados

```
lib/i18n/
├── locales/
│   ├── en.json                    # Traducciones en inglés
│   └── es.json                    # Traducciones en español
├── context.tsx                    # Contexto de React
├── types.ts                       # Tipos TypeScript
└── index.ts                       # Exportaciones

components/
├── Shared/
│   ├── LanguageSwitcher.tsx      # Selector de idioma
│   └── FooterClient.tsx          # Footer con traducciones
└── Home/
    └── HomeContent.tsx           # Contenido home con traducciones
```

## 🔧 Componentes Actualizados

### Navegación y Layout

- `app/layout.tsx` - Envuelto con I18nProvider
- `components/Shared/Navbar.tsx` - Menú, búsqueda, enlaces
- `components/Shared/Footer.tsx` - Footer con traducciones

### Autenticación

- `components/auth/SignInForm.tsx`
- `components/auth/SignUpForm.tsx`

### Home

- `components/Home/HeroSection.tsx`
- `components/Home/HomeContent.tsx` (nuevo)
- `app/(root)/page.tsx`

### Productos

- `components/Product/Filters.tsx`
- `components/Product/ProductActions.tsx`

### Carrito y Pedidos

- `components/Cart/CartSummary.tsx`
- `components/Cart/OrderSuccess.tsx`
- `components/Orders/OrdersList.tsx`

## 💻 Uso en Código

### En componentes client:

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function MyComponent() {
    const { t } = useI18n();

    return (
        <div>
            <h1>{t.home.hero.title}</h1>
            <button>{t.common.save}</button>
        </div>
    );
}
```

### Cambiar idioma programáticamente:

```tsx
const { setLocale } = useI18n();

// Cambiar a inglés
setLocale('en');

// Cambiar a español
setLocale('es');
```

## 📝 Secciones de Traducciones

Las traducciones están organizadas en:

- `common` - Textos comunes (loading, error, success, etc.)
- `nav` - Navegación (men, women, kids, sign in, etc.)
- `auth` - Autenticación (email, password, sign in, etc.)
- `home` - Página principal (hero, latest shoes, etc.)
- `products` - Productos (filters, size, color, add to cart, etc.)
- `cart` - Carrito (summary, checkout, shipping, etc.)
- `orders` - Pedidos (order number, status, total, etc.)
- `footer` - Footer (copyright, legal links, etc.)
- `checkout` - Checkout (shipping address, payment, etc.)

## 🧪 Cómo Probar

1. **Iniciar la aplicación**:

    ```bash
    npm run dev
    ```

2. **Abrir en el navegador**: `http://localhost:3000`

3. **Cambiar idioma**:
    - Click en el icono de globo 🌐 en la barra superior
    - Seleccionar "English" o "Español"

4. **Verificar persistencia**:
    - Cambiar el idioma
    - Recargar la página (F5)
    - El idioma debe mantenerse

5. **Navegar por la app**:
    - Verificar que todos los textos cambien
    - Probar en diferentes páginas (home, products, cart, orders)
    - Probar en mobile (menú hamburguesa)

## 🔍 Verificar Implementación

### Verificar que el idioma se guarda:

```javascript
// En la consola del navegador
document.cookie;
// Debe mostrar: nike-locale=es o nike-locale=en
```

### Verificar traducciones:

```javascript
// En la consola del navegador
localStorage.clear(); // Limpiar
location.reload(); // Recargar
// Debe cargar en español (idioma por defecto)
```

## 🎨 Personalización

### Cambiar idioma por defecto:

En `lib/i18n/context.tsx`, línea 28:

```typescript
return 'es'; // Cambiar a 'en' para inglés por defecto
```

### Agregar nueva traducción:

1. Agregar en `lib/i18n/locales/es.json`:

```json
{
    "mySection": {
        "myText": "Mi texto"
    }
}
```

2. Agregar en `lib/i18n/locales/en.json`:

```json
{
    "mySection": {
        "myText": "My text"
    }
}
```

3. Actualizar `lib/i18n/types.ts`:

```typescript
export interface Translations {
    mySection: {
        myText: string;
    };
}
```

4. Usar en componente:

```tsx
const { t } = useI18n();
<p>{t.mySection.myText}</p>;
```

## ⚠️ Notas Importantes

1. **No se modificó la base de datos** - Las traducciones son solo de la interfaz
2. **Contenido dinámico** (nombres de productos, descripciones) permanece en el idioma original
3. **Fechas** se formatean según el idioma seleccionado
4. **El idioma se mantiene** incluso después de cerrar el navegador (cookie de 1 año)

## 📚 Documentación Completa

Para más detalles, consultar:

- `docs/I18N_IMPLEMENTATION.md` - Documentación técnica completa
- `lib/i18n/locales/` - Archivos de traducciones
- `lib/i18n/types.ts` - Estructura de traducciones

## 🐛 Solución de Problemas

### El idioma no cambia:

- Verificar que el componente use `'use client'`
- Verificar que esté dentro del `I18nProvider`
- Limpiar cookies y recargar

### Traducciones no aparecen:

- Verificar que la clave existe en ambos archivos JSON
- Verificar que los tipos estén actualizados
- Revisar la consola por errores

### El idioma no persiste:

- Verificar que las cookies estén habilitadas
- Revisar la configuración de SameSite
- Verificar que no haya conflictos con otras cookies

## ✅ Checklist de Implementación

- [x] Sistema de traducciones creado
- [x] Archivos JSON con traducciones (es/en)
- [x] Contexto y provider de i18n
- [x] Hook useI18n
- [x] Componente LanguageSwitcher
- [x] Integración en Navbar
- [x] Persistencia con cookies
- [x] Todos los componentes actualizados
- [x] Sin modificaciones en BD
- [x] Documentación completa
- [x] Type-safe con TypeScript
- [x] Responsive (desktop/mobile)
