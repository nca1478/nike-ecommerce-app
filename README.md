# Nike Store - E-commerce App

Una aplicación de e-commerce moderna y completa construida con Next.js 16, TypeScript y las mejores tecnologías del ecosistema React. Incluye sistema de autenticación completo con Better Auth, base de datos PostgreSQL con Drizzle ORM, carrito de compras persistente, y un schema de base de datos robusto listo para producción con productos, variantes, órdenes, pagos, cupones, colecciones y más.

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

## 📦 Instalación y Configuración

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
```

**Generar un secreto seguro:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Configurar Base de Datos

```bash
# Aplicar el schema a la base de datos
npm run db:push

# Insertar productos de ejemplo (6 productos Nike)
npm run db:seed
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

## 📝 Scripts Disponibles

| Script                | Descripción                                         |
| --------------------- | --------------------------------------------------- |
| `npm run dev`         | Inicia servidor de desarrollo en puerto 3000        |
| `npm run build`       | Construye la aplicación optimizada para producción  |
| `npm run start`       | Inicia servidor de producción                       |
| `npm run lint`        | Ejecuta ESLint para verificar código                |
| `npm run db:generate` | Genera archivos de migración desde el schema        |
| `npm run db:migrate`  | Ejecuta migraciones pendientes                      |
| `npm run db:push`     | Sincroniza schema directamente con la base de datos |
| `npm run db:seed`     | Inserta datos de ejemplo en la base de datos        |

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
│   │   ├── page.tsx            # Página principal (catálogo)
│   │   └── layout.tsx          # Layout con Navbar y Footer
│   ├── actions/                 # Server Actions
│   │   └── products.ts         # Acciones para productos
│   ├── api/                     # API Routes
│   │   └── auth/[...all]/      # Endpoints de Better Auth
│   ├── layout.tsx               # Layout raíz con fuentes Geist
│   ├── globals.css              # Estilos globales con Tailwind
│   └── favicon.ico              # Favicon de la app
│
├── components/                   # Componentes React
│   ├── auth/                    # Componentes de autenticación
│   │   ├── SignInForm.tsx      # Formulario de inicio de sesión
│   │   ├── SignUpForm.tsx      # Formulario de registro
│   │   └── UserMenu.tsx        # Menú de usuario autenticado
│   ├── AuthForm.tsx             # Componente base de formularios
│   ├── Card.tsx                 # Componente de tarjeta reutilizable
│   ├── Footer.tsx               # Footer de la aplicación
│   ├── Navbar.tsx               # Barra de navegación con carrito
│   ├── ProductCard.tsx          # Tarjeta de producto con carrito
│   ├── SocialProviders.tsx      # Botones de OAuth (preparado)
│   └── index.ts                 # Exportaciones centralizadas
│
├── lib/                         # Lógica de negocio y utilidades
│   ├── auth/                    # Sistema de autenticación completo
│   │   ├── actions.ts          # Server Actions (signUp, signIn, signOut)
│   │   ├── validation.ts       # Esquemas Zod de validación
│   │   ├── cookies.ts          # Gestión de cookies seguras
│   │   ├── hooks.ts            # Hook useAuth() para cliente
│   │   └── index.ts            # Exportaciones públicas
│   ├── db/                      # Configuración de base de datos
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
│   └── auth.ts                  # Configuración Better Auth
│
├── docs/                        # Documentación del proyecto
│   ├── AUTH_SETUP.md           # Documentación técnica completa
│   ├── QUICK_START.md          # Guía de inicio rápido
│   ├── MIGRATION_GUIDE.md      # Guía de migración paso a paso
│   ├── SYSTEM_OVERVIEW.md      # Visión general con diagramas
│   ├── IMPLEMENTATION_SUMMARY.md # Resumen de implementación
│   ├── CART_INTEGRATION_EXAMPLE.md # Ejemplo de integración
│   ├── AUTH_FORM_INTEGRATION.md # Integración de formularios
│   ├── PROXY_MIGRATION.md      # Migración de proxy
│   ├── CHECKLIST.md            # Lista de verificación
│   └── DOCS_INDEX.md           # Índice de documentación
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

### ✅ Catálogo de Productos

- Listado de productos desde PostgreSQL usando Server Components
- Renderizado del lado del servidor para mejor SEO
- Grid responsive (1 columna móvil, 2 tablet, 3 desktop)
- Imágenes optimizadas con Next/Image

### ✅ Carrito de Compras

- Gestión de estado con Zustand
- Persistencia en localStorage
- Agregar productos con incremento de cantidad
- Cálculo automático de totales
- Eliminar productos del carrito

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

- [ ] Página de catálogo con productos reales
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

- [ ] Página de detalle de producto con variantes
- [ ] Selector de color y talla
- [ ] Filtros avanzados (categoría, precio, marca, color, talla, género)
- [ ] Búsqueda de productos
- [ ] Implementación completa de wishlist
- [ ] Historial de pedidos
- [ ] Seguimiento de envíos
- [ ] Sistema de reseñas funcional
- [ ] Aplicación de cupones de descuento
- [ ] Gestión de direcciones de usuario

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

- [ ] Integración con Stripe/PayPal
- [ ] Múltiples métodos de pago
- [ ] Cálculo de impuestos y envío
- [ ] Procesamiento de órdenes

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

- [Índice de Documentación](./docs/DOCS_INDEX.md) - Navegación completa
- [Guía de Inicio Rápido](./docs/QUICK_START.md) - 5 minutos
- [Visión General del Sistema](./docs/SYSTEM_OVERVIEW.md) - Diagramas y arquitectura

### Documentación Externa

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Better Auth Documentation](https://better-auth.com)
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

Para más detalles, consulta la [Guía de Migración](./docs/MIGRATION_GUIDE.md) sección Troubleshooting.

## � Contriibución

Este es un proyecto educativo. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📊 Estado del Proyecto

```
✅ Autenticación Completa (Better Auth)
✅ Base de Datos Robusta (15+ tablas)
✅ Schema de E-commerce Completo
🔨 Frontend en Desarrollo
🔨 Integración de Funcionalidades
📅 Roadmap Definido
📚 Documentación Completa
🎯 Arquitectura Lista para Escalar
```

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

**Nike E-commerce App** - Construido con ❤️ usando Next.js 16, React 19, TypeScript y las mejores prácticas de desarrollo moderno.

**Versión:** 1.0.0 MVP  
**Última actualización:** Noviembre 2025  
**Branch actual:** database-schemas  
**Estado:** 🔨 En Desarrollo Activo - Base de Datos Completa
