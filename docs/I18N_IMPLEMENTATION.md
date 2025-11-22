# Implementación de Internacionalización (i18n)

## Descripción General

Se ha implementado un sistema completo de internacionalización (i18n) en la aplicación Nike E-commerce que permite a los usuarios cambiar entre inglés y español de manera fluida. El sistema mantiene la persistencia del idioma seleccionado mediante cookies.

## Arquitectura

### Estructura de Archivos

```
lib/i18n/
├── locales/
│   ├── en.json          # Traducciones en inglés
│   └── es.json          # Traducciones en español
├── context.tsx          # Contexto de React para i18n
├── types.ts             # Tipos TypeScript
└── index.ts             # Exportaciones principales

components/Shared/
└── LanguageSwitcher.tsx # Componente selector de idioma
```

### Componentes Principales

#### 1. **I18nProvider** (`lib/i18n/context.tsx`)

- Proveedor de contexto que envuelve toda la aplicación
- Gestiona el estado del idioma actual
- Carga y guarda el idioma en cookies
- Proporciona las traducciones a través del contexto

#### 2. **useI18n Hook**

Hook personalizado que proporciona:

- `locale`: Idioma actual ('en' | 'es')
- `setLocale`: Función para cambiar el idioma
- `t`: Objeto con todas las traducciones

#### 3. **LanguageSwitcher** (`components/Shared/LanguageSwitcher.tsx`)

- Componente dropdown para seleccionar idioma
- Muestra banderas y nombres de idiomas
- Integrado en el Navbar (desktop y mobile)

## Uso

### En Componentes Client

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function MyComponent() {
    const { t, locale, setLocale } = useI18n();

    return (
        <div>
            <h1>{t.home.hero.title}</h1>
            <p>{t.home.hero.description}</p>
            <button onClick={() => setLocale('en')}>English</button>
        </div>
    );
}
```

### Estructura de Traducciones

Las traducciones están organizadas por secciones:

```json
{
  "common": { ... },      // Textos comunes
  "nav": { ... },         // Navegación
  "auth": { ... },        // Autenticación
  "home": { ... },        // Página principal
  "products": { ... },    // Productos
  "cart": { ... },        // Carrito
  "orders": { ... },      // Pedidos
  "footer": { ... },      // Footer
  "checkout": { ... }     // Checkout
}
```

## Persistencia

El idioma seleccionado se guarda en una cookie llamada `nike-locale` con:

- **Duración**: 1 año
- **Path**: `/`
- **SameSite**: `Lax`

## Componentes Actualizados

Se han actualizado los siguientes componentes para usar traducciones:

### Navegación

- ✅ `Navbar.tsx` - Menú de navegación, búsqueda, enlaces de usuario
- ✅ `Footer.tsx` - Enlaces legales, copyright
- ✅ `LanguageSwitcher.tsx` - Selector de idioma (nuevo)

### Autenticación

- ✅ `SignInForm.tsx` - Formulario de inicio de sesión
- ✅ `SignUpForm.tsx` - Formulario de registro

### Home

- ✅ `HeroSection.tsx` - Sección hero
- ✅ `HomeContent.tsx` - Contenido principal (nuevo)

### Productos

- ✅ `Filters.tsx` - Filtros de productos
- ✅ `ProductActions.tsx` - Acciones de producto (agregar al carrito, favoritos)

### Carrito

- ✅ `CartSummary.tsx` - Resumen del carrito
- ✅ `OrderSuccess.tsx` - Página de éxito de pedido

### Pedidos

- ✅ `OrdersList.tsx` - Lista de pedidos

## Idiomas Soportados

### Español (es) - Idioma por defecto

- Código: `es`
- Bandera: 🇪🇸
- Nombre: Español

### Inglés (en)

- Código: `en`
- Bandera: 🇺🇸
- Nombre: English

## Agregar Nuevas Traducciones

### 1. Agregar al archivo JSON

**es.json**:

```json
{
    "mySection": {
        "myKey": "Mi texto en español"
    }
}
```

**en.json**:

```json
{
    "mySection": {
        "myKey": "My text in English"
    }
}
```

### 2. Actualizar tipos TypeScript

**types.ts**:

```typescript
export interface Translations {
    // ... otras secciones
    mySection: {
        myKey: string;
    };
}
```

### 3. Usar en componente

```tsx
const { t } = useI18n();
return <p>{t.mySection.myKey}</p>;
```

## Agregar Nuevo Idioma

### 1. Crear archivo de traducciones

```
lib/i18n/locales/fr.json
```

### 2. Actualizar tipo Locale

```typescript
export type Locale = 'en' | 'es' | 'fr';
```

### 3. Importar traducciones

```typescript
import fr from './locales/fr.json';

const translations: Record<Locale, Translations> = {
    en: en as Translations,
    es: es as Translations,
    fr: fr as Translations,
};
```

### 4. Agregar al LanguageSwitcher

```typescript
const languages = [
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
];
```

## Características

✅ **Persistencia**: El idioma se guarda en cookies
✅ **Sin flash**: No hay parpadeo al cargar la página
✅ **Type-safe**: Totalmente tipado con TypeScript
✅ **Fácil de usar**: Hook simple `useI18n()`
✅ **Escalable**: Fácil agregar nuevos idiomas y traducciones
✅ **Responsive**: Selector de idioma funciona en desktop y mobile
✅ **Accesible**: Componentes con aria-labels apropiados

## Notas Técnicas

### Hidratación

El componente `I18nProvider` espera a que el componente esté montado antes de renderizar para evitar problemas de hidratación entre servidor y cliente.

### Cookies vs LocalStorage

Se eligieron cookies sobre localStorage porque:

- Funcionan en SSR
- Se pueden leer desde el servidor si es necesario
- Tienen mejor soporte cross-domain

### Performance

- Las traducciones se cargan de forma estática
- No hay llamadas a API para obtener traducciones
- El cambio de idioma es instantáneo

## Testing

Para probar la funcionalidad:

1. Abrir la aplicación
2. Hacer clic en el selector de idioma (icono de globo)
3. Seleccionar un idioma diferente
4. Verificar que todos los textos cambien
5. Recargar la página
6. Verificar que el idioma se mantenga

## Mantenimiento

### Agregar nuevas traducciones

Cuando se agregue nuevo contenido a la aplicación:

1. Agregar las claves en ambos archivos JSON (es.json y en.json)
2. Actualizar la interfaz `Translations` en types.ts
3. Usar las traducciones en los componentes con `t.section.key`

### Revisar traducciones faltantes

Buscar en el código textos hardcodeados que deberían ser traducidos:

```bash
# Buscar strings en español que no usan traducciones
grep -r "\"[A-ZÁÉÍÓÚÑ]" components/
```

## Futuras Mejoras

- [ ] Agregar más idiomas (francés, alemán, etc.)
- [ ] Implementar traducciones para contenido dinámico (nombres de productos, categorías)
- [ ] Agregar detección automática de idioma del navegador
- [ ] Implementar traducciones para mensajes de error del backend
- [ ] Agregar soporte para formatos de fecha/hora según el idioma
- [ ] Implementar pluralización inteligente
