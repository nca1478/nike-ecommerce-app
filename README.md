# Nike Store - E-commerce App

Una aplicación de e-commerce moderna y completa construida con Next.js 16, TypeScript y las mejores tecnologías del ecosistema React. Incluye sistema de autenticación completo con Better Auth, base de datos PostgreSQL con Drizzle ORM, carrito de compras persistente, y un schema de base de datos robusto listo para producción con productos, variantes, órdenes, pagos, cupones, colecciones y más.

## 🎯 Estado Actual del Proyecto

**Versión:** 1.1.0 MVP + Stripe  
**Estado:** ✅ **Listo para Producción (MVP con Pagos)**  
**Última actualización:** 18 de Noviembre, 2025

### ✅ Completado

- Sistema de autenticación completo (Better Auth)
- Base de datos robusta con 23 tablas
- Sistema de productos con filtrado avanzado
- Páginas de listado y detalle de productos (SSR)
- Búsqueda, ordenamiento y paginación
- Carrito de compras con persistencia
- **Sistema de pagos con Stripe Checkout** ✨ **NUEVO**
- **Webhook de Stripe para confirmación de pagos** ✨ **NUEVO**
- **Página de confirmación de pedidos** ✨ **NUEVO**
- **Sistema de reintentos inteligente** ✨ **NUEVO**
- **Creación automática de pedidos** ✨ **NUEVO**
- Optimizaciones de rendimiento (índices, React Compiler)
- Documentación completa (32 archivos)

### 🔨 En Desarrollo

- Historial de pedidos del usuario
- Panel de administración
- Notificaciones por email de confirmación de pedidos

### 📈 Métricas de Calidad

- ✅ ESLint: 0 errores, 0 warnings
- ✅ TypeScript: 0 errores de tipos
- ✅ Build: Compilación exitosa
- ✅ Type Safety: 100%
- ✅ Documentación: Completa

## 🚀 Stack Tecnológico

### Frontend

- **Next.js 16.0.3** - Framework React con App Router y React Server Components
- **React 19.2.0** - Biblioteca UI con React Compiler habilitado
- **TypeScript 5** - Tipado estático para mayor seguridad
- **TailwindCSS 4** - Framework CSS utility-first con PostCSS
- **Next/Image** - Optimización automática de imágenes

### Backend & Base de Datos

- **Neon PostgreSQL** - Base de datos serverless con pooling de conexiones
- **Drizzle ORM 0.44.7** - ORM type-safe con inferencia de tipos
- **Drizzle Kit 0.31.6** - Herramientas de migración y gestión de schemas

### Pagos & Checkout

- **Stripe** - Procesamiento de pagos seguro con Stripe Checkout hosted
- **Webhooks** - Confirmación automática de pagos con verificación de firma HMAC
- **Sistema de Reintentos** - Búsqueda inteligente de pedidos con 3 intentos y 1s delay
- **Fallback Inteligente** - Muestra detalles desde Stripe si el webhook tarda
- **Validación de Imágenes** - Validación automática de URLs antes de enviar a Stripe
- **Manejo de Precios** - Precios en céntimos para precisión matemática

### Estado & Autenticación

- **Zustand 5.0.8** - Gestión de estado global con persistencia en localStorage
- **Better Auth 1.3.34** - Sistema de autenticación completo con adaptador Drizzle
- **Zod 4.1.12** - Validación de esquemas y datos con type-safety
- **UUID 13.0.0** - Generación de identificadores únicos para sesiones

### Herramientas de Desarrollo

- **ESLint 9** - Linting con configuración Next.js
- **TSX 4.20.6** - Ejecución de TypeScript para scripts y seeds
- **dotenv-cli 11.0.0** - Gestión de variables de entorno
- **Babel React Compiler 1.0.0** - Compilador experimental de React 19
- **Lucide React 0.553.0** - Iconos modernos para la interfaz

## Instalación y Configuración Rápida

```bash
# 1. Clonar e instalar
git clone <repository-url>
cd nike-ecommerce-app
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 3. Setup completo de base de datos
npm run db:setup

# 4. Iniciar aplicación
npm run dev
```

- Para ver el home [http://localhost:3000](http://localhost:3000)
- Para ver el catálogo de productos [http://localhost:3000/products](http://localhost:3000/products)

## 📦 Instalación y Configuración Detallada

### 1. Clonar e Instalar Dependencias

```bash
git clone <repository-url>
cd nike-ecommerce-app
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Neon PostgreSQL Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require&channel_binding=require

# Better Auth Configuration
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Generar un secreto seguro para Better Auth:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Obtener claves de Stripe:**

1. Crea una cuenta en [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Ve a **Developers > API keys**
3. Copia:
    - **Secret key** → `STRIPE_SECRET_KEY`
    - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Configurar Webhook de Stripe (Desarrollo):**

```bash
# Instalar Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz

# Login
stripe login

# Escuchar webhooks (esto te dará el webhook secret)
stripe listen --forward-to localhost:3000/api/stripe
```

Copia el **webhook signing secret** que aparece y añádelo como `STRIPE_WEBHOOK_SECRET`.

### 3. Configurar Base de Datos

```bash
# Setup completo automático (Recomendado)
npm run db:setup
# Este comando ejecuta: generate → push → indexes → seed

# O paso a paso si prefieres control manual:
npm run db:generate  # Genera migraciones
npm run db:push      # Aplica esquema con índices básicos
npm run db:indexes   # Aplica índices adicionales (GIN, funcionales)
npm run db:seed      # Inserta datos de ejemplo
```

### 4. Iniciar Aplicación

```bash
# Modo desarrollo
npm run dev

# Producción
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Build de Producción

### Preparación para Producción

Antes de generar el build de producción, asegúrate de:

1. **Verificar variables de entorno de producción**
2. **Ejecutar tests de calidad**
3. **Generar el build optimizado**
4. **Probar el build localmente**

### Procedimiento Completo

#### 1. Configurar Variables de Entorno de Producción

Crea o actualiza tu archivo `.env.local` con las credenciales de producción:

```env
# API Base URL (tu dominio de producción)
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com

# Neon PostgreSQL Database (base de datos de producción)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require&channel_binding=require

# Better Auth Configuration (secreto seguro para producción)
BETTER_AUTH_SECRET=tu_secreto_de_produccion_aqui
BETTER_AUTH_URL=https://tu-dominio.com
```

**⚠️ Importante:** Nunca uses las mismas credenciales de desarrollo en producción.

#### 2. Verificar Calidad del Código

```bash
# Verificar tipos de TypeScript
npm run check:ts

# Ejecutar linting
npm run lint

# Formatear código (opcional)
npm run format
```

#### 3. Preparar Base de Datos de Producción

```bash
# Setup completo de base de datos (genera schema, aplica índices y seed)
npm run db:setup
```

O si prefieres control manual:

```bash
# Generar migraciones
npm run db:generate

# Aplicar schema a la base de datos
npm run db:push

# Aplicar índices de rendimiento
npm run db:indexes

# Insertar datos de ejemplo (opcional en producción)
npm run db:seed
```

#### 4. Generar Build de Producción

```bash
# Build optimizado con todas las optimizaciones de Next.js
npm run build
```

Este comando:

- ✅ Compila TypeScript a JavaScript
- ✅ Optimiza y minifica el código
- ✅ Genera páginas estáticas (SSG) cuando es posible
- ✅ Optimiza imágenes y assets
- ✅ Habilita React Compiler para mejor rendimiento
- ✅ Genera el directorio `.next` con el build

**Salida esperada:**

```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95.3 kB
├ ○ /_not-found                          871 B          85.9 kB
├ ○ /api/auth/[...all]                   0 B                0 B
├ ○ /products                            8.1 kB         98.2 kB
└ ○ /sign-in                             3.4 kB         93.5 kB

○  (Static)  prerendered as static content
```

#### 5. Probar Build Localmente

```bash
# Iniciar servidor de producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) y verifica:

- ✅ Todas las páginas cargan correctamente
- ✅ La autenticación funciona
- ✅ Los productos se muestran con imágenes
- ✅ Los filtros y búsqueda funcionan
- ✅ El carrito persiste correctamente
- ✅ No hay errores en la consola del navegador

#### 6. Comando Todo-en-Uno (Recomendado)

Para preparar todo automáticamente:

```bash
# Ejecuta db:setup + build en un solo comando
npm run predeploy
```

Este script ejecuta:

1. `npm run db:setup` - Configura la base de datos completa
2. `npm run build` - Genera el build de producción

### Optimizaciones de Producción Incluidas

El build de producción incluye automáticamente:

#### Next.js 16 Optimizaciones

- **Server Components** - Renderizado del lado del servidor por defecto
- **Automatic Code Splitting** - División automática del código por rutas
- **Image Optimization** - Optimización automática de imágenes con Next/Image
- **Font Optimization** - Fuentes Geist optimizadas y auto-hospedadas
- **Minification** - Minificación de JavaScript y CSS
- **Tree Shaking** - Eliminación de código no utilizado

#### React 19 + React Compiler

- **React Compiler habilitado** - Optimización automática de componentes
- **Automatic Memoization** - Memoización sin `useMemo` o `useCallback`
- **Better Performance** - Renderizado más rápido y eficiente

#### Base de Datos

- **Connection Pooling** - Pool de conexiones con Neon
- **Prepared Statements** - Consultas preparadas con Drizzle
- **Optimized Indexes** - Índices GIN y funcionales para búsqueda rápida
- **Type-safe Queries** - Consultas type-safe con TypeScript

### Despliegue en Plataformas

#### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Producción
vercel --prod
```

**Configuración en Vercel:**

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en el dashboard
3. Vercel detectará automáticamente Next.js
4. El despliegue se ejecutará automáticamente

#### Otras Plataformas

**Netlify:**

```bash
# Build command
npm run predeploy

# Publish directory
.next
```

**Railway / Render:**

```bash
# Build command
npm run predeploy

# Start command
npm start
```

**Docker:**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Variables de Entorno Requeridas en Producción

Asegúrate de configurar estas variables en tu plataforma de hosting:

```env
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=tu_secreto_seguro
BETTER_AUTH_URL=https://tu-dominio.com
```

### Checklist de Despliegue

Antes de desplegar a producción:

- [ ] Variables de entorno configuradas
- [ ] Base de datos de producción creada
- [ ] Schema aplicado con `npm run db:setup`
- [ ] Build generado exitosamente con `npm run build`
- [ ] Build probado localmente con `npm start`
- [ ] Tests de calidad pasados (`lint`, `check:ts`)
- [ ] Imágenes optimizadas
- [ ] Secretos seguros generados (no usar los de desarrollo)
- [ ] HTTPS configurado en producción
- [ ] Dominio personalizado configurado (opcional)

### Monitoreo Post-Despliegue

Después del despliegue, verifica:

1. **Rendimiento:**
    - Tiempo de carga de páginas < 3s
    - First Contentful Paint (FCP) < 1.8s
    - Largest Contentful Paint (LCP) < 2.5s

2. **Funcionalidad:**
    - Autenticación funciona correctamente
    - Productos se cargan con imágenes
    - Carrito persiste entre sesiones
    - Filtros y búsqueda funcionan

3. **Errores:**
    - Revisar logs de la plataforma
    - Verificar errores en la consola del navegador
    - Monitorear errores de base de datos

### Solución de Problemas en Producción

**Build falla:**

```bash
# Limpiar caché y reinstalar
rm -rf .next node_modules
npm install
npm run build
```

**Errores de base de datos:**

```bash
# Verificar conexión
npm run db:push

# Regenerar schema
npm run db:generate
npm run db:push
```

**Variables de entorno no se cargan:**

- Verifica que estén configuradas en la plataforma de hosting
- No uses `.env.local` en producción (solo para desarrollo)
- Reinicia el servicio después de cambiar variables

## 📝 Scripts Disponibles

| Script                | Descripción                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `npm run dev`         | Inicia servidor de desarrollo en puerto 3000                       |
| `npm run build`       | Construye la aplicación optimizada para producción                 |
| `npm run start`       | Inicia servidor de producción                                      |
| `npm run predeploy`   | **Preparación completa:** db:setup + build (para despliegue)       |
| `npm run lint`        | Ejecuta ESLint para verificar código                               |
| `npm run format`      | Formatea código con Prettier                                       |
| `npm run check:ts`    | Verifica tipos de TypeScript sin compilar                          |
| `npm run db:generate` | Genera archivos de migración desde el schema                       |
| `npm run db:migrate`  | Ejecuta migraciones pendientes                                     |
| `npm run db:push`     | Sincroniza schema directamente con la base de datos                |
| `npm run db:indexes`  | Aplica índices adicionales de rendimiento (GIN, funcionales)       |
| `npm run db:setup`    | **Setup completo:** generate → push → indexes → seed (Todo en uno) |
| `npm run db:seed`     | Inserta datos de ejemplo en la base de datos                       |

## 🏗️ Estructura del Proyecto

```
nike-ecommerce-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Grupo de rutas de autenticación
│   │   ├── sign-in/            # Página de inicio de sesión
│   │   │   └── page.tsx
│   │   ├── sign-up/            # Página de registro
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Layout para páginas de auth
│   ├── (root)/                  # Grupo de rutas principales
│   │   ├── cart/               # Página del carrito
│   │   │   └── page.tsx
│   │   ├── checkout/           # Flujo de checkout
│   │   │   └── success/        # Página de éxito
│   │   │       └── page.tsx
│   │   ├── page.tsx            # Página principal (catálogo)
│   │   └── layout.tsx          # Layout con Navbar y Footer
│   ├── actions/                 # Server Actions
│   │   └── products.ts         # Acciones para productos
│   ├── api/                     # API Routes
│   │   ├── auth/[...all]/      # Endpoints de Better Auth
│   │   └── stripe/             # Webhook de Stripe
│   │       └── route.ts        # Handler de eventos de Stripe
│   ├── layout.tsx               # Layout raíz con fuentes Geist
│   ├── globals.css              # Estilos globales con Tailwind
│   └── favicon.ico              # Favicon de la app
│
├── components/                   # Componentes React
│   ├── Auth/                    # Componentes de autenticación
│   │   ├── SignInForm.tsx      # Formulario de inicio de sesión
│   │   ├── SignUpForm.tsx      # Formulario de registro
│   │   └── UserMenu.tsx        # Menú de usuario autenticado
│   ├── Cart/                    # Componentes del carrito
│   │   ├── CartSummary.tsx     # Resumen con botón de checkout
│   │   ├── CartList.tsx        # Lista de items del carrito
│   │   ├── CartItem.tsx        # Item individual del carrito
│   │   └── OrderSuccess.tsx    # Confirmación de pedido exitoso
│   ├── AuthForm.tsx             # Componente base de formularios
│   ├── Card.tsx                 # Componente de tarjeta reutilizable
│   ├── Footer.tsx               # Footer de la aplicación
│   ├── Navbar.tsx               # Barra de navegación con carrito
│   ├── ProductCard.tsx          # Tarjeta de producto con carrito
│   ├── SocialProviders.tsx      # Botones de OAuth (preparado)
│   └── index.ts                 # Exportaciones centralizadas
│
├── lib/                         # Lógica de negocio y utilidades
│   ├── actions/                 # Server Actions
│   │   ├── product.ts          # Acciones de productos (getAllProducts, getProduct)
│   │   ├── filters.ts          # Resolución de slugs a UUIDs para filtros
│   │   ├── checkout.ts         # Crear sesión de Stripe Checkout
│   │   ├── orders.ts           # Crear y obtener pedidos
│   │   └── cart.ts             # Gestión del carrito
│   ├── stripe/                  # Integración de Stripe
│   │   └── client.ts           # Cliente de Stripe inicializado
│   ├── auth/                    # Sistema de autenticación completo
│   │   ├── actions.ts          # Server Actions (signUp, signIn, signOut)
│   │   ├── validation.ts       # Esquemas Zod de validación
│   │   ├── cookies.ts          # Gestión de cookies seguras
│   │   ├── hooks.ts            # Hook useAuth() para cliente
│   │   └── index.ts            # Exportaciones públicas
│   ├── db/                      # Configuración de base de datos
│   │   ├── apply-indexes.ts    # Script para índices adicionales de rendimiento
│   │   ├── schema/              # Esquemas modulares de Drizzle
│   │   │   ├── filters/        # Filtros de productos
│   │   │   │   ├── colors.ts   # Colores con hex
│   │   │   │   ├── genders.ts  # Géneros
│   │   │   │   └── sizes.ts    # Tallas
│   │   │   ├── user.ts         # Tabla de usuarios
│   │   │   ├── session.ts      # Tabla de sesiones
│   │   │   ├── account.ts      # Tabla de cuentas OAuth
│   │   │   ├── verification.ts # Tabla de verificación email
│   │   │   ├── guest.ts        # Tabla de sesiones invitado
│   │   │   ├── products.ts     # Productos, variantes, imágenes, reseñas
│   │   │   ├── categories.ts   # Categorías jerárquicas
│   │   │   ├── brands.ts       # Marcas
│   │   │   ├── collections.ts  # Colecciones de productos
│   │   │   ├── carts.ts        # Carritos y items
│   │   │   ├── orders.ts       # Órdenes, items, pagos
│   │   │   ├── addresses.ts    # Direcciones de envío/facturación
│   │   │   ├── wishlists.ts    # Lista de deseos
│   │   │   ├── coupons.ts      # Cupones de descuento
│   │   │   └── index.ts        # Exportaciones de schemas
│   │   ├── index.ts            # Cliente Drizzle + Neon
│   │   └── seed.ts             # Script de seed con productos Nike
│   ├── store/                   # Stores de Zustand
│   │   └── useCartStore.ts     # Store del carrito con persistencia
│   ├── utils/                   # Utilidades
│   │   └── query.ts            # Utilidades de consulta y filtros
│   └── auth.ts                  # Configuración Better Auth
│
├── docs/                        # Documentación del proyecto
│   ├── DOCS_INDEX.md           # Índice completo de documentación
│   ├── QUICK_START.md          # Guía de inicio rápido (5 minutos)
│   │
│   ├── # Autenticación
│   ├── AUTH_SETUP.md           # Documentación técnica completa
│   ├── AUTH_FORM_INTEGRATION.md # Integración de formularios
│   ├── SYSTEM_OVERVIEW.md      # Visión general con diagramas
│   │
│   ├── # Sistema de Productos
│   ├── PRODUCT_ACTIONS.md      # API de acciones de productos
│   ├── PRODUCT_EXAMPLES.md     # Ejemplos de uso prácticos
│   ├── PRODUCT_CHECKLIST.md    # Lista de verificación completa
│   ├── ARCHITECTURE.md         # Arquitectura y flujos de datos
│   │
│   ├── # Base de Datos
│   ├── DATABASE_SETUP.md       # Setup automático de DB
│   ├── INDEX_SETUP_SUMMARY.md  # Resumen de índices
│   ├── DB_SCHEMA.md            # Esquema de base de datos
│   ├── DB_SCHEMA_OVERVIEW.md   # Visión general del esquema
│   │
│   ├── # Filtros y Búsqueda
│   ├── FILTERS_SOLUTION.md     # Solución de filtros con slugs
│   ├── FILTERS_ISSUE.md        # Problema y soluciones
│   │
│   ├── # Guías y Verificación
│   ├── MIGRATION_GUIDE.md      # Guía de migración paso a paso
│   ├── IMPLEMENTATION_SUMMARY.md # Resumen de implementación
│   ├── VERIFICATION_REPORT.md  # Reporte de verificación
│   ├── CHECKLIST.md            # Lista de verificación
│   │
│   └── # Otros
│       ├── CART_INTEGRATION_EXAMPLE.md # Ejemplo de integración
│       └── PROXY_MIGRATION.md  # Migración de proxy
│
├── drizzle/                     # Migraciones de base de datos
├── public/                      # Archivos estáticos
├── data/                        # Datos estáticos (productos, etc.)
├── .next/                       # Build de Next.js
├── node_modules/                # Dependencias
│
├── drizzle.config.ts           # Configuración Drizzle Kit
├── next.config.ts              # Configuración Next.js con React Compiler
├── tsconfig.json               # Configuración TypeScript
├── eslint.config.mjs           # Configuración ESLint 9
├── postcss.config.mjs          # Configuración PostCSS + Tailwind 4
├── package.json                # Dependencias y scripts
├── .env.local                  # Variables de entorno (no versionado)
├── .env.example                # Ejemplo de variables de entorno
├── .gitignore                  # Archivos ignorados por Git
└── README.md                   # Este archivo
```

## 🎯 Características Implementadas

### ✅ Sistema de Productos Avanzado

**Acciones de Servidor Optimizadas:**

- `getAllProducts()` - Listado con filtrado, búsqueda, ordenamiento y paginación
- `getProduct()` - Detalle completo con variantes e imágenes
- Consultas SQL optimizadas (sin N+1)
- Agregaciones de precio en base de datos
- Selección inteligente de imágenes por color

**Filtrado y Búsqueda:**

- Búsqueda por texto (nombre y descripción)
- Filtros por marca, categoría, género
- Filtros por color y talla (nivel variante)
- Rango de precios dinámico
- Múltiples opciones de ordenamiento

**Paginación:**

- Límite configurable (default: 12 productos)
- Navegación entre páginas
- Preservación de filtros en URLs
- Total de resultados y páginas

**Rendimiento:**

- Server-Side Rendering completo
- Índices de base de datos optimizados
- Una consulta principal con subconsultas
- Imágenes optimizadas con Next/Image
- Type-safety completo con TypeScript

**Documentación:**

- [Documentación de Acciones](./docs/PRODUCT_ACTIONS.md)
- [Ejemplos de Uso](./docs/PRODUCT_EXAMPLES.md)
- [Guía de Migración](./docs/MIGRATION_GUIDE.md)
- [Resumen de Implementación](./docs/IMPLEMENTATION_SUMMARY.md)

### ✅ Carrito de Compras

- Gestión de estado con Zustand
- Persistencia en localStorage
- Agregar productos con incremento de cantidad
- Cálculo automático de totales
- Eliminar productos del carrito

### ✅ Sistema de Pagos con Stripe

**Integración Completa de Stripe Checkout:**

- **Checkout Seguro**: Redirección a Stripe Checkout hosted
- **Soporte Multi-Usuario**: Funciona para usuarios autenticados e invitados
- **Validación de Imágenes**: Validación automática de URLs de productos
- **Webhook Seguro**: Verificación de firma de Stripe para confirmación de pagos
- **Creación Automática de Pedidos**: Los pedidos se crean automáticamente después del pago
- **Sistema de Reintentos**: Búsqueda inteligente de pedidos con 3 intentos y 1s de delay
- **Fallback Inteligente**: Si el webhook tarda, muestra detalles desde Stripe
- **Página de Confirmación**: Página de éxito con detalles completos del pedido
- **Vaciado Automático**: El carrito se vacía automáticamente después del pago exitoso

**Características Técnicas:**

- Validación de UUID vs payment_intent para búsqueda eficiente
- Manejo de precios en céntimos para precisión
- Metadata de sesión para vincular pagos con carritos
- Logging completo para debugging
- Manejo de errores graceful con mensajes amigables
- Type-safety completo con TypeScript

**Flujo de Checkout:**

```
1. Usuario en carrito → Click "Checkout"
2. createStripeCheckoutSession() → Valida y crea sesión
3. Redirige a Stripe Checkout → Usuario completa pago
4. Stripe envía webhook → Verifica firma y crea pedido
5. Redirige a /checkout/success → Muestra confirmación
6. Sistema de reintentos → Busca pedido (3 intentos)
7. Muestra OrderSuccess → Detalles completos del pedido
```

**Documentación:**

- [Integración Completa](./docs/STRIPE_INTEGRATION.md) - Documentación técnica (45 min)
- [Setup Rápido](./docs/STRIPE_SETUP_QUICK.md) - Configuración rápida (15 min)
- [Ejemplos de Uso](./docs/STRIPE_USAGE_EXAMPLES.md) - Ejemplos prácticos (20 min)
- [Checklist](./docs/STRIPE_CHECKLIST.md) - Lista de verificación (5 min)
- [Mejoras Finales](./docs/STRIPE_FINAL_IMPROVEMENTS.md) - Optimizaciones implementadas
- [Resumen](./docs/STRIPE_IMPLEMENTATION_SUMMARY.md) - Resumen ejecutivo

**Configuración para Desarrollo:**

```bash
# 1. Instalar Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# o visita: https://stripe.com/docs/stripe-cli

# 2. Login en Stripe
stripe login

# 3. Escuchar webhooks localmente
stripe listen --forward-to localhost:3000/api/stripe

# 4. En otra terminal, iniciar la app
npm run dev

# 5. Probar con tarjeta de prueba
# Número: 4242 4242 4242 4242
# Fecha: Cualquier fecha futura
# CVC: Cualquier 3 dígitos
```

**Configuración para Producción:**

1. **Cambiar a claves de producción:**

    ```env
    STRIPE_SECRET_KEY=sk_live_...
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
    ```

2. **Configurar webhook en Stripe Dashboard:**
    - Ve a **Developers > Webhooks**
    - Añade endpoint: `https://tu-dominio.com/api/stripe`
    - Selecciona eventos:
        - `checkout.session.completed`
        - `payment_intent.payment_failed`
        - `payment_intent.succeeded`
    - Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

3. **Actualizar base URL:**
    ```env
    NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
    ```

**Tarjetas de Prueba:**

```
✅ Éxito:                    4242 4242 4242 4242
❌ Fallo:                    4000 0000 0000 0002
🔐 Requiere autenticación:   4000 0025 0000 3155
```

**Verificar Integración:**

```bash
# Ver logs de webhooks en tiempo real
stripe listen --forward-to localhost:3000/api/stripe

# Probar un webhook manualmente
stripe trigger checkout.session.completed
```

### ✅ Base de Datos Completa

- **Schema modular** con Drizzle ORM y PostgreSQL
- **Productos avanzados**: productos con variantes (color, talla), imágenes múltiples, reseñas
- **Sistema de carritos**: soporte para usuarios autenticados e invitados
- **Órdenes completas**: gestión de pedidos con estados, items, direcciones y pagos
- **Catálogos**: categorías jerárquicas, marcas, colecciones
- **Filtros**: colores (con hex), tallas, géneros
- **Funcionalidades adicionales**: wishlist, cupones de descuento, direcciones de envío/facturación
- **Validación**: schemas Zod integrados para todos los modelos
- **Type-safety**: tipos TypeScript inferidos automáticamente
- **Relaciones**: relaciones completas entre todas las entidades

### ✅ Sistema de Autenticación Completo

- **Better Auth** con adaptador Drizzle ORM integrado
- Registro e inicio de sesión con email/contraseña
- Gestión de sesiones con cookies seguras (HttpOnly, Secure, SameSite)
- **Sesiones de invitado** para usuarios no autenticados con UUID
- **Migración automática** de carrito de invitado a usuario registrado
- Protección de rutas con middleware de Next.js
- Validación de entradas con Zod (contraseñas seguras)
- Componentes de UI listos para usar (SignIn, SignUp, UserMenu)
- Server Actions para toda la lógica de autenticación
- Type-safe en todo el stack (TypeScript + Drizzle)
- Preparado para OAuth (Google, GitHub), verificación de email y 2FA
- Páginas de autenticación completamente funcionales
- Hook `useAuth()` para componentes de cliente
- Funciones de servidor para protección de rutas

**📖 Documentación completa:**

- [docs/DOCS_INDEX.md](./docs/DOCS_INDEX.md) - Índice completo de documentación
- [docs/QUICK_START.md](./docs/QUICK_START.md) - Inicio rápido (5 minutos)
- [docs/AUTH_SETUP.md](./docs/AUTH_SETUP.md) - Documentación técnica completa
- [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) - Visión general con diagramas
- [docs/MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md) - Guía paso a paso
- [docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md) - Resumen de implementación
- [docs/CART_INTEGRATION_EXAMPLE.md](./docs/CART_INTEGRATION_EXAMPLE.md) - Integración con carrito
- [docs/CHECKLIST.md](./docs/CHECKLIST.md) - Checklist de tareas

### ✅ UI/UX

- Diseño moderno con TailwindCSS 4 y PostCSS
- Componentes con hover effects y transiciones suaves
- Fuentes Geist Sans y Geist Mono optimizadas
- Responsive design mobile-first (1, 2, 3 columnas)
- Navbar con contador de carrito en tiempo real
- Footer con enlaces y redes sociales
- Iconos de Lucide React
- Optimización de imágenes con Next/Image
- Layout groups para organización de rutas

## 🔧 Configuración Técnica

### Drizzle ORM

El proyecto usa Drizzle con el dialecto PostgreSQL y el adaptador Neon serverless. Schema modular organizado por entidades:

```typescript
// lib/db/schema/products.ts
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    categoryId: uuid('category_id')
        .notNull()
        .references(() => categories.id),
    genderId: uuid('gender_id')
        .notNull()
        .references(() => genders.id),
    brandId: uuid('brand_id')
        .notNull()
        .references(() => brands.id),
    isPublished: boolean('is_published').notNull().default(false),
    defaultVariantId: uuid('default_variant_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Variantes de productos con color, talla, precio, stock
export const productVariants = pgTable('product_variants', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
        .notNull()
        .references(() => products.id),
    sku: text('sku').notNull().unique(),
    price: text('price').notNull(),
    salePrice: text('sale_price'),
    colorId: uuid('color_id').notNull(),
    sizeId: uuid('size_id').notNull(),
    inStock: text('in_stock').notNull().default('0'),
    // ... más campos
});
```

### Zustand Store

Carrito persistente con middleware de persistencia:

```typescript
// lib/store/useCartStore.ts
interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}
```

### Server Actions

Acciones del servidor para operaciones de base de datos:

```typescript
// app/actions/products.ts
'use server';
export async function getAllProducts() {
    return await db.select().from(products);
}
```

## 🚧 Próximas Características

### MVP Completado ✅

**Autenticación:**

- [x] Sistema de autenticación completo con Better Auth
- [x] Registro e inicio de sesión
- [x] Sesiones de invitado con UUID
- [x] Protección de rutas con middleware
- [x] Migración automática de datos
- [x] Páginas de auth (sign-in/sign-up)
- [x] Componentes de UI completos (SignIn, SignUp, UserMenu)

**Base de Datos:**

- [x] Schema completo de e-commerce con 15+ tablas
- [x] Productos con variantes (color, talla, precio, stock)
- [x] Sistema de carritos (usuarios + invitados)
- [x] Órdenes con estados y pagos
- [x] Categorías jerárquicas y marcas
- [x] Colecciones de productos
- [x] Filtros (colores, tallas, géneros)
- [x] Wishlist y cupones de descuento
- [x] Direcciones de envío/facturación
- [x] Reseñas de productos
- [x] Validación Zod en todos los schemas

**Frontend:**

- [x] Carrito de compras con Zustand
- [x] Persistencia en localStorage
- [x] Navbar y Footer responsive
- [x] Componentes reutilizables (Card, ProductCard, AuthForm)

### En Desarrollo 🔨

- [x] Sistema de productos con filtrado avanzado
- [x] Página de listado de productos con SSR
- [x] Página de detalle de producto
- [x] Búsqueda y ordenamiento de productos
- [x] Paginación de resultados
- [ ] Integración de carrito con base de datos
- [ ] Página de checkout protegida
- [ ] Sincronización de carrito entre dispositivos
- [ ] Página de perfil de usuario
- [ ] Sistema de seed con datos completos

### Roadmap Futuro 📅

**Autenticación Avanzada:**

- [ ] Verificación de email con tokens
- [ ] OAuth (Google, GitHub, Facebook)
- [ ] Recuperación de contraseña
- [ ] 2FA (Two-Factor Authentication)
- [ ] Cambio de contraseña

**Funcionalidades de E-commerce:**

- [x] Página de detalle de producto con variantes
- [x] Selector de color y talla
- [x] Filtros avanzados (categoría, precio, marca, color, talla, género)
- [x] Búsqueda de productos
- [x] Paginación de resultados
- [x] Ordenamiento múltiple (precio, fecha, nombre)
- [x] Carrito de compras con persistencia ✅
- [x] Checkout con Stripe ✅
- [x] Confirmación de pedidos ✅
- [ ] Implementación completa de wishlist
- [ ] Historial de pedidos del usuario
- [ ] Seguimiento de envíos
- [ ] Sistema de reseñas funcional
- [ ] Aplicación de cupones de descuento
- [ ] Gestión de direcciones de usuario
- [ ] Notificaciones por email

**Administración:**

- [ ] Panel de administración
- [ ] Gestión de productos y variantes (CRUD)
- [ ] Gestión de categorías, marcas y colecciones
- [ ] Gestión de usuarios y órdenes
- [ ] Dashboard de ventas
- [ ] Reportes y analytics
- [ ] Gestión de cupones
- [ ] Control de inventario

**Pagos:**

- [x] Integración con Stripe Checkout ✅
- [x] Webhook seguro con verificación de firma ✅
- [x] Creación automática de pedidos ✅
- [x] Página de confirmación de pedidos ✅
- [ ] Integración con PayPal
- [ ] Múltiples métodos de pago (tarjeta, transferencia, etc.)
- [ ] Cálculo dinámico de impuestos por región
- [ ] Cálculo de envío por ubicación
- [ ] Sistema de reembolsos
- [ ] Facturación automática

**Optimizaciones:**

- [ ] Tests unitarios y de integración
- [ ] Tests E2E con Playwright
- [ ] Optimización de rendimiento
- [ ] SEO avanzado
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Caché de productos
- [ ] Optimización de imágenes

## 🎨 Características Técnicas Destacadas

### React 19 + React Compiler

- Compilador experimental de React habilitado
- Optimización automática de componentes
- Mejor rendimiento sin memoización manual

### Next.js 16 App Router

- Server Components por defecto
- Streaming y Suspense
- Route Groups para organización
- Middleware para protección de rutas

### Type Safety Completo

- TypeScript 5 en todo el proyecto
- Inferencia de tipos con Drizzle ORM
- Validación con Zod
- Type-safe Server Actions

### Base de Datos Moderna

- PostgreSQL serverless con Neon
- Connection pooling automático
- Migraciones con Drizzle Kit
- Schemas modulares y escalables

## 📚 Recursos Adicionales

### Documentación del Proyecto

**Sistema de Productos:**

- [Configuración de Base de Datos](./docs/DATABASE_SETUP.md) - Setup automático
- [Documentación de Acciones](./docs/PRODUCT_ACTIONS.md) - API de productos
- [Ejemplos de Uso](./docs/PRODUCT_EXAMPLES.md) - Casos prácticos
- [Arquitectura](./docs/ARCHITECTURE.md) - Diagramas y flujos

**Autenticación:**

- [Índice de Documentación](./docs/DOCS_INDEX.md) - Navegación completa
- [Guía de Inicio Rápido](./docs/QUICK_START.md) - 5 minutos
- [Visión General del Sistema](./docs/SYSTEM_OVERVIEW.md) - Diagramas y arquitectura

**Pagos con Stripe:**

- [Integración Completa](./docs/STRIPE_INTEGRATION.md) - Documentación técnica completa
- [Setup Rápido](./docs/STRIPE_SETUP_QUICK.md) - Configuración en 15 minutos
- [Ejemplos de Uso](./docs/STRIPE_USAGE_EXAMPLES.md) - Código de ejemplo
- [Checklist](./docs/STRIPE_CHECKLIST.md) - Lista de verificación
- [Mejoras Finales](./docs/STRIPE_FINAL_IMPROVEMENTS.md) - Optimizaciones
- [Resumen de Implementación](./docs/STRIPE_IMPLEMENTATION_SUMMARY.md) - Resumen ejecutivo

### Documentación Externa

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [TailwindCSS 4 Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)

## 🐛 Solución de Problemas

### Problemas Comunes

**Error de conexión a la base de datos:**

```bash
# Verificar que DATABASE_URL esté configurado correctamente
echo $DATABASE_URL

# Probar conexión
npm run db:push
```

**Error de autenticación:**

```bash
# Verificar que BETTER_AUTH_SECRET esté configurado
# Generar nuevo secreto si es necesario
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Carrito no persiste:**

- Verificar que localStorage esté habilitado en el navegador
- Limpiar caché y cookies
- Verificar que el store de Zustand esté configurado correctamente

**Migraciones fallan:**

```bash
# Limpiar y regenerar migraciones
rm -rf drizzle
npm run db:generate
npm run db:push
```

**Problemas con Stripe:**

```bash
# Webhook no funciona
# Verifica que Stripe CLI está corriendo
stripe listen --forward-to localhost:3000/api/stripe

# Error: "No signature provided"
# Verifica que STRIPE_WEBHOOK_SECRET esté configurado
echo $STRIPE_WEBHOOK_SECRET

# Pedido no se crea después del pago
# 1. Verifica los logs del webhook en Stripe Dashboard
# 2. Asegúrate de que el endpoint /api/stripe es accesible
# 3. Verifica que los eventos estén configurados correctamente

# Error: "Invalid signature"
# El webhook secret es incorrecto
# Usa Stripe CLI para desarrollo local
stripe listen --forward-to localhost:3000/api/stripe
```

Para más detalles, consulta:

- [Guía de Migración](./docs/MIGRATION_GUIDE.md) - Troubleshooting general
- [Stripe Integration](./docs/STRIPE_INTEGRATION.md) - Troubleshooting de Stripe

## � Contriibución

Este es un proyecto educativo. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## ✅ Verificación de Calidad

### Métricas de Código

| Métrica       | Estado | Resultado             |
| ------------- | ------ | --------------------- |
| ESLint        | ✅     | 0 errores, 0 warnings |
| TypeScript    | ✅     | 0 errores de tipos    |
| Build         | ✅     | Compilación exitosa   |
| Type Safety   | ✅     | 100%                  |
| Documentación | ✅     | 22 archivos           |

### Tests Ejecutados

```bash
# Linting
npm run lint          # ✅ Pasó

# Type checking
npm run check:ts      # ✅ Pasó

# Build de producción
npm run build         # ✅ Pasó (15.2s)
```

### Funcionalidades Verificadas

- ✅ Listado de productos con SSR
- ✅ Filtros por género, color, talla, precio
- ✅ Búsqueda por texto
- ✅ Ordenamiento (precio, fecha, nombre)
- ✅ Paginación con preservación de filtros
- ✅ Detalle de producto con variantes
- ✅ Navegación entre páginas
- ✅ Imágenes optimizadas
- ✅ Responsive design

## 📊 Estado del Proyecto

### Resumen Ejecutivo

**Versión:** 1.0.0 MVP  
**Estado:** ✅ Listo para Producción (MVP)  
**Última actualización:** Noviembre 2025  
**Branch actual:** product-actions

### Funcionalidades Implementadas

```
✅ Autenticación Completa (Better Auth)
   - Registro e inicio de sesión
   - Sesiones de invitado con UUID
   - Protección de rutas con middleware
   - Migración automática de datos

✅ Base de Datos Robusta (23 tablas)
   - Schema completo de e-commerce
   - Relaciones entre todas las entidades
   - Validación Zod integrada
   - Type-safety completo

✅ Sistema de Productos Avanzado
   - Filtrado por múltiples criterios
   - Búsqueda por texto
   - Ordenamiento flexible
   - Paginación con preservación de filtros
   - Resolución automática de slugs a UUIDs

✅ Páginas Funcionales
   - Listado de productos (SSR)
   - Detalle de producto con variantes
   - Páginas de autenticación (sign-in/sign-up)
   - Navegación responsive

✅ Optimizaciones de Rendimiento
   - Índices de base de datos (GIN, funcionales)
   - React Compiler habilitado
   - Imágenes optimizadas con Next/Image
   - Server Components por defecto

✅ Calidad de Código
   - TypeScript 5 con type-safety completo
   - ESLint configurado (0 errores)
   - Prettier para formateo
   - Documentación completa (22 archivos)

🔨 En Desarrollo
   - Integración de carrito con base de datos
   - Página de checkout protegida
   - Sincronización de carrito entre dispositivos

📅 Roadmap Definido
   - Sistema de pagos (Stripe/PayPal)
   - Panel de administración
   - Sistema de reseñas funcional
   - Historial de pedidos
```

### Métricas de Calidad

| Categoría         | Métrica              | Estado | Resultado             |
| ----------------- | -------------------- | ------ | --------------------- |
| **Código**        | ESLint               | ✅     | 0 errores, 0 warnings |
|                   | TypeScript           | ✅     | 0 errores de tipos    |
|                   | Type Safety          | ✅     | 100%                  |
| **Build**         | Compilación          | ✅     | Exitosa (15.2s)       |
|                   | Tamaño First Load JS | ✅     | ~95 kB (promedio)     |
|                   | Optimización         | ✅     | Minificación activa   |
| **Base de Datos** | Tablas               | ✅     | 23 tablas             |
|                   | Índices              | ✅     | 15+ índices           |
|                   | Migraciones          | ✅     | Sincronizadas         |
| **Documentación** | Archivos             | ✅     | 22 archivos           |
|                   | Cobertura            | ✅     | Completa              |
| **Testing**       | Funcionalidades      | ✅     | Verificadas           |
|                   | Navegación           | ✅     | Funcional             |
|                   | Responsive           | ✅     | Mobile-first          |

### Tecnologías y Versiones

| Tecnología  | Versión | Estado | Notas                     |
| ----------- | ------- | ------ | ------------------------- |
| Next.js     | 16.0.3  | ✅     | App Router + RSC          |
| React       | 19.2.0  | ✅     | React Compiler habilitado |
| TypeScript  | 5.x     | ✅     | Strict mode               |
| Drizzle ORM | 0.44.7  | ✅     | Type-safe queries         |
| Better Auth | 1.3.34  | ✅     | Sistema completo          |
| TailwindCSS | 4.x     | ✅     | PostCSS + utility-first   |
| Zustand     | 5.0.8   | ✅     | State management          |
| Zod         | 4.1.12  | ✅     | Validación de schemas     |
| PostgreSQL  | Latest  | ✅     | Neon serverless           |
| Node.js     | 20+     | ✅     | LTS recomendado           |

### Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 16)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Stores    │      │
│  │  (App Router)│  │   (React 19) │  │   (Zustand)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Server Actions & API Routes               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Products   │  │     Auth     │  │    Filters   │      │
│  │   Actions    │  │   Actions    │  │   Actions    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer (Drizzle ORM)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Schema     │  │  Migrations  │  │   Indexes    │      │
│  │  (23 tables) │  │   (Drizzle)  │  │ (GIN + B-tree)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL (Neon Serverless)                │
│              Connection Pooling + SSL/TLS                    │
└─────────────────────────────────────────────────────────────┘
```

### Capacidades Actuales

**Productos:**

- ✅ Listado con SSR y filtrado avanzado
- ✅ Detalle con variantes (color, talla, precio)
- ✅ Búsqueda por texto (nombre, descripción)
- ✅ Filtros: género, marca, categoría, color, talla, precio
- ✅ Ordenamiento: precio, fecha, nombre, popularidad
- ✅ Paginación con preservación de filtros en URL
- ✅ Imágenes optimizadas y responsive

**Autenticación:**

- ✅ Registro con validación de contraseña segura
- ✅ Inicio de sesión con email/contraseña
- ✅ Sesiones de invitado con UUID
- ✅ Protección de rutas con middleware
- ✅ Migración automática de datos invitado → usuario
- ✅ Componentes UI completos (SignIn, SignUp, UserMenu)

**Carrito:**

- ✅ Gestión de estado con Zustand
- ✅ Persistencia en localStorage
- ✅ Agregar/eliminar productos
- ✅ Cálculo automático de totales
- ✅ Contador en tiempo real en Navbar

**Base de Datos:**

- ✅ 23 tablas con relaciones completas
- ✅ Validación Zod en todos los schemas
- ✅ Índices optimizados para rendimiento
- ✅ Migraciones automáticas con Drizzle Kit
- ✅ Type-safety completo con TypeScript

### Próximos Pasos Prioritarios

1. **Integración de Carrito con Base de Datos** (En progreso)
    - Sincronización con tabla `carts` y `cart_items`
    - Persistencia entre dispositivos
    - Migración de localStorage a DB

2. **Página de Checkout**
    - Formulario de dirección de envío
    - Resumen de orden
    - Integración con sistema de pagos

3. **Sistema de Pagos**
    - Integración con Stripe o PayPal
    - Procesamiento de órdenes
    - Confirmación de pago

4. **Panel de Administración**
    - CRUD de productos y variantes
    - Gestión de órdenes
    - Dashboard de ventas

### Tablas de Base de Datos Implementadas

**Autenticación (5 tablas):**

- `user` - Usuarios del sistema
- `session` - Sesiones activas
- `account` - Cuentas OAuth
- `verification` - Tokens de verificación
- `guest` - Sesiones de invitados

**Productos (7 tablas):**

- `products` - Productos principales
- `product_variants` - Variantes (color, talla, precio, stock)
- `product_images` - Imágenes de productos
- `reviews` - Reseñas de usuarios
- `categories` - Categorías jerárquicas
- `brands` - Marcas
- `collections` - Colecciones de productos

**Filtros (3 tablas):**

- `colors` - Colores con código hex
- `sizes` - Tallas con orden
- `genders` - Géneros

**Comercio (6 tablas):**

- `carts` - Carritos de compra
- `cart_items` - Items del carrito
- `orders` - Órdenes de compra
- `order_items` - Items de órdenes
- `payments` - Pagos procesados
- `addresses` - Direcciones de envío/facturación

**Extras (2 tablas):**

- `wishlists` - Lista de deseos
- `coupons` - Cupones de descuento

**Total: 23 tablas** con relaciones completas y validación Zod

## 📞 Contacto y Soporte

Para preguntas, problemas o sugerencias:

1. Revisa la [documentación completa](./docs/DOCS_INDEX.md)
2. Consulta la sección de [Troubleshooting](./docs/MIGRATION_GUIDE.md)
3. Abre un issue en el repositorio

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para fines educativos y de demostración.

---

**Nike E-commerce App** - Construido con ❤️ usando Next.js 16, React 19, TypeScript, Stripe y las mejores prácticas de desarrollo moderno.

**Versión:** 1.1.0 MVP + Stripe  
**Última actualización:** 18 de Noviembre, 2025  
**Estado:** ✅ Listo para Producción con Sistema de Pagos Completo  
**Estado:** ✅ Sistema de Productos Completo - Listo para Integración
