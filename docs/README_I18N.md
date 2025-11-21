# 🌐 Sistema de Internacionalización (i18n)

## Descripción

Sistema completo de internacionalización implementado en la aplicación Nike E-commerce que permite a los usuarios cambiar entre **Español** e **Inglés** de manera fluida, con persistencia del idioma seleccionado.

## 🎯 Características

- ✅ **Selector de idioma visual** con banderas y nombres
- ✅ **Persistencia automática** mediante cookies (1 año)
- ✅ **Traducciones completas** de toda la interfaz
- ✅ **Type-safe** con TypeScript
- ✅ **Sin modificaciones** en la base de datos
- ✅ **Responsive** (desktop y mobile)
- ✅ **Sin flash** al cargar la página
- ✅ **Fácil de extender** con nuevos idiomas

## 📸 Ubicación

### Desktop

El selector de idioma (🌐) se encuentra en la barra superior derecha, junto al buscador y el carrito de compras.

### Mobile

En el menú hamburguesa, en la sección de usuario, antes del carrito.

## 🚀 Inicio Rápido

### Usar traducciones en un componente:

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function MyComponent() {
    const { t, locale, setLocale } = useI18n();

    return (
        <div>
            <h1>{t.home.hero.title}</h1>
            <p>{t.home.hero.description}</p>

            {/* Cambiar idioma */}
            <button onClick={() => setLocale('en')}>English</button>
            <button onClick={() => setLocale('es')}>Español</button>
        </div>
    );
}
```

## 📁 Estructura de Archivos

```
lib/i18n/
├── locales/
│   ├── en.json          # 🇺🇸 Traducciones en inglés
│   └── es.json          # 🇪🇸 Traducciones en español
├── context.tsx          # Contexto de React para i18n
├── types.ts             # Tipos TypeScript
└── index.ts             # Exportaciones principales

components/Shared/
├── LanguageSwitcher.tsx # Selector de idioma
└── FooterClient.tsx     # Footer con traducciones

components/Home/
└── HomeContent.tsx      # Contenido home con traducciones
```

## 🔧 API

### Hook `useI18n()`

```typescript
const { t, locale, setLocale } = useI18n();
```

**Retorna:**

- `t`: Objeto con todas las traducciones
- `locale`: Idioma actual ('en' | 'es')
- `setLocale`: Función para cambiar el idioma

### Estructura de Traducciones

```typescript
t.common.loading; // "Cargando..." / "Loading..."
t.nav.signIn; // "Iniciar Sesión" / "Sign In"
t.auth.email; // "Email" / "Email"
t.home.hero.title; // "Estilo Que Se Mueve" / "Style That Moves"
t.products.addToCart; // "Agregar al Carrito" / "Add to Cart"
t.cart.checkout; // "Finalizar Compra" / "Checkout"
t.orders.total; // "Total" / "Total"
t.footer.copyright; // "© 2025 Nike..." / "© 2025 Nike..."
```

## 📝 Secciones Disponibles

| Sección    | Descripción      | Ejemplo                  |
| ---------- | ---------------- | ------------------------ |
| `common`   | Textos comunes   | loading, error, success  |
| `nav`      | Navegación       | men, women, kids, signIn |
| `auth`     | Autenticación    | email, password, signIn  |
| `home`     | Página principal | hero, latestShoes        |
| `products` | Productos        | filters, size, color     |
| `cart`     | Carrito          | summary, checkout, total |
| `orders`   | Pedidos          | orderNumber, status      |
| `footer`   | Footer           | copyright, guides        |
| `checkout` | Checkout         | shippingAddress, payment |

## 🎨 Agregar Nuevas Traducciones

### Paso 1: Agregar a los archivos JSON

**lib/i18n/locales/es.json:**

```json
{
    "mySection": {
        "greeting": "Hola",
        "farewell": "Adiós"
    }
}
```

**lib/i18n/locales/en.json:**

```json
{
    "mySection": {
        "greeting": "Hello",
        "farewell": "Goodbye"
    }
}
```

### Paso 2: Actualizar tipos

**lib/i18n/types.ts:**

```typescript
export interface Translations {
    // ... otras secciones
    mySection: {
        greeting: string;
        farewell: string;
    };
}
```

### Paso 3: Usar en componente

```tsx
const { t } = useI18n();

return (
    <div>
        <h1>{t.mySection.greeting}</h1>
        <p>{t.mySection.farewell}</p>
    </div>
);
```

## 🌍 Agregar Nuevo Idioma

### 1. Crear archivo de traducciones

Crear `lib/i18n/locales/fr.json` con todas las traducciones en francés.

### 2. Actualizar tipo Locale

```typescript
// lib/i18n/types.ts
export type Locale = 'en' | 'es' | 'fr';
```

### 3. Importar y registrar

```typescript
// lib/i18n/context.tsx
import fr from './locales/fr.json';

const translations: Record<Locale, Translations> = {
    en: en as Translations,
    es: es as Translations,
    fr: fr as Translations,
};
```

### 4. Actualizar LanguageSwitcher

```typescript
// components/Shared/LanguageSwitcher.tsx
const languages = [
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
];
```

## 🧪 Testing

### Prueba Manual

1. Iniciar la aplicación: `npm run dev`
2. Abrir `http://localhost:3000`
3. Click en el selector de idioma (🌐)
4. Cambiar entre idiomas
5. Verificar que todos los textos cambien
6. Recargar la página (F5)
7. Verificar que el idioma se mantenga

### Verificar Cookie

```javascript
// En la consola del navegador
document.cookie;
// Debe mostrar: nike-locale=es o nike-locale=en
```

## 📊 Componentes Actualizados

### ✅ Navegación

- Navbar (menú, búsqueda, enlaces de usuario)
- Footer (copyright, enlaces legales)
- LanguageSwitcher (selector de idioma)

### ✅ Autenticación

- SignInForm (formulario de inicio de sesión)
- SignUpForm (formulario de registro)

### ✅ Home

- HeroSection (sección hero)
- HomeContent (contenido principal)

### ✅ Productos

- Filters (filtros de productos)
- ProductActions (acciones de producto)

### ✅ Carrito

- CartSummary (resumen del carrito)
- OrderSuccess (página de éxito)

### ✅ Pedidos

- OrdersList (lista de pedidos)

## 🔒 Persistencia

El idioma se guarda en una cookie con las siguientes características:

- **Nombre**: `nike-locale`
- **Duración**: 1 año (365 días)
- **Path**: `/` (toda la aplicación)
- **SameSite**: `Lax` (seguridad)

## ⚡ Performance

- **Carga estática**: Las traducciones se cargan de forma estática
- **Sin API calls**: No hay llamadas a API para obtener traducciones
- **Cambio instantáneo**: El cambio de idioma es inmediato
- **Sin flash**: No hay parpadeo al cargar la página

## 🎯 Mejores Prácticas

### ✅ DO

```tsx
// Usar el hook useI18n
const { t } = useI18n();
return <h1>{t.home.hero.title}</h1>;

// Componentes client para usar traducciones
('use client');
import { useI18n } from '@/lib/i18n';
```

### ❌ DON'T

```tsx
// No hardcodear textos
return <h1>Bienvenido</h1>; // ❌

// No usar traducciones en Server Components directamente
// (crear un wrapper client component)
```

## 🐛 Solución de Problemas

### El idioma no cambia

**Problema**: Al hacer click en el selector, el idioma no cambia.

**Solución**:

- Verificar que el componente tenga `'use client'`
- Verificar que esté dentro del `I18nProvider`
- Revisar la consola por errores

### Traducciones no aparecen

**Problema**: Aparece `undefined` o la clave en lugar de la traducción.

**Solución**:

- Verificar que la clave existe en ambos archivos JSON
- Verificar que los tipos estén actualizados en `types.ts`
- Verificar la ruta de acceso: `t.section.key`

### El idioma no persiste

**Problema**: Al recargar la página, vuelve al idioma por defecto.

**Solución**:

- Verificar que las cookies estén habilitadas en el navegador
- Revisar la configuración de SameSite
- Limpiar cookies y probar de nuevo

### Error de hidratación

**Problema**: Warning de hidratación en la consola.

**Solución**:

- El `I18nProvider` ya maneja esto esperando a que el componente esté montado
- Si persiste, verificar que no haya otros componentes causando el problema

## 📚 Documentación Adicional

- **Guía Rápida**: `docs/I18N_QUICKSTART.md`
- **Documentación Técnica**: `docs/I18N_IMPLEMENTATION.md`
- **Archivos de Traducciones**: `lib/i18n/locales/`

## 🤝 Contribuir

Para agregar o mejorar traducciones:

1. Editar los archivos JSON en `lib/i18n/locales/`
2. Actualizar los tipos en `lib/i18n/types.ts`
3. Probar los cambios
4. Verificar que no haya errores de TypeScript: `npm run check:ts`

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisar la documentación en `docs/`
2. Verificar la sección de solución de problemas
3. Revisar los archivos de ejemplo en `components/`

---

**Idioma por defecto**: Español (🇪🇸)
**Idiomas disponibles**: Español, Inglés
**Última actualización**: 2025
