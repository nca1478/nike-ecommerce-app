# 🏃‍♂️ Nike E-Commerce Platform

Una plataforma de comercio electrónico moderna y completa para la venta de calzado Nike, construida con las últimas tecnologías web.

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración en Desarrollo](#-instalación-y-configuración-en-desarrollo)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue en Producción](#-despliegue-en-producción)
- [Estructura de la Base de Datos](#-estructura-de-la-base-de-datos)
- [Internacionalización](#-internacionalización)
- [Guía de Desarrollo](#-guía-de-desarrollo)

## 🎯 Descripción General

Nike E-Commerce es una aplicación web full-stack que permite a los usuarios:

- Explorar y filtrar productos de calzado Nike
- Gestionar carritos de compra (usuarios autenticados e invitados)
- Realizar compras seguras mediante Stripe
- Gestionar pedidos y descargar facturas
- Experiencia multiidioma (Inglés/Español)

## ✨ Características Principales

### Para Usuarios

- **Catálogo de Productos**: Navegación intuitiva con filtros avanzados (género, talla, color, precio)
- **Sistema de Variantes**: Múltiples colores y tallas por producto
- **Carrito Persistente**: Funciona para usuarios autenticados e invitados
- **Autenticación Segura**: Sistema de registro e inicio de sesión con Better Auth
- **Procesamiento de Pagos**: Integración completa con Stripe
- **Gestión de Pedidos**: Historial completo con seguimiento de estado
- **Facturas PDF**: Generación y descarga automática de facturas
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Multiidioma**: Soporte para Inglés y Español

### Técnicas

- **Server-Side Rendering (SSR)**: Renderizado del lado del servidor con Next.js 16
- **React Compiler**: Optimización automática de componentes
- **Type Safety**: TypeScript en todo el proyecto
- **ORM Moderno**: Drizzle ORM con PostgreSQL
- **Estado Global**: Zustand para gestión de estado
- **Validación**: Zod para validación de esquemas
- **Estilizado**: Tailwind CSS 4 con tema personalizado

## 🛠 Stack Tecnológico

### Frontend

- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast
- **Estado**: Zustand 5.0.8

### Backend

- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Base de Datos**: PostgreSQL 17
- **ORM**: Drizzle ORM 0.44.7
- **Autenticación**: Better Auth 1.3.34
- **Pagos**: Stripe 20.0.0
- **Generación PDF**: jsPDF 3.0.4

### DevOps & Tools

- **Contenedores**: Docker & Docker Compose
- **Linting**: ESLint 9
- **Formateo**: Prettier 3.6.2
- **Migraciones**: Drizzle Kit 0.31.6

## 🏗 Arquitectura del Proyecto

```
nike-ecommerce-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── sign-in/              # Página de inicio de sesión
│   │   ├── sign-up/              # Página de registro
│   │   └── layout.tsx            # Layout para páginas de auth
│   ├── (root)/                   # Rutas principales
│   │   ├── cart/                 # Carrito de compras
│   │   ├── checkout/             # Proceso de pago
│   │   │   └── success/          # Confirmación de pedido
│   │   ├── legal/                # Páginas legales
│   │   │   ├── guides/           # Guías de usuario
│   │   │   ├── privacy-policy/   # Política de privacidad
│   │   │   ├── terms-of-sale/    # Términos de venta
│   │   │   └── terms-of-use/     # Términos de uso
│   │   ├── orders/               # Gestión de pedidos
│   │   │   └── [orderId]/        # Detalle de pedido
│   │   ├── products/             # Catálogo de productos
│   │   │   └── [id]/             # Detalle de producto
│   │   ├── layout.tsx            # Layout principal
│   │   └── page.tsx              # Página de inicio
│   ├── api/                      # API Routes
│   │   ├── auth/[...all]/        # Endpoints de Better Auth
│   │   ├── orders/[orderId]/     # API de pedidos
│   │   └── stripe/               # Webhooks de Stripe
│   ├── globals.css               # Estilos globales
│   └── layout.tsx                # Root layout
│
├── components/                   # Componentes React
│   ├── auth/                     # Componentes de autenticación
│   ├── Cart/                     # Componentes del carrito
│   ├── Home/                     # Componentes de la página principal
│   ├── Orders/                   # Componentes de pedidos
│   ├── Product/                  # Componentes de productos
│   ├── Shared/                   # Componentes compartidos (Navbar, Footer)
│   └── UI/                       # Componentes UI reutilizables
│
├── lib/                          # Lógica de negocio
│   ├── actions/                  # Server Actions
│   │   ├── cart.ts               # Acciones del carrito
│   │   ├── checkout.ts           # Acciones de checkout
│   │   ├── filters.ts            # Acciones de filtros
│   │   ├── orders.ts             # Acciones de pedidos
│   │   └── product.ts            # Acciones de productos
│   ├── auth/                     # Configuración de autenticación
│   ├── db/                       # Base de datos
│   │   ├── schema/               # Esquemas de Drizzle
│   │   │   ├── filters/          # Esquemas de filtros (género, color, talla)
│   │   │   ├── account.ts        # Cuentas de usuario
│   │   │   ├── addresses.ts      # Direcciones
│   │   │   ├── brands.ts         # Marcas
│   │   │   ├── carts.ts          # Carritos
│   │   │   ├── categories.ts     # Categorías
│   │   │   ├── collections.ts    # Colecciones
│   │   │   ├── coupons.ts        # Cupones
│   │   │   ├── guest.ts          # Usuarios invitados
│   │   │   ├── orders.ts         # Pedidos
│   │   │   ├── products.ts       # Productos y variantes
│   │   │   ├── session.ts        # Sesiones
│   │   │   ├── user.ts           # Usuarios
│   │   │   ├── verification.ts   # Verificaciones
│   │   │   └── wishlists.ts      # Listas de deseos
│   │   ├── apply-indexes.ts      # Aplicar índices
│   │   ├── index.ts              # Configuración de DB
│   │   └── seed.ts               # Datos de prueba
│   ├── i18n/                     # Internacionalización
│   │   ├── locales/              # Traducciones (en.json, es.json)
│   │   ├── context.tsx           # Contexto de i18n
│   │   ├── server.ts             # Utilidades del servidor
│   │   └── types.ts              # Tipos de traducciones
│   ├── store/                    # Estado global (Zustand)
│   ├── stripe/                   # Integración con Stripe
│   └── utils/                    # Utilidades
│
├── public/                       # Archivos estáticos
│   ├── shoes/                    # Imágenes de productos
│   └── uploads/                  # Imágenes subidas
│
├── drizzle/                      # Migraciones de base de datos
├── .env.example                  # Variables de entorno de ejemplo
├── docker-compose.yml            # Configuración de Docker
├── drizzle.config.ts             # Configuración de Drizzle
├── next.config.ts                # Configuración de Next.js
├── package.json                  # Dependencias
└── tsconfig.json                 # Configuración de TypeScript
```

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v20 o superior
- **npm**: v10 o superior
- **Docker**: v24 o superior (opcional, para base de datos local)
- **PostgreSQL**: v17 (si no usas Docker)

## 🚀 Instalación y Configuración en Desarrollo

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd nike-ecommerce-app
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Configuración Requerida:

```env
# Entorno
NODE_ENV=development                    # development | production

# API Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Base de Datos PostgreSQL
DB_USER=user
DB_NAME=db_name
DB_PASSWORD=db_password
DATABASE_URL=postgresql://user:db_password@localhost:5433/db_name

# Better Auth (Autenticación)
BETTER_AUTH_SECRET=your_secret_key_here_min_32_characters_required
BETTER_AUTH_URL=http://localhost:3000

# Stripe (Pagos)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_stripe_cli
```

### 4. Variables de entorno Base de Datos

- Asigna las variables para configurar la DB en Docker:

```
DB_USER=un_usuario
DB_NAME=un_nombre_de_db
DB_PASSWORD=una_contraseña
```

- Asigna la cadena de conexión (Drizzel ORM):

```
DATABASE_URL=postgresql://user:db_password@localhost:5433/db_name
```

### 5. Clave Better Auth Secret

Genera un secret seguro (**Key** → `BETTER_AUTH_SECRET`):

```bash
openssl rand -base64 32
```

### 6. Obtener Claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Crea una cuenta o inicia sesión
3. Ve a **Developers > API keys**
4. Copia:
    - **Secret key** → `STRIPE_SECRET_KEY`
    - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 7. Iniciar Docker (Postgres y Stripe CLI)

```bash
docker-compose up -d
```

Esto iniciará:

- **PostgreSQL**: Base de datos en el puerto 5433
- **Stripe CLI**: Servicio para manejar webhooks de Stripe en desarrollo

### 8. Configurar Base de Datos

Ejecuta el script de configuración completa:

```bash
npm run db:setup
```

Este comando ejecutará:

- Generación de migraciones
- Aplicación de migraciones
- Creación de índices
- Población de datos de prueba (Seed)

### 9. Stripe CLI para Webhooks en Desarrollo

En desarrollo, debe obtenerse el webhook secret automáticamente del contenedor Stripe CLI:

1. Asegúrate de que Docker Compose está corriendo:

    ```bash
    docker-compose up -d
    ```

2. Obtén el webhook secret del contenedor:

    ```bash
    docker logs stripe-cli 2>&1 | findstr "whsec_"
    ```

    En Linux/Mac usa:

    ```bash
    docker logs stripe-cli 2>&1 | grep "whsec_"
    ```

3. Copia el secret que aparece (comienza con `whsec_`) y agrégalo a tu `.env`:

    ```env
    STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

**Nota**: El webhook secret es probable que cambie cada vez que reinicias el contenedor de Stripe CLI. Si reinicias Docker Compose, deberás actualizar el `STRIPE_WEBHOOK_SECRET` en tu `.env`.

### 10. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

### Desarrollo

```bash
npm run dev              # Inicia servidor de desarrollo
npm run build            # Construye para producción
npm start                # Inicia servidor de producción
npm run lint             # Ejecuta ESLint
npm run format           # Formatea código con Prettier
npm run check:ts         # Verifica tipos de TypeScript
```

### Base de Datos

```bash
npm run db:generate      # Genera migraciones desde esquemas
npm run db:migrate       # Aplica migraciones pendientes
npm run db:push          # Sincroniza esquema con DB (fuerza)
npm run db:indexes       # Aplica índices personalizados
npm run db:seed          # Puebla DB con datos de prueba
npm run db:setup         # Ejecuta todo el proceso de configuración
```

### Despliegue

```bash
npm run predeploy        # Prepara para despliegue (DB + build)
```

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

1. **Conecta tu repositorio** a Vercel
2. **Configura variables de entorno** en el dashboard de Vercel
3. **Configura base de datos PostgreSQL**:
    - Usa Vercel Postgres, Neon, Supabase o Railway
    - Actualiza `DATABASE_URL` con la URL de producción
4. **Configura Stripe**:
    - Usa claves de producción
    - Configura webhook endpoint en Stripe Dashboard
5. **Despliega**:
    ```bash
    vercel --prod
    ```

### Opción 2: Docker

1. **Construye la imagen**:

    ```bash
    docker build -t nike-ecommerce .
    ```

2. **Ejecuta el contenedor**:
    ```bash
    docker run -p 3000:3000 --env-file .env nike-ecommerce
    ```

### Consideraciones de Producción

- ✅ Usa `BETTER_AUTH_SECRET` de al menos 32 caracteres
- ✅ Configura `BETTER_AUTH_URL` con tu dominio de producción
- ✅ Usa claves de Stripe de producción
- ✅ Habilita SSL/HTTPS
- ✅ Configura CORS apropiadamente
- ✅ Implementa rate limiting
- ✅ Configura backups de base de datos
- ✅ Monitorea logs y errores

### Obtener Credenciales

#### Stripe

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Ve a **Developers** → **API Keys**
3. Copia las claves de prueba (comienzan con `sk_test_` y `pk_test_`)
4. Agrega `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` a tu `.env`

#### Stripe Webhook Secret (Producción)

Para producción:

1. Ve a **Developers** → **Webhooks** en el dashboard de Stripe
2. Crea un endpoint: `https://tu-dominio.com/api/stripe`
3. Eventos a escuchar: `checkout.session.completed`
4. Copia el webhook secret y úsalo en tu entorno de producción

## 🗄 Estructura de la Base de Datos

### Tablas Principales

#### Autenticación (Better Auth)

- **user**: Usuarios del sistema
- **account**: Cuentas de proveedores OAuth
- **session**: Sesiones activas
- **guest**: Usuarios invitados
- **verification**: Tokens de verificación

#### Productos

- **products**: Información base de productos
- **product_variants**: Variantes (color + talla)
- **product_images**: Imágenes de productos
- **brands**: Marcas (Nike)
- **categories**: Categorías (Running, Basketball, etc.)
- **collections**: Colecciones (Summer 2025, Best Sellers)
- **reviews**: Reseñas de productos

#### Filtros

- **genders**: Géneros (Men, Women, Unisex, Kids)
- **colors**: Colores disponibles
- **sizes**: Tallas disponibles

#### Comercio

- **carts**: Carritos de compra
- **cart_items**: Items en el carrito
- **orders**: Pedidos realizados
- **order_items**: Items de cada pedido
- **payments**: Información de pagos
- **addresses**: Direcciones de envío/facturación
- **coupons**: Cupones de descuento
- **wishlists**: Listas de deseos

### Relaciones Clave

```
products
  ├── category (many-to-one)
  ├── gender (many-to-one)
  ├── brand (many-to-one)
  ├── variants (one-to-many)
  │   ├── color (many-to-one)
  │   └── size (many-to-one)
  ├── images (one-to-many)
  └── reviews (one-to-many)

orders
  ├── user (many-to-one)
  ├── items (one-to-many)
  │   └── product_variant (many-to-one)
  ├── shipping_address (many-to-one)
  ├── billing_address (many-to-one)
  └── payments (one-to-many)

carts
  ├── user (many-to-one) [opcional]
  ├── guest (many-to-one) [opcional]
  └── items (one-to-many)
      └── product_variant (many-to-one)
```

### Índices Optimizados

La base de datos incluye índices compuestos para optimizar consultas frecuentes:

- Filtrado de productos por marca, categoría y género
- Búsqueda de variantes por color y talla
- Selección de imágenes primarias
- Consultas de pedidos por usuario

## 🌍 Internacionalización

La aplicación soporta múltiples idiomas mediante un sistema de i18n personalizado.

### Idiomas Disponibles

- 🇺🇸 Inglés (en) - Por defecto
- 🇪🇸 Español (es)

### Estructura de Traducciones

Las traducciones se encuentran en `lib/i18n/locales/`:

- `en.json` - Traducciones en inglés
- `es.json` - Traducciones en español

### Agregar Nuevas Traducciones

1. Edita los archivos JSON en `lib/i18n/locales/`
2. Sigue la estructura existente
3. Actualiza el tipo `Translations` en `lib/i18n/types.ts`

### Uso en Componentes

```typescript
// Client Component
'use client';
import { useTranslations } from '@/lib/i18n';

export function MyComponent() {
  const t = useTranslations();
  return <h1>{t.home.hero.title}</h1>;
}

// Server Component
import { getTranslations } from '@/lib/i18n/server';

export async function MyServerComponent() {
  const t = await getTranslations();
  return <h1>{t.home.hero.title}</h1>;
}
```

### Cambiar Idioma

El usuario puede cambiar el idioma usando el componente `LanguageSwitcher` en el footer.

## 👨‍💻 Guía de Desarrollo

### Estructura de Componentes

#### Server Components (Por Defecto)

- Renderizados en el servidor
- Acceso directo a base de datos
- No pueden usar hooks de React
- Mejor para SEO y rendimiento

```typescript
// app/(root)/products/page.tsx
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

#### Client Components

- Requieren directiva `'use client'`
- Pueden usar hooks y estado
- Interactividad del lado del cliente

```typescript
'use client';
import { useState } from 'react';

export function AddToCartButton() {
    const [loading, setLoading] = useState(false);
    // ...
}
```

### Server Actions

Las acciones del servidor se encuentran en `lib/actions/`:

```typescript
'use server';

export async function addToCart(variantId: string, quantity: number) {
  // Lógica del servidor
  const cart = await db.insert(cartItems).values({...});
  revalidatePath('/cart');
  return { success: true };
}
```

### Gestión de Estado

#### Estado Local

Usa `useState` para estado de componente:

```typescript
const [isOpen, setIsOpen] = useState(false);
```

#### Estado Global (Zustand)

Para estado compartido entre componentes:

```typescript
// lib/store/cart.store.ts
import { create } from 'zustand';

export const useCartStore = create((set) => ({
    items: [],
    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
        })),
}));

// En componente
const { items, addItem } = useCartStore();
```

### Consultas a Base de Datos

Usa Drizzle ORM para consultas type-safe:

```typescript
import { db } from '@/lib/db';
import { products, productVariants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Consulta simple
const allProducts = await db.select().from(products);

// Con relaciones
const productWithVariants = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
        variants: true,
        images: true,
    },
});

// Con filtros
const filteredProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
    .limit(10);
```

### Validación con Zod

```typescript
import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.string().regex(/^\d+(\.\d{2})?$/, 'Invalid price'),
    quantity: z.number().int().positive(),
});

// Validar datos
const result = productSchema.safeParse(data);
if (!result.success) {
    console.error(result.error);
}
```

### Estilos con Tailwind

El proyecto usa Tailwind CSS 4 con tema personalizado:

```tsx
// Usando clases de utilidad
<div className="bg-light-100 text-dark-900 p-4 rounded-lg">
  <h1 className="text-heading-2 font-bold">Title</h1>
  <p className="text-body text-dark-700">Description</p>
</div>

// Variables CSS personalizadas (definidas en globals.css)
<div style={{ color: 'var(--color-dark-900)' }}>
  Custom color
</div>
```

### Manejo de Imágenes

```tsx
import Image from 'next/image';

<Image
    src="/uploads/shoe-1.jpg"
    alt="Nike Air Max"
    width={500}
    height={500}
    priority // Para imágenes above-the-fold
/>;
```

### Autenticación

```typescript
// Obtener sesión en Server Component
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  redirect('/sign-in');
}

// En Client Component
'use client';
import { useSession } from '@/lib/auth/hooks';

export function UserProfile() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {session.user.name}</div>;
}
```

### Integración con Stripe

```typescript
// Crear sesión de checkout
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Nike Air Max',
                },
                unit_amount: 15000, // $150.00
            },
            quantity: 1,
        },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
});
```

### Generación de PDFs

```typescript
import { generateInvoicePDF } from '@/lib/utils/generateInvoicePDF';

const pdfBlob = await generateInvoicePDF(order);
// Descargar o enviar por email
```

## 🧪 Testing

### Datos de Prueba

El comando `npm run db:seed` crea:

- 15 productos de ejemplo
- Múltiples variantes (colores y tallas)
- Categorías: Running, Basketball, Training, Lifestyle, Soccer
- Géneros: Men, Women, Unisex, Kids
- 11 colores diferentes
- 13 tallas (6 - 12)

### Usuario de Prueba

Crea un usuario de prueba:

1. Ve a `http://localhost:3000/sign-up`
2. Registra una cuenta
3. Usa las credenciales para probar el flujo completo

### Tarjetas de Prueba Stripe

Usa estas tarjetas en modo test:

- **Éxito**: `4242 4242 4242 4242`
- **Requiere autenticación**: `4000 0025 0000 3155`
- **Declinada**: `4000 0000 0000 9995`

Fecha de expiración: Cualquier fecha futura
CVC: Cualquier 3 dígitos
ZIP: Cualquier 5 dígitos

## 🐛 Solución de Problemas

### Error: "DATABASE_URL is not defined"

- Verifica que el archivo `.env` existe
- Asegúrate de que `DATABASE_URL` está configurado correctamente

### Error de conexión a PostgreSQL

- Verifica que Docker está corriendo: `docker ps`
- Reinicia el contenedor: `docker-compose restart`
- Verifica el puerto: PostgreSQL debe estar en 5433

### Error: "BETTER_AUTH_SECRET is not defined"

- Genera un secret: `openssl rand -base64 32`
- Agrégalo al archivo `.env`

### Imágenes no se cargan

- Verifica que la carpeta `public/uploads` existe
- Ejecuta `npm run db:seed` para copiar imágenes de ejemplo

### Error en build de producción

- Ejecuta `npm run check:ts` para verificar errores de TypeScript
- Ejecuta `npm run lint` para verificar errores de ESLint

## 📚 Recursos Adicionales

### Documentación Oficial

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Better Auth](https://www.better-auth.com/docs)
- [Stripe](https://stripe.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs)

### Herramientas Útiles

- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) - GUI para base de datos
- [Stripe CLI](https://stripe.com/docs/stripe-cli) - Testing de webhooks local

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es público, desarrollado solo por propósito educativo.

## 👥 Equipo

Desarrollado con ❤️ por Nelson Cadenas

---

**¿Algo no funciona bien?** Abre un issue en el repositorio o contactame.
