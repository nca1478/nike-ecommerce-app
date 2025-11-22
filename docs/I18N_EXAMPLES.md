# Ejemplos de Uso de i18n

## Ejemplos Básicos

### 1. Componente Simple con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function WelcomeMessage() {
    const { t } = useI18n();

    return (
        <div>
            <h1>{t.home.hero.title}</h1>
            <p>{t.home.hero.description}</p>
        </div>
    );
}
```

### 2. Botón con Traducción

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function SubmitButton() {
    const { t } = useI18n();

    return <button className="btn-primary">{t.common.save}</button>;
}
```

### 3. Formulario con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';
import { useState } from 'react';

export function ContactForm() {
    const { t } = useI18n();
    const [email, setEmail] = useState('');

    return (
        <form>
            <label>{t.auth.email}</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
            />
            <button type="submit">{t.common.save}</button>
        </form>
    );
}
```

## Ejemplos Avanzados

### 4. Cambiar Idioma Programáticamente

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function LanguageButtons() {
    const { locale, setLocale } = useI18n();

    return (
        <div>
            <button
                onClick={() => setLocale('es')}
                className={locale === 'es' ? 'active' : ''}
            >
                Español
            </button>
            <button
                onClick={() => setLocale('en')}
                className={locale === 'en' ? 'active' : ''}
            >
                English
            </button>
        </div>
    );
}
```

### 5. Mostrar Contenido Condicional según Idioma

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function LocalizedContent() {
    const { locale, t } = useI18n();

    return (
        <div>
            <h1>{t.home.hero.title}</h1>

            {/* Contenido específico por idioma */}
            {locale === 'es' && <p>Contenido exclusivo en español</p>}

            {locale === 'en' && <p>Exclusive content in English</p>}
        </div>
    );
}
```

### 6. Lista con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function ProductFilters() {
    const { t } = useI18n();

    const filters = [
        { key: 'gender', label: t.products.gender },
        { key: 'size', label: t.products.size },
        { key: 'color', label: t.products.color },
        { key: 'price', label: t.products.price },
    ];

    return (
        <div>
            <h2>{t.products.filters}</h2>
            <ul>
                {filters.map((filter) => (
                    <li key={filter.key}>{filter.label}</li>
                ))}
            </ul>
        </div>
    );
}
```

### 7. Mensajes de Error con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function LoginForm() {
    const { t } = useI18n();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Lógica de login
            const result = await login();

            if (!result.success) {
                toast.error(t.auth.signInError);
            }
        } catch (error) {
            toast.error(t.auth.unexpectedError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <button type="submit" disabled={loading}>
                {loading ? t.auth.signingIn : t.auth.signIn}
            </button>
        </form>
    );
}
```

### 8. Tabla con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

interface Order {
    id: string;
    date: Date;
    total: number;
    status: string;
}

export function OrdersTable({ orders }: { orders: Order[] }) {
    const { t } = useI18n();

    return (
        <table>
            <thead>
                <tr>
                    <th>{t.orders.orderNumber}</th>
                    <th>{t.orders.date}</th>
                    <th>{t.orders.total}</th>
                    <th>{t.orders.status}</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.date.toLocaleDateString()}</td>
                        <td>${order.total}</td>
                        <td>{order.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

### 9. Modal con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const { t } = useI18n();

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{t.common.confirm}</h2>
                <p>¿Estás seguro de que deseas continuar?</p>
                <div className="modal-actions">
                    <button onClick={onCancel}>{t.common.cancel}</button>
                    <button onClick={onConfirm}>{t.common.confirm}</button>
                </div>
            </div>
        </div>
    );
}
```

### 10. Navegación con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export function Navigation() {
    const { t } = useI18n();

    const navItems = [
        { href: '/products?gender=men', label: t.nav.men },
        { href: '/products?gender=women', label: t.nav.women },
        { href: '/products?gender=kids', label: t.nav.kids },
        { href: '/products?gender=unisex', label: t.nav.unisex },
    ];

    return (
        <nav>
            {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
```

## Ejemplos de Integración

### 11. Wrapper para Server Components

Cuando necesitas usar traducciones en un Server Component, crea un wrapper client:

```tsx
// app/products/page.tsx (Server Component)
import { ProductsClient } from './ProductsClient';

export default async function ProductsPage() {
    const products = await getProducts();

    return <ProductsClient products={products} />;
}
```

```tsx
// app/products/ProductsClient.tsx (Client Component)
'use client';

import { useI18n } from '@/lib/i18n';

export function ProductsClient({ products }) {
    const { t } = useI18n();

    return (
        <div>
            <h1>{t.products.title}</h1>
            {/* Renderizar productos */}
        </div>
    );
}
```

### 12. Hook Personalizado con Traducciones

```tsx
'use client';

import { useI18n } from '@/lib/i18n';
import { useMemo } from 'react';

export function useOrderStatus() {
    const { t } = useI18n();

    const statusMap = useMemo(
        () => ({
            confirmed: t.orders.confirmed,
            preparing: t.orders.preparing,
            shipped: t.orders.shipped,
            delivered: t.orders.delivered,
            cancelled: t.orders.cancelled,
        }),
        [t],
    );

    const getStatusLabel = (status: string) => {
        return statusMap[status as keyof typeof statusMap] || status;
    };

    return { getStatusLabel, statusMap };
}

// Uso
export function OrderStatus({ status }: { status: string }) {
    const { getStatusLabel } = useOrderStatus();

    return <span>{getStatusLabel(status)}</span>;
}
```

### 13. Formateo de Fechas según Idioma

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function FormattedDate({ date }: { date: Date }) {
    const { locale } = useI18n();

    const formattedDate = date.toLocaleDateString(
        locale === 'es' ? 'es-ES' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    );

    return <span>{formattedDate}</span>;
}
```

### 14. Pluralización Simple

```tsx
'use client';

import { useI18n } from '@/lib/i18n';

export function ItemCount({ count }: { count: number }) {
    const { t } = useI18n();

    const label = count === 1 ? t.orders.item : t.orders.items;

    return (
        <span>
            {count} {label}
        </span>
    );
}
```

### 15. Búsqueda con Placeholder Traducido

```tsx
'use client';

import { useI18n } from '@/lib/i18n';
import { useState } from 'react';

export function SearchBar() {
    const { t } = useI18n();
    const [query, setQuery] = useState('');

    return (
        <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.search}
            aria-label={t.nav.search}
        />
    );
}
```

## Patrones Comunes

### Patrón 1: Loading States

```tsx
const { t } = useI18n();

{
    loading ? t.common.loading : t.common.save;
}
```

### Patrón 2: Conditional Rendering

```tsx
const { t } = useI18n();

{
    error && <div className="error">{t.common.error}</div>;
}
{
    success && <div className="success">{t.common.success}</div>;
}
```

### Patrón 3: Button States

```tsx
const { t } = useI18n();

<button disabled={loading}>
    {loading ? t.cart.processing : t.cart.checkout}
</button>;
```

### Patrón 4: Empty States

```tsx
const { t } = useI18n();

{
    items.length === 0 ? (
        <div className="empty-state">
            <p>{t.cart.empty}</p>
            <p>{t.cart.emptyDescription}</p>
        </div>
    ) : (
        <ItemsList items={items} />
    );
}
```

### Patrón 5: Form Validation

```tsx
const { t } = useI18n();

{
    !selectedSize && <p className="error">{t.products.pleaseSelectSize}</p>;
}

{
    !hasStock && <p className="error">{t.products.outOfStock}</p>;
}
```

## Tips y Mejores Prácticas

### ✅ Usar traducciones para todos los textos visibles

```tsx
// ✅ Correcto
<h1>{t.home.hero.title}</h1>

// ❌ Incorrecto
<h1>Bienvenido</h1>
```

### ✅ Mantener las claves organizadas

```tsx
// ✅ Correcto - Estructura clara
t.products.filters;
t.products.size;
t.products.color;

// ❌ Incorrecto - Claves planas
t.filters;
t.size;
t.color;
```

### ✅ Usar nombres descriptivos

```tsx
// ✅ Correcto
t.auth.signingIn;
t.auth.signInError;

// ❌ Incorrecto
t.auth.loading;
t.auth.error;
```

### ✅ Agrupar traducciones relacionadas

```json
{
    "cart": {
        "title": "Carrito",
        "empty": "Tu carrito está vacío",
        "emptyDescription": "Agrega productos",
        "checkout": "Finalizar Compra"
    }
}
```

### ✅ Mantener consistencia

```tsx
// ✅ Correcto - Usar siempre el hook
const { t } = useI18n();

// ❌ Incorrecto - Mezclar con textos hardcodeados
const { t } = useI18n();
return <div>{t.title} - Subtítulo hardcodeado</div>;
```

## Recursos

- **Documentación Completa**: `docs/I18N_IMPLEMENTATION.md`
- **Guía Rápida**: `docs/I18N_QUICKSTART.md`
- **README**: `README_I18N.md`
- **Archivos de Traducciones**: `lib/i18n/locales/`
