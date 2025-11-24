# 🔄 Guía de Migración: Desacoplamiento de Neon Database

## 📌 Resumen Ejecutivo

Este documento detalla el proceso de migración de `@neondatabase/serverless` a `pg` (node-postgres), eliminando el vendor lock-in y permitiendo el uso de cualquier proveedor PostgreSQL estándar.

---

## 🎯 Objetivos Alcanzados

✅ Eliminación de dependencia exclusiva de Neon  
✅ Soporte para PostgreSQL local (Docker)  
✅ Compatibilidad con AWS RDS, DigitalOcean, Supabase, Railway, etc.  
✅ Mantenimiento de funcionalidad de Better-Auth y Zustand  
✅ Pool de conexiones optimizado para producción

---

## 📦 1. INSTALACIÓN DE DEPENDENCIAS

### Instalar nuevas dependencias

```bash
cd nike-ecommerce-app
npm install pg @types/pg
```

### Remover dependencias obsoletas

```bash
npm uninstall @neondatabase/serverless
```

### Verificar instalación

```bash
npm list pg
# Debe mostrar: pg@8.x.x
```

---

## 🐳 2. CONFIGURACIÓN DE DOCKER (DESARROLLO LOCAL)

### Levantar PostgreSQL 17

```bash
# Iniciar contenedor
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f postgres

# Detener contenedor
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA DATOS)
docker-compose down -v
```

### Conectarse manualmente (opcional)

```bash
# Desde el host
psql postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce

# Desde el contenedor
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce
```

---

## ⚙️ 3. CONFIGURACIÓN DE VARIABLES DE ENTORNO

### Desarrollo Local (.env.local)

```env
NODE_ENV=development
DATABASE_URL=postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce
BETTER_AUTH_SECRET=dev_secret_key_change_in_production_min_32_chars
BETTER_AUTH_URL=http://localhost:3000
```

### Producción (.env.prod)

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@production-host:5432/database_name
BETTER_AUTH_SECRET=production_secret_key_min_32_characters_required
BETTER_AUTH_URL=https://yourdomain.com
```

---

## 🔧 4. MIGRACIÓN DE BASE DE DATOS

### Generar migraciones

```bash
npm run db:generate
```

### Aplicar migraciones

```bash
npm run db:push
```

### Aplicar índices

```bash
npm run db:indexes
```

### Seed de datos

```bash
npm run db:seed
```

### Setup completo (todo en uno)

```bash
npm run db:setup
```

---

## 🚀 5. EJECUCIÓN DEL PROYECTO

### Desarrollo

```bash
# 1. Levantar PostgreSQL
docker-compose up -d

# 2. Configurar base de datos (solo primera vez)
npm run db:setup

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Producción

```bash
# 1. Configurar variables de entorno (.env.prod)
# 2. Ejecutar migraciones
npm run db:setup

# 3. Build y start
npm run build
npm start
```

---

## 🔍 6. VERIFICACIÓN DE COMPATIBILIDAD

### Better-Auth

✅ **Sin cambios necesarios**  
Better-Auth usa el adaptador Drizzle, que es agnóstico al driver subyacente.

```typescript
// lib/auth.ts - NO REQUIERE MODIFICACIÓN
database: drizzleAdapter(db, {
    provider: 'pg', // ✅ Sigue funcionando
    schema: { ... }
})
```

### Zustand (Cart Store)

✅ **Sin cambios necesarios**  
Zustand es un state manager del cliente, no interactúa directamente con la base de datos.

### Drizzle ORM

✅ **Totalmente compatible**  
El cambio de `drizzle-orm/neon-http` a `drizzle-orm/node-postgres` es transparente para las queries.

```typescript
// Todas estas queries siguen funcionando igual
await db.select().from(products);
await db.insert(orders).values({ ... });
await db.update(users).set({ ... }).where(eq(users.id, id));
```

---

## 🌐 7. PROVEEDORES COMPATIBLES

### Neon (sigue siendo compatible)

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/database_name?sslmode=require
```

### AWS RDS

```env
DATABASE_URL=postgresql://user:password@instance.region.rds.amazonaws.com:5432/database_name
```

### DigitalOcean Managed Database

```env
DATABASE_URL=postgresql://user:password@db-postgresql-region-xxxxx-do-user-xxxxx-0.db.ondigitalocean.com:25060/database_name?sslmode=require
```

### Supabase

```env
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
```

### Railway

```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### Render

```env
DATABASE_URL=postgresql://user:password@dpg-xxx-a.oregon-postgres.render.com/database_name
```

---

## 🛠️ 8. TROUBLESHOOTING

### Error: "Connection timeout"

**Causa:** El pool no puede conectarse a la base de datos.

**Solución:**

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Verificar conectividad
telnet localhost 5432
```

### Error: "SSL required"

**Causa:** El proveedor requiere SSL pero no está configurado.

**Solución:**

```typescript
// lib/db/index.ts - Ya está configurado automáticamente
ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false;
```

### Error: "Too many connections"

**Causa:** El pool ha alcanzado el límite de conexiones.

**Solución:**

```typescript
// Ajustar en lib/db/index.ts
max: process.env.NODE_ENV === 'production' ? 20 : 5;
```

### Error: "Database does not exist"

**Causa:** La base de datos no ha sido creada.

**Solución:**

```bash
# Crear base de datos manualmente
docker exec -it nike-ecommerce-postgres psql -U nike_user -c "CREATE DATABASE nike_ecommerce;"

# O recrear el contenedor
docker-compose down -v
docker-compose up -d
```

---

## 📊 9. COMPARACIÓN TÉCNICA

| Aspecto                | Antes (Neon)               | Después (pg)         |
| ---------------------- | -------------------------- | -------------------- |
| **Driver**             | `@neondatabase/serverless` | `pg` (node-postgres) |
| **Protocolo**          | HTTP/WebSocket             | TCP nativo           |
| **Vendor Lock-in**     | ❌ Alto                    | ✅ Ninguno           |
| **Latencia**           | ~50-100ms (HTTP)           | ~5-10ms (TCP)        |
| **Pool de conexiones** | ❌ No soportado            | ✅ Nativo            |
| **Compatibilidad**     | Solo Neon                  | Cualquier PostgreSQL |
| **Desarrollo local**   | ❌ Requiere Neon           | ✅ Docker            |
| **Costo**              | Depende de Neon            | Flexible             |

---

## ✅ 10. CHECKLIST DE MIGRACIÓN

- [ ] Instalar `pg` y `@types/pg`
- [ ] Desinstalar `@neondatabase/serverless`
- [ ] Actualizar `lib/db/index.ts`
- [ ] Crear `docker-compose.yml`
- [ ] Configurar `.env.local` con DATABASE_URL local
- [ ] Levantar PostgreSQL con `docker-compose up -d`
- [ ] Ejecutar `npm run db:setup`
- [ ] Verificar que `npm run dev` funciona correctamente
- [ ] Probar login/registro (Better-Auth)
- [ ] Probar agregar productos al carrito (Zustand)
- [ ] Probar checkout completo
- [ ] Configurar `.env.prod` para producción
- [ ] Desplegar y verificar en producción

---

## 📚 Referencias

- [node-postgres Documentation](https://node-postgres.com/)
- [Drizzle ORM - PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Better-Auth - Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle)
- [Docker Compose - PostgreSQL](https://hub.docker.com/_/postgres)

---

## 🎉 Conclusión

La migración elimina completamente la dependencia de Neon, permitiendo:

1. **Desarrollo local** sin costos ni latencia de red
2. **Flexibilidad de proveedor** en producción
3. **Mejor rendimiento** con conexiones TCP nativas
4. **Pool de conexiones** optimizado para alta concurrencia
5. **Compatibilidad universal** con cualquier PostgreSQL estándar

El código de aplicación (Better-Auth, Zustand, Server Actions) **no requiere cambios**, solo la capa de conexión.
