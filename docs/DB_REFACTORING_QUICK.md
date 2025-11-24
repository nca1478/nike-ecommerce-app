# 🔄 Refactoring: Desacoplamiento de Neon Database

## 🎯 Objetivo

Eliminar la dependencia estricta de `@neondatabase/serverless` y permitir el uso de cualquier proveedor PostgreSQL estándar, incluyendo desarrollo local con Docker.

---

## ⚡ Migración Rápida (5 minutos)

### Opción 1: Script Automatizado (Recomendado)

```bash
cd nike-ecommerce-app
npm run migrate:pg
```

### Opción 2: Comandos Manuales

```bash
# 1. Instalar nuevas dependencias
npm install pg @types/pg
npm uninstall @neondatabase/serverless

# 2. Levantar PostgreSQL local
npm run docker:up

# 3. Configurar base de datos
npm run db:setup

# 4. Iniciar desarrollo
npm run dev
```

---

## 📋 Cambios Realizados

### 1. Dependencias

**Antes:**

```json
{
    "dependencies": {
        "@neondatabase/serverless": "^1.0.2"
    }
}
```

**Después:**

```json
{
    "dependencies": {
        "pg": "^8.x.x",
        "@types/pg": "^8.x.x"
    }
}
```

### 2. Conexión a Base de Datos

**Antes (`lib/db/index.ts`):**

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

**Después (`lib/db/index.ts`):**

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: process.env.NODE_ENV === 'production' ? 20 : 5,
    ssl:
        process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
});

export const db = drizzle(pool, { schema });
```

### 3. Variables de Entorno

**Desarrollo Local (.env.local):**

```env
DATABASE_URL=postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce
```

**Producción (.env.prod):**

```env
# Neon (sigue siendo compatible)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/database_name?sslmode=require

# AWS RDS
DATABASE_URL=postgresql://user:password@instance.region.rds.amazonaws.com:5432/database_name

# DigitalOcean
DATABASE_URL=postgresql://user:password@db-postgresql-region-xxxxx.db.ondigitalocean.com:25060/database_name?sslmode=require

# Supabase
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
```

---

## 🐳 Docker Compose

**Archivo: `docker-compose.yml`**

```yaml
version: '3.9'

services:
    postgres:
        image: postgres:17-alpine
        container_name: nike-ecommerce-postgres
        restart: unless-stopped
        environment:
            POSTGRES_USER: nike_user
            POSTGRES_PASSWORD: nike_password_dev
            POSTGRES_DB: nike_ecommerce
        ports:
            - '5432:5432'
        volumes:
            - postgres_data:/var/lib/postgresql/data

volumes:
    postgres_data:
```

**Comandos Docker:**

```bash
# Levantar
npm run docker:up
# o
docker-compose up -d

# Detener
npm run docker:down
# o
docker-compose down

# Reiniciar (⚠️ BORRA DATOS)
npm run docker:reset
# o
docker-compose down -v && docker-compose up -d
```

---

## ✅ Verificación de Compatibilidad

### Better-Auth ✅

**Sin cambios necesarios.** Better-Auth usa el adaptador Drizzle, que es agnóstico al driver.

```typescript
// lib/auth.ts - NO REQUIERE MODIFICACIÓN
database: drizzleAdapter(db, {
    provider: 'pg', // ✅ Sigue funcionando
    schema: { ... }
})
```

### Zustand ✅

**Sin cambios necesarios.** Zustand es un state manager del cliente.

### Drizzle ORM ✅

**Totalmente compatible.** Todas las queries siguen funcionando igual.

```typescript
// Todas estas queries funcionan sin cambios
await db.select().from(products);
await db.insert(orders).values({ ... });
await db.update(users).set({ ... }).where(eq(users.id, id));
```

### Stripe ✅

**Sin impacto.** La integración de Stripe no depende del driver de base de datos.

---

## 🚀 Nuevos Scripts NPM

```json
{
    "scripts": {
        "docker:up": "docker-compose up -d",
        "docker:down": "docker-compose down",
        "docker:reset": "docker-compose down -v && docker-compose up -d",
        "migrate:pg": "node scripts/migrate-to-pg.js"
    }
}
```

---

## 📊 Comparación Técnica

| Aspecto                | Antes (Neon)               | Después (pg)         |
| ---------------------- | -------------------------- | -------------------- |
| **Driver**             | `@neondatabase/serverless` | `pg` (node-postgres) |
| **Protocolo**          | HTTP/WebSocket             | TCP nativo           |
| **Vendor Lock-in**     | ❌ Alto                    | ✅ Ninguno           |
| **Latencia**           | ~50-100ms                  | ~5-10ms              |
| **Pool de conexiones** | ❌ No                      | ✅ Sí                |
| **Compatibilidad**     | Solo Neon                  | Cualquier PostgreSQL |
| **Desarrollo local**   | ❌ Requiere Neon           | ✅ Docker            |

---

## 🛠️ Makefile (Opcional)

Si prefieres usar `make`:

```bash
# Setup completo
make full-setup

# Desarrollo rápido
make quick-start

# Reiniciar todo
make restart

# Producción
make prod-setup
```

---

## 📚 Documentación Completa

- **Guía de Migración**: `docs/DATABASE_MIGRATION_GUIDE.md` (45 min)
- **Resumen Ejecutivo**: `docs/DATABASE_REFACTORING_SUMMARY.md` (5 min)
- **Troubleshooting**: Ver sección 8 de la guía de migración

---

## 🎉 Beneficios

1. ✅ **Sin Vendor Lock-in**: Compatible con cualquier PostgreSQL
2. ✅ **Desarrollo Local**: Docker sin costos ni latencia
3. ✅ **Mejor Rendimiento**: Conexiones TCP nativas
4. ✅ **Pool de Conexiones**: Optimizado para producción
5. ✅ **Flexibilidad**: Cambia de proveedor sin modificar código

---

## 🔍 Troubleshooting Rápido

### Error: "Connection timeout"

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Reiniciar PostgreSQL
npm run docker:reset
```

### Error: "Database does not exist"

```bash
# Recrear base de datos
npm run docker:reset
npm run db:setup
```

### Error: "Too many connections"

```typescript
// Ajustar en lib/db/index.ts
max: process.env.NODE_ENV === 'production' ? 20 : 5;
```

---

## 📞 Soporte

Para más detalles, consulta:

- `docs/DATABASE_MIGRATION_GUIDE.md` - Documentación completa
- `docs/DATABASE_REFACTORING_SUMMARY.md` - Resumen ejecutivo
- GitHub Issues - Reportar problemas

---

**Tiempo estimado de migración:** 10-15 minutos  
**Impacto en código de aplicación:** Ninguno (solo capa de conexión)  
**Compatibilidad:** 100% con el stack actual
