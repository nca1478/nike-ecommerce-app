# ✅ Checklist de Migración: Neon → PostgreSQL Universal

## 📋 Pre-Migración

- [ ] **Backup de código actual**

    ```bash
    git add .
    git commit -m "Pre-migration backup"
    git push
    ```

- [ ] **Backup de base de datos** (si tienes datos importantes)

    ```bash
    # Desde Neon o tu proveedor actual
    pg_dump $DATABASE_URL > backup.sql
    ```

- [ ] **Verificar que la aplicación funciona actualmente**

    ```bash
    npm run dev
    # Probar: login, productos, carrito, checkout
    ```

- [ ] **Leer documentación**
    - [ ] `REFACTORING.md` (5 min)
    - [ ] `docs/DATABASE_MIGRATION_GUIDE.md` (45 min)
    - [ ] `docs/DATABASE_REFACTORING_SUMMARY.md` (5 min)

---

## 🔧 Instalación de Dependencias

- [ ] **Instalar Docker** (si no lo tienes)
    - [ ] Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop)
    - [ ] macOS: `brew install --cask docker`
    - [ ] Linux: `sudo apt install docker.io docker-compose`

- [ ] **Verificar Docker**

    ```bash
    docker --version
    docker-compose --version
    ```

- [ ] **Instalar nuevas dependencias**

    ```bash
    npm install pg @types/pg
    ```

- [ ] **Desinstalar dependencias obsoletas**

    ```bash
    npm uninstall @neondatabase/serverless
    ```

- [ ] **Verificar instalación**
    ```bash
    npm list pg
    # Debe mostrar: pg@8.x.x
    ```

---

## 📝 Actualización de Archivos

### Archivos Modificados

- [ ] **`lib/db/index.ts`** - Cambiar de `neon-http` a `node-postgres`
    - [ ] Importar `Pool` de `pg`
    - [ ] Configurar pool con SSL condicional
    - [ ] Exportar `db` y `pool`

- [ ] **`.env.local`** - Actualizar DATABASE_URL

    ```env
    DATABASE_URL=postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce
    ```

- [ ] **`.env.example`** - Agregar ejemplos de proveedores

### Archivos Nuevos

- [ ] **`docker-compose.yml`** - Configuración de PostgreSQL 17
- [ ] **`scripts/migrate-to-pg.js`** - Script de migración automatizada
- [ ] **`scripts/migrate-to-pg.sh`** - Script para Linux/macOS
- [ ] **`scripts/migrate-to-pg.ps1`** - Script para Windows
- [ ] **`Makefile`** - Comandos de desarrollo (opcional)
- [ ] **`.dockerignore`** - Ignorar archivos en Docker

### Archivos de Documentación

- [ ] **`REFACTORING.md`** - Guía rápida de refactoring
- [ ] **`docs/DATABASE_MIGRATION_GUIDE.md`** - Guía completa
- [ ] **`docs/DATABASE_REFACTORING_SUMMARY.md`** - Resumen ejecutivo
- [ ] **`docs/DATABASE_PROVIDERS.md`** - Guía de proveedores
- [ ] **`docs/MIGRATION_CHECKLIST.md`** - Este archivo

---

## 🐳 Configuración de Docker

- [ ] **Crear `docker-compose.yml`**

    ```yaml
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
            volumes:
                - postgres_data:/var/lib/postgresql/data
    volumes:
        postgres_data:
    ```

- [ ] **Levantar PostgreSQL**

    ```bash
    docker-compose up -d
    ```

- [ ] **Verificar que PostgreSQL está corriendo**

    ```bash
    docker-compose ps
    # Estado: Up
    ```

- [ ] **Verificar logs**

    ```bash
    docker-compose logs -f postgres
    # Debe mostrar: "database system is ready to accept connections"
    ```

- [ ] **Probar conexión manual** (opcional)
    ```bash
    psql postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce
    # Debe conectarse sin errores
    ```

---

## 🗄️ Configuración de Base de Datos

- [ ] **Generar migraciones**

    ```bash
    npm run db:generate
    ```

- [ ] **Aplicar schema**

    ```bash
    npm run db:push
    ```

- [ ] **Aplicar índices**

    ```bash
    npm run db:indexes
    ```

- [ ] **Insertar datos de ejemplo**

    ```bash
    npm run db:seed
    ```

- [ ] **O ejecutar todo en uno**

    ```bash
    npm run db:setup
    ```

- [ ] **Verificar tablas creadas**
    ```bash
    docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "\dt"
    # Debe mostrar todas las tablas
    ```

---

## 🧪 Pruebas de Funcionalidad

### Desarrollo Local

- [ ] **Iniciar servidor de desarrollo**

    ```bash
    npm run dev
    ```

- [ ] **Verificar que no hay errores de conexión**
    - [ ] Revisar terminal (no debe haber errores de DB)
    - [ ] Revisar consola del navegador

- [ ] **Probar autenticación**
    - [ ] Registrar nuevo usuario
    - [ ] Iniciar sesión
    - [ ] Cerrar sesión
    - [ ] Verificar persistencia de sesión

- [ ] **Probar productos**
    - [ ] Ver listado de productos
    - [ ] Aplicar filtros (marca, categoría, género)
    - [ ] Buscar productos
    - [ ] Ver detalle de producto
    - [ ] Verificar imágenes

- [ ] **Probar carrito**
    - [ ] Agregar producto al carrito
    - [ ] Incrementar cantidad
    - [ ] Eliminar producto
    - [ ] Verificar persistencia en localStorage
    - [ ] Verificar cálculo de totales

- [ ] **Probar checkout** (si Stripe está configurado)
    - [ ] Ir a checkout
    - [ ] Completar pago con tarjeta de prueba
    - [ ] Verificar creación de pedido
    - [ ] Verificar página de confirmación
    - [ ] Verificar que el carrito se vacía

### Verificación de Compatibilidad

- [ ] **Better-Auth funciona correctamente**
    - [ ] Login/registro
    - [ ] Sesiones persistentes
    - [ ] Cookies seguras

- [ ] **Zustand funciona correctamente**
    - [ ] Estado del carrito persiste
    - [ ] Actualizaciones reactivas

- [ ] **Drizzle ORM funciona correctamente**
    - [ ] Queries funcionan
    - [ ] Inserts funcionan
    - [ ] Updates funcionan
    - [ ] Deletes funcionan

- [ ] **Stripe funciona correctamente** (si está configurado)
    - [ ] Checkout session se crea
    - [ ] Webhook recibe eventos
    - [ ] Pedidos se crean

---

## 🚀 Preparación para Producción

### Configuración de Proveedor

- [ ] **Elegir proveedor de PostgreSQL**
    - [ ] Neon (sigue siendo compatible)
    - [ ] AWS RDS
    - [ ] DigitalOcean
    - [ ] Supabase
    - [ ] Railway
    - [ ] Render
    - [ ] Otro (ver `docs/DATABASE_PROVIDERS.md`)

- [ ] **Crear base de datos en el proveedor**
    - [ ] Seguir guía del proveedor
    - [ ] Copiar connection string

- [ ] **Configurar variables de entorno de producción**
    ```env
    NODE_ENV=production
    DATABASE_URL=postgresql://user:password@host:5432/database_name
    BETTER_AUTH_SECRET=production_secret_min_32_chars
    BETTER_AUTH_URL=https://tu-dominio.com
    NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
    ```

### Migración de Datos

- [ ] **Restaurar backup** (si tienes datos importantes)

    ```bash
    psql $DATABASE_URL < backup.sql
    ```

- [ ] **O ejecutar setup completo**
    ```bash
    npm run db:setup
    ```

### Build y Deploy

- [ ] **Verificar tipos TypeScript**

    ```bash
    npm run check:ts
    ```

- [ ] **Ejecutar linting**

    ```bash
    npm run lint
    ```

- [ ] **Generar build de producción**

    ```bash
    npm run build
    ```

- [ ] **Probar build localmente**

    ```bash
    npm start
    # Verificar que funciona correctamente
    ```

- [ ] **Desplegar a producción**
    - [ ] Vercel: `vercel --prod`
    - [ ] Netlify: Push a GitHub
    - [ ] Railway: Push a GitHub
    - [ ] Otro: Seguir guía del proveedor

---

## 🔍 Verificación Post-Despliegue

### Funcionalidad

- [ ] **Verificar que la aplicación carga**
    - [ ] Home page
    - [ ] Productos
    - [ ] Login/Registro

- [ ] **Probar flujo completo**
    - [ ] Registrar usuario
    - [ ] Agregar productos al carrito
    - [ ] Completar checkout
    - [ ] Verificar pedido

### Rendimiento

- [ ] **Verificar tiempos de carga**
    - [ ] Home < 3s
    - [ ] Productos < 3s
    - [ ] Detalle de producto < 2s

- [ ] **Verificar métricas Core Web Vitals**
    - [ ] FCP < 1.8s
    - [ ] LCP < 2.5s
    - [ ] CLS < 0.1

### Monitoreo

- [ ] **Configurar monitoreo de errores**
    - [ ] Sentry (opcional)
    - [ ] LogRocket (opcional)
    - [ ] Logs del proveedor

- [ ] **Verificar logs de base de datos**
    - [ ] No hay errores de conexión
    - [ ] Queries funcionan correctamente

- [ ] **Configurar alertas** (opcional)
    - [ ] Errores de base de datos
    - [ ] Tiempo de respuesta alto
    - [ ] Uso de recursos

---

## 📊 Comparación Antes/Después

### Antes de la Migración

- [ ] **Documentar métricas actuales**
    - [ ] Tiempo de carga promedio: **\_**
    - [ ] Latencia de DB: **\_**
    - [ ] Costo mensual: **\_**
    - [ ] Proveedor: **\_**

### Después de la Migración

- [ ] **Documentar nuevas métricas**
    - [ ] Tiempo de carga promedio: **\_**
    - [ ] Latencia de DB: **\_**
    - [ ] Costo mensual: **\_**
    - [ ] Proveedor: **\_**

- [ ] **Calcular mejoras**
    - [ ] Reducción de latencia: **\_**%
    - [ ] Ahorro de costos: **\_**%
    - [ ] Mejora de rendimiento: **\_**%

---

## 🎉 Finalización

- [ ] **Actualizar documentación del proyecto**
    - [ ] README.md
    - [ ] CHANGELOG.md (si existe)

- [ ] **Commit de cambios**

    ```bash
    git add .
    git commit -m "feat: migrate from Neon to universal PostgreSQL"
    git push
    ```

- [ ] **Crear tag de versión**

    ```bash
    git tag -a v1.1.0 -m "PostgreSQL universal migration"
    git push --tags
    ```

- [ ] **Notificar al equipo**
    - [ ] Enviar email/mensaje
    - [ ] Actualizar documentación interna
    - [ ] Compartir guía de migración

- [ ] **Celebrar** 🎉
    - [ ] La migración está completa
    - [ ] Ya no hay vendor lock-in
    - [ ] Puedes usar cualquier proveedor PostgreSQL

---

## 🆘 Troubleshooting

Si encuentras problemas, consulta:

1. **`docs/DATABASE_MIGRATION_GUIDE.md`** - Sección 8: Troubleshooting
2. **`REFACTORING.md`** - Sección: Troubleshooting Rápido
3. **GitHub Issues** - Reportar problemas
4. **Logs de Docker**: `docker-compose logs -f postgres`
5. **Logs de la aplicación**: Terminal de `npm run dev`

---

## 📞 Soporte

- **Documentación completa**: `docs/DATABASE_MIGRATION_GUIDE.md`
- **Guía rápida**: `REFACTORING.md`
- **Proveedores**: `docs/DATABASE_PROVIDERS.md`
- **GitHub Issues**: Reportar problemas

---

**Tiempo estimado total:** 30-60 minutos  
**Dificultad:** Media  
**Impacto en código:** Mínimo (solo capa de conexión)

---

## ✅ Resumen

Una vez completado este checklist:

- ✅ Has eliminado la dependencia de Neon
- ✅ Puedes usar cualquier proveedor PostgreSQL
- ✅ Tienes desarrollo local con Docker
- ✅ Tu aplicación funciona igual que antes
- ✅ Tienes mejor rendimiento (TCP vs HTTP)
- ✅ Tienes pool de conexiones optimizado
- ✅ Estás listo para escalar

**¡Felicitaciones por completar la migración!** 🎉
