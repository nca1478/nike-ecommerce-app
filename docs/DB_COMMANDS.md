# 🔧 Comandos Útiles - Refactoring de Base de Datos

## 🚀 Migración

### Migración Automatizada

```bash
# Opción 1: NPM Script (Recomendado - Multiplataforma)
npm run migrate:pg

# Opción 2: Bash (Linux/macOS)
bash scripts/migrate-to-pg.sh

# Opción 3: PowerShell (Windows)
.\scripts\migrate-to-pg.ps1
```

### Migración Manual

```bash
# 1. Instalar nuevas dependencias
npm install pg @types/pg

# 2. Desinstalar dependencias obsoletas
npm uninstall @neondatabase/serverless

# 3. Levantar PostgreSQL
docker-compose up -d

# 4. Configurar base de datos
npm run db:setup

# 5. Iniciar desarrollo
npm run dev
```

---

## 🐳 Docker

### Gestión de Contenedores

```bash
# Levantar PostgreSQL
docker-compose up -d
# o
npm run docker:up

# Detener PostgreSQL
docker-compose down
# o
npm run docker:down

# Reiniciar PostgreSQL (⚠️ BORRA DATOS)
docker-compose down -v && docker-compose up -d
# o
npm run docker:reset

# Ver logs
docker-compose logs -f postgres

# Ver estado
docker-compose ps
```

### Conexión Manual

```bash
# Conectarse a PostgreSQL desde el host
psql postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce

# Conectarse desde el contenedor
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce

# Ejecutar comando SQL
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT * FROM users LIMIT 5;"

# Listar tablas
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "\dt"

# Describir tabla
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "\d users"
```

---

## 🗄️ Base de Datos

### Setup Completo

```bash
# Todo en uno (Recomendado)
npm run db:setup

# Paso a paso
npm run db:generate  # Generar migraciones
npm run db:push      # Aplicar schema
npm run db:indexes   # Aplicar índices
npm run db:seed      # Insertar datos
```

### Migraciones

```bash
# Generar migraciones desde schema
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Push directo (sin migraciones)
npm run db:push
```

### Índices y Datos

```bash
# Aplicar índices de rendimiento
npm run db:indexes

# Insertar datos de ejemplo
npm run db:seed
```

---

## 🔍 Verificación

### Dependencias

```bash
# Verificar que pg está instalado
npm list pg

# Verificar que @neondatabase/serverless NO está instalado
npm list @neondatabase/serverless

# Ver todas las dependencias
npm list --depth=0
```

### Docker

```bash
# Verificar que Docker está instalado
docker --version
docker-compose --version

# Verificar que PostgreSQL está corriendo
docker-compose ps

# Verificar logs de PostgreSQL
docker-compose logs postgres | grep "ready to accept connections"
```

### Base de Datos

```bash
# Verificar conexión
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT version();"

# Contar tablas
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

# Contar productos
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT COUNT(*) FROM products;"
```

---

## 🧪 Testing

### Aplicación

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar tipos TypeScript
npm run check:ts

# Ejecutar linting
npm run lint

# Formatear código
npm run format
```

### Funcionalidad

```bash
# Probar autenticación (manual en navegador)
# 1. Abrir http://localhost:3000/sign-up
# 2. Registrar usuario
# 3. Iniciar sesión
# 4. Verificar que funciona

# Probar productos (manual en navegador)
# 1. Abrir http://localhost:3000/products
# 2. Verificar que se muestran productos
# 3. Aplicar filtros
# 4. Verificar que funciona

# Probar carrito (manual en navegador)
# 1. Agregar producto al carrito
# 2. Ir a /cart
# 3. Verificar que se muestra
# 4. Modificar cantidad
# 5. Verificar que funciona
```

---

## 🔄 Rollback

### Rollback Rápido

```bash
# 1. Restaurar package.json
cp package.json.backup package.json

# 2. Reinstalar dependencias
npm install

# 3. Revertir cambios en lib/db/index.ts
git checkout lib/db/index.ts

# 4. Reiniciar aplicación
npm run dev
```

### Rollback Completo

```bash
# 1. Detener Docker
docker-compose down -v

# 2. Restaurar archivos
cp package.json.backup package.json
git checkout lib/db/index.ts
git checkout .env.example

# 3. Reinstalar dependencias
rm -rf node_modules
npm install

# 4. Reiniciar aplicación
npm run dev
```

---

## 🧹 Limpieza

### Limpieza Básica

```bash
# Limpiar build de Next.js
rm -rf .next

# Limpiar node_modules
rm -rf node_modules

# Limpiar migraciones
rm -rf drizzle/*.sql

# Reinstalar dependencias
npm install
```

### Limpieza Completa

```bash
# Detener y eliminar contenedores Docker
docker-compose down -v

# Limpiar todo
rm -rf .next node_modules drizzle/*.sql

# Reinstalar
npm install

# Reiniciar Docker
docker-compose up -d

# Reconfigurar base de datos
npm run db:setup
```

---

## 📊 Monitoreo

### Logs

```bash
# Logs de Docker
docker-compose logs -f postgres

# Logs de la aplicación
npm run dev
# (ver terminal)

# Logs de build
npm run build
# (ver terminal)
```

### Métricas

```bash
# Ver uso de recursos de Docker
docker stats nike-ecommerce-postgres

# Ver conexiones activas
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active';"

# Ver tamaño de base de datos
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT pg_size_pretty(pg_database_size('nike_ecommerce'));"

# Ver tamaño de tablas
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;"
```

---

## 🔧 Troubleshooting

### Error: "Connection timeout"

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Reiniciar PostgreSQL
docker-compose down
docker-compose up -d

# Verificar logs
docker-compose logs -f postgres

# Probar conexión manual
psql postgresql://nike_user:nike_password_dev@localhost:5432/nike_ecommerce
```

### Error: "Database does not exist"

```bash
# Recrear base de datos
docker-compose down -v
docker-compose up -d

# Esperar 5 segundos
sleep 5

# Reconfigurar
npm run db:setup
```

### Error: "Too many connections"

```bash
# Ver conexiones activas
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT COUNT(*) FROM pg_stat_activity;"

# Matar conexiones inactivas
docker exec -it nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND pid <> pg_backend_pid();"

# Reiniciar aplicación
# Ctrl+C en terminal de npm run dev
npm run dev
```

### Error: "pg installation failed"

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules
rm -rf node_modules

# Reinstalar
npm install

# Verificar
npm list pg
```

---

## 🚀 Producción

### Preparación

```bash
# 1. Configurar variables de entorno
cp .env.example .env.prod
# Editar .env.prod con credenciales de producción

# 2. Verificar tipos
npm run check:ts

# 3. Ejecutar linting
npm run lint

# 4. Generar build
npm run build

# 5. Probar build localmente
npm start
```

### Deploy

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Railway
git push railway main

# Render
git push render main

# Docker
docker build -t nike-ecommerce .
docker run -p 3000:3000 nike-ecommerce
```

---

## 📚 Documentación

### Ver Documentación

```bash
# Abrir documentación en navegador (si tienes un servidor local)
# macOS
open docs/DATABASE_DOCS_INDEX.md

# Linux
xdg-open docs/DATABASE_DOCS_INDEX.md

# Windows
start docs/DATABASE_DOCS_INDEX.md

# O usar un editor
code docs/DATABASE_DOCS_INDEX.md
```

### Buscar en Documentación

```bash
# Buscar término en todos los docs
grep -r "pool de conexiones" docs/

# Buscar en archivo específico
grep "troubleshooting" docs/DATABASE_MIGRATION_GUIDE.md

# Buscar con contexto
grep -A 5 -B 5 "error" docs/DATABASE_MIGRATION_GUIDE.md
```

---

## 🎯 Comandos Rápidos

### Setup Inicial

```bash
npm run migrate:pg && npm run dev
```

### Reinicio Completo

```bash
docker-compose down -v && docker-compose up -d && npm run db:setup && npm run dev
```

### Verificación Completa

```bash
npm list pg && docker-compose ps && npm run check:ts && npm run lint
```

### Limpieza y Reinstalación

```bash
docker-compose down -v && rm -rf .next node_modules && npm install && docker-compose up -d && npm run db:setup
```

---

## 📝 Notas

- Todos los comandos asumen que estás en el directorio `nike-ecommerce-app`
- Los comandos de Docker requieren Docker y Docker Compose instalados
- Los comandos de npm requieren Node.js 20+ instalado
- Para Windows, usa PowerShell o Git Bash para comandos Unix-like

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0
