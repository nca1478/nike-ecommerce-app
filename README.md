# Nike Store - E-commerce App

Una aplicación de e-commerce moderna construida con Next.js 16, TypeScript y las mejores tecnologías del ecosistema React. Incluye catálogo de productos, carrito de compras persistente y autenticación.

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

- **Zustand 5.0.8** - Gestión de estado global con persistencia
- **Better Auth 1.3.34** - Sistema de autenticación con adaptador Drizzle

### Herramientas de Desarrollo

- **ESLint 9** - Linting con configuración Next.js
- **TSX** - Ejecución de TypeScript para scripts
- **dotenv-cli** - Gestión de variables de entorno

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
│   ├── actions/                  # Server Actions
│   │   └── products.ts          # Acciones para productos
│   ├── api/                     # API Routes
│   │   └── auth/[...all]/       # Endpoints de Better Auth
│   ├── layout.tsx               # Layout raíz con fuentes Geist
│   ├── page.tsx                 # Página principal (catálogo)
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes React
│   ├── auth/                    # Componentes de autenticación
│   │   ├── SignInForm.tsx      # Formulario de inicio de sesión
│   │   ├── SignUpForm.tsx      # Formulario de registro
│   │   └── UserMenu.tsx        # Menú de usuario
│   └── ProductCard.tsx          # Tarjeta de producto con carrito
│
├── lib/                         # Lógica de negocio y utilidades
│   ├── auth/                    # Sistema de autenticación
│   │   ├── actions.ts          # Server Actions (signUp, signIn, etc.)
│   │   ├── validation.ts       # Esquemas Zod de validación
│   │   ├── cookies.ts          # Gestión de cookies
│   │   ├── hooks.ts            # Hook useAuth()
│   │   └── index.ts            # Exportaciones
│   ├── db/                      # Configuración de base de datos
│   │   ├── schema/              # Esquemas modulares
│   │   │   ├── user.ts         # Tabla de usuarios
│   │   │   ├── session.ts      # Tabla de sesiones
│   │   │   ├── account.ts      # Tabla de cuentas
│   │   │   ├── verification.ts # Tabla de verificación
│   │   │   ├── guest.ts        # Tabla de invitados
│   │   │   └── index.ts        # Exportaciones
│   │   ├── index.ts            # Cliente Drizzle + Neon
│   │   ├── schema.ts           # Schema principal
│   │   └── seed.ts             # Script de seed
│   ├── store/                   # Stores de Zustand
│   │   └── useCartStore.ts     # Store del carrito
│   └── auth.ts                  # Configuración Better Auth
│
├── public/                      # Archivos estáticos
├── middleware.ts                # Middleware de protección de rutas
├── drizzle.config.ts           # Configuración Drizzle Kit
├── next.config.ts              # Configuración Next.js
├── tsconfig.json               # Configuración TypeScript
├── eslint.config.mjs           # Configuración ESLint
├── postcss.config.mjs          # Configuración PostCSS
├── package.json                # Dependencias y scripts
├── .env.local                  # Variables de entorno
│
├── README.md                   # Este archivo
├── QUICK_START.md              # Inicio rápido (5 min)
├── AUTH_SETUP.md               # Documentación técnica
├── MIGRATION_GUIDE.md          # Guía de implementación
├── IMPLEMENTATION_SUMMARY.md   # Resumen de archivos
├── CART_INTEGRATION_EXAMPLE.md # Integración con carrito
└── CHECKLIST.md                # Checklist de tareas
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

### ✅ Base de Datos

- Schema de productos con Drizzle ORM
- Campos: id, name, description, price, image, category, createdAt
- Tipos TypeScript inferidos automáticamente
- Seed con 6 productos Nike de ejemplo

### ✅ Sistema de Autenticación Completo

- **Better Auth** con adaptador Drizzle ORM
- Registro e inicio de sesión con email/contraseña
- Gestión de sesiones con cookies seguras (HttpOnly, Secure, SameSite)
- **Sesiones de invitado** para usuarios no autenticados
- **Migración automática** de carrito de invitado a usuario
- Protección de rutas con middleware
- Validación de entradas con Zod
- Componentes de UI listos para usar (SignIn, SignUp, UserMenu)
- Server Actions para toda la lógica de autenticación
- Type-safe en todo el stack
- Preparado para OAuth, verificación de email y 2FA

**📖 Documentación completa:**

- [QUICK_START.md](./QUICK_START.md) - Inicio rápido (5 minutos)
- [AUTH_SETUP.md](./AUTH_SETUP.md) - Documentación técnica completa
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guía paso a paso
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Resumen de implementación
- [CHECKLIST.md](./CHECKLIST.md) - Checklist de tareas

### ✅ UI/UX

- Diseño moderno con TailwindCSS 4
- Componentes con hover effects y transiciones
- Fuentes Geist Sans y Geist Mono
- Responsive design mobile-first

## 🔧 Configuración Técnica

### Drizzle ORM

El proyecto usa Drizzle con el dialecto PostgreSQL y el adaptador Neon serverless:

```typescript
// lib/db/schema.ts
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
"use server";
export async function getAllProducts() {
  return await db.select().from(products);
}
```

## 🚧 Próximas Características

### MVP Completado ✅

- [x] Sistema de autenticación completo
- [x] Registro e inicio de sesión
- [x] Sesiones de invitado
- [x] Protección de rutas
- [x] Migración de datos

### En Desarrollo

- [ ] Páginas de auth (signin/signup)
- [ ] Integración de carrito con BD
- [ ] Página de checkout protegida

### Roadmap Futuro

- [ ] Verificación de email
- [ ] OAuth (Google, GitHub)
- [ ] Recuperación de contraseña
- [ ] 2FA (Two-Factor Auth)
- [ ] Página de detalle de producto
- [ ] Filtros por categoría y precio
- [ ] Búsqueda de productos
- [ ] Sistema de favoritos
- [ ] Historial de pedidos
- [ ] Panel de administración
- [ ] Integración con pasarela de pago

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Drizzle ORM](https://orm.drizzle.team)
- [Documentación de Neon](https://neon.tech/docs)
- [Documentación de Better Auth](https://better-auth.com)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs)
- [Guía de configuración detallada](./SETUP.md)

## 🐛 Solución de Problemas

Ver [SETUP.md](./SETUP.md) para guía detallada de solución de problemas.

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para fines educativos.
