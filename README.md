# Nike Store - Next.js E-commerce

Una aplicación de e-commerce moderna construida con Next.js, TypeScript, y las mejores tecnologías del ecosistema.

## 🚀 Tecnologías

- **Next.js 16** - Framework de React
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos utility-first
- **Drizzle ORM** - ORM type-safe
- **Neon PostgreSQL** - Base de datos serverless
- **Better Auth** - Autenticación
- **Zustand** - Gestión de estado
- **ESLint** - Linting

## 📦 Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno en `.env.local`:

```env
DATABASE_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

4. Genera y ejecuta las migraciones:

```bash
npm run db:push
```

5. Seed de la base de datos:

```bash
npm run db:seed
```

6. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run db:generate` - Genera migraciones
- `npm run db:push` - Aplica cambios al schema
- `npm run db:seed` - Seed de datos de ejemplo

## 🏗️ Estructura del Proyecto

```
nike-store/
├── app/              # App Router de Next.js
├── lib/
│   ├── db/          # Configuración de base de datos y schemas
│   ├── store/       # Stores de Zustand
│   └── auth.ts      # Configuración de Better Auth
├── public/          # Archivos estáticos
└── drizzle.config.ts # Configuración de Drizzle
```

## 🎯 Características

- ✅ Listado de productos desde PostgreSQL
- ✅ Diseño responsive con TailwindCSS
- ✅ Gestión de estado con Zustand
- ✅ ORM type-safe con Drizzle
- ✅ Autenticación con Better Auth
- ✅ TypeScript en todo el proyecto
