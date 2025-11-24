# 🌐 Guía de Proveedores PostgreSQL

Esta guía detalla cómo configurar tu aplicación Nike E-commerce con diferentes proveedores de PostgreSQL.

---

## 📋 Tabla de Contenidos

1. [Desarrollo Local (Docker)](#desarrollo-local-docker)
2. [Neon](#neon)
3. [AWS RDS](#aws-rds)
4. [DigitalOcean Managed Database](#digitalocean-managed-database)
5. [Supabase](#supabase)
6. [Railway](#railway)
7. [Render](#render)
8. [Heroku Postgres](#heroku-postgres)
9. [Azure Database for PostgreSQL](#azure-database-for-postgresql)
10. [Google Cloud SQL](#google-cloud-sql)

---

## 🐳 Desarrollo Local (Docker)

### Configuración

```yaml
# docker-compose.yml (ya incluido)
version: '3.9'
services:
    postgres:
        image: postgres:17-alpine
        ports:
            - '5432:5432'
        environment:
            POSTGRES_USER: nike_user
            POSTGRES_PASSWORD: nike_password_dev
            POSTGRES_DB: nike_ecommerce
```

### Variables de Entorno

```env
DATABASE_URL=postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce
```

### Comandos

```bash
# Levantar
docker-compose up -d

# Detener
docker-compose down

# Reiniciar (borra datos)
docker-compose down -v && docker-compose up -d
```

### Ventajas

- ✅ Gratis
- ✅ Sin latencia de red
- ✅ Control total
- ✅ Datos locales

### Desventajas

- ❌ Requiere Docker instalado
- ❌ No disponible en producción

---

## ☁️ Neon

### Crear Base de Datos

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta
3. Crea un nuevo proyecto
4. Copia la connection string

### Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Configuración Especial

```typescript
// lib/db/index.ts - Ya configurado automáticamente
ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false;
```

### Ventajas

- ✅ Serverless (escala a 0)
- ✅ Branching de base de datos
- ✅ Generoso free tier
- ✅ Muy rápido

### Desventajas

- ❌ Límites en free tier
- ❌ Vendor lock-in (antes del refactoring)

### Pricing

- **Free**: 0.5 GB storage, 1 proyecto
- **Pro**: $19/mes, 10 GB storage
- **Scale**: Custom pricing

---

## 🟠 AWS RDS

### Crear Base de Datos

1. Ve a AWS Console → RDS
2. Create database → PostgreSQL
3. Selecciona versión 17
4. Configura instancia (db.t3.micro para dev)
5. Configura VPC y Security Groups
6. Habilita acceso público (solo para dev)

### Variables de Entorno

```env
DATABASE_URL=postgresql://postgres:your_password@your-instance.region.rds.amazonaws.com:5432/nike_ecommerce
```

### Configuración de Seguridad

```bash
# Security Group: Permitir puerto 5432 desde tu IP
Type: PostgreSQL
Protocol: TCP
Port: 5432
Source: Your IP / 0.0.0.0/0 (solo dev)
```

### Ventajas

- ✅ Altamente escalable
- ✅ Backups automáticos
- ✅ Multi-AZ para alta disponibilidad
- ✅ Integración con AWS

### Desventajas

- ❌ Más caro que alternativas
- ❌ Configuración compleja
- ❌ Requiere conocimiento de AWS

### Pricing

- **db.t3.micro**: ~$15/mes (750 horas gratis primer año)
- **db.t3.small**: ~$30/mes
- **db.m5.large**: ~$150/mes

---

## 🌊 DigitalOcean Managed Database

### Crear Base de Datos

1. Ve a [DigitalOcean](https://cloud.digitalocean.com)
2. Databases → Create Database
3. Selecciona PostgreSQL 17
4. Elige región y plan
5. Copia connection string

### Variables de Entorno

```env
DATABASE_URL=postgresql://doadmin:password@db-postgresql-region-xxxxx-do-user-xxxxx-0.db.ondigitalocean.com:25060/defaultdb?sslmode=require
```

### Configuración de Firewall

```bash
# Añadir tu IP en Trusted Sources
Settings → Trusted Sources → Add your IP
```

### Ventajas

- ✅ Fácil de configurar
- ✅ Backups automáticos
- ✅ Buen precio/rendimiento
- ✅ UI intuitiva

### Desventajas

- ❌ Sin free tier
- ❌ Menos features que AWS

### Pricing

- **Basic**: $15/mes (1 GB RAM, 10 GB storage)
- **Professional**: $60/mes (4 GB RAM, 38 GB storage)

---

## 🟢 Supabase

### Crear Base de Datos

1. Ve a [supabase.com](https://supabase.com)
2. New project
3. Configura nombre y contraseña
4. Copia connection string

### Variables de Entorno

```env
# Connection pooling (recomendado)
DATABASE_URL=postgresql://postgres.project-ref:password@aws-0-region.pooler.supabase.com:6543/postgres

# Direct connection
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
```

### Configuración Especial

```typescript
// Usar connection pooling en producción
// Ya configurado en lib/db/index.ts con Pool
```

### Ventajas

- ✅ Generoso free tier
- ✅ Incluye Auth, Storage, Realtime
- ✅ Muy rápido
- ✅ Excelente DX

### Desventajas

- ❌ Límites en free tier
- ❌ Pausado después de 1 semana de inactividad (free)

### Pricing

- **Free**: 500 MB storage, 2 GB bandwidth
- **Pro**: $25/mes, 8 GB storage, 50 GB bandwidth

---

## 🚂 Railway

### Crear Base de Datos

1. Ve a [railway.app](https://railway.app)
2. New Project → Provision PostgreSQL
3. Copia connection string

### Variables de Entorno

```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### Ventajas

- ✅ Muy fácil de usar
- ✅ Deploy automático desde GitHub
- ✅ Free tier generoso
- ✅ Excelente para MVPs

### Desventajas

- ❌ Más caro a escala
- ❌ Menos control que AWS

### Pricing

- **Free**: $5 crédito/mes
- **Developer**: $10/mes + uso
- **Team**: $20/mes + uso

---

## 🎨 Render

### Crear Base de Datos

1. Ve a [render.com](https://render.com)
2. New → PostgreSQL
3. Selecciona plan
4. Copia connection string

### Variables de Entorno

```env
# Internal (desde Render)
DATABASE_URL=postgresql://user:password@dpg-xxx-a.oregon-postgres.render.com/database_name

# External (desde fuera de Render)
DATABASE_URL=postgresql://user:password@dpg-xxx-a.oregon-postgres.render.com:5432/database_name
```

### Ventajas

- ✅ Free tier disponible
- ✅ Backups automáticos (paid)
- ✅ Fácil integración con apps Render
- ✅ Buen rendimiento

### Desventajas

- ❌ Free tier limitado (90 días)
- ❌ Backups solo en planes pagos

### Pricing

- **Free**: 90 días, luego expira
- **Starter**: $7/mes (1 GB RAM, 1 GB storage)
- **Standard**: $20/mes (4 GB RAM, 10 GB storage)

---

## 🟣 Heroku Postgres

### Crear Base de Datos

1. Ve a [heroku.com](https://heroku.com)
2. Create app
3. Resources → Add-ons → Heroku Postgres
4. Copia connection string

### Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@ec2-xxx.compute-1.amazonaws.com:5432/database_name
```

### Ventajas

- ✅ Integración perfecta con Heroku
- ✅ Backups automáticos
- ✅ Fácil de usar
- ✅ Rollback de base de datos

### Desventajas

- ❌ Caro comparado con alternativas
- ❌ Free tier eliminado

### Pricing

- **Mini**: $5/mes (1 GB storage, 20 conexiones)
- **Basic**: $9/mes (10 GB storage, 20 conexiones)
- **Standard**: $50/mes (64 GB storage, 120 conexiones)

---

## 🔵 Azure Database for PostgreSQL

### Crear Base de Datos

1. Ve a Azure Portal
2. Create resource → Azure Database for PostgreSQL
3. Selecciona Flexible Server
4. Configura servidor y credenciales

### Variables de Entorno

```env
DATABASE_URL=postgresql://username@servername:password@servername.postgres.database.azure.com:5432/database_name?sslmode=require
```

### Configuración de Firewall

```bash
# Añadir regla de firewall para tu IP
Networking → Firewall rules → Add client IP
```

### Ventajas

- ✅ Integración con Azure
- ✅ Alta disponibilidad
- ✅ Backups automáticos
- ✅ Escalado flexible

### Desventajas

- ❌ Configuración compleja
- ❌ Caro
- ❌ Requiere conocimiento de Azure

### Pricing

- **Burstable**: ~$12/mes (1 vCore, 2 GB RAM)
- **General Purpose**: ~$100/mes (2 vCores, 8 GB RAM)

---

## 🔴 Google Cloud SQL

### Crear Base de Datos

1. Ve a Google Cloud Console
2. SQL → Create instance → PostgreSQL
3. Configura instancia
4. Copia connection string

### Variables de Entorno

```env
# Public IP
DATABASE_URL=postgresql://postgres:password@public-ip:5432/database_name

# Cloud SQL Proxy (recomendado)
DATABASE_URL=postgresql://postgres:password@localhost:5432/database_name
```

### Configuración de Cloud SQL Proxy

```bash
# Descargar proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64

# Ejecutar proxy
./cloud-sql-proxy --port 5432 PROJECT:REGION:INSTANCE
```

### Ventajas

- ✅ Integración con GCP
- ✅ Alta disponibilidad
- ✅ Backups automáticos
- ✅ Escalado automático

### Desventajas

- ❌ Configuración compleja
- ❌ Caro
- ❌ Requiere conocimiento de GCP

### Pricing

- **db-f1-micro**: ~$10/mes (0.6 GB RAM)
- **db-g1-small**: ~$25/mes (1.7 GB RAM)
- **db-n1-standard-1**: ~$50/mes (3.75 GB RAM)

---

## 📊 Comparación de Proveedores

| Proveedor        | Free Tier   | Precio Mínimo | Facilidad  | Rendimiento | Recomendado Para   |
| ---------------- | ----------- | ------------- | ---------- | ----------- | ------------------ |
| **Docker**       | ✅ Sí       | $0            | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | Desarrollo local   |
| **Neon**         | ✅ Sí       | $0            | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | Startups, MVPs     |
| **Supabase**     | ✅ Sí       | $0            | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | Startups, MVPs     |
| **Railway**      | ✅ Sí       | $0            | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐    | MVPs, prototipos   |
| **Render**       | ✅ Sí (90d) | $7/mes        | ⭐⭐⭐⭐   | ⭐⭐⭐⭐    | Pequeñas apps      |
| **DigitalOcean** | ❌ No       | $15/mes       | ⭐⭐⭐⭐   | ⭐⭐⭐⭐    | Producción media   |
| **AWS RDS**      | ⚠️ 12 meses | $15/mes       | ⭐⭐⭐     | ⭐⭐⭐⭐⭐  | Empresas, escala   |
| **Heroku**       | ❌ No       | $5/mes        | ⭐⭐⭐⭐⭐ | ⭐⭐⭐      | Prototipos rápidos |
| **Azure**        | ⚠️ Créditos | $12/mes       | ⭐⭐       | ⭐⭐⭐⭐⭐  | Empresas Azure     |
| **GCP**          | ⚠️ Créditos | $10/mes       | ⭐⭐       | ⭐⭐⭐⭐⭐  | Empresas GCP       |

---

## 🎯 Recomendaciones por Caso de Uso

### Desarrollo Local

**Recomendado:** Docker  
**Alternativa:** Neon (free tier)

### MVP / Startup

**Recomendado:** Neon o Supabase  
**Alternativa:** Railway

### Producción Pequeña

**Recomendado:** DigitalOcean  
**Alternativa:** Render

### Producción Media

**Recomendado:** AWS RDS o DigitalOcean  
**Alternativa:** Neon (Pro)

### Producción Grande

**Recomendado:** AWS RDS o Google Cloud SQL  
**Alternativa:** Azure Database

### Prototipo Rápido

**Recomendado:** Railway o Render  
**Alternativa:** Supabase

---

## 🔧 Configuración Universal

Independientemente del proveedor, la configuración en `lib/db/index.ts` funciona para todos:

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

Solo necesitas cambiar `DATABASE_URL` en tu `.env.local` o `.env.prod`.

---

## 📚 Referencias

- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [node-postgres Documentation](https://node-postgres.com/)
- [Drizzle ORM - PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0
