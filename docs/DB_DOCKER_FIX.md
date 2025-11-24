# 🔧 Solución al Problema de Autenticación

## Problema

PostgreSQL está rechazando la autenticación con password desde el host.

## Solución

### Paso 1: Detener y eliminar el contenedor actual

```bash
docker-compose down -v
```

### Paso 2: Verificar que se eliminó

```bash
docker ps -a | grep nike-ecommerce
```

No debería mostrar nada.

### Paso 3: Iniciar nuevamente

```bash
docker-compose up -d
```

### Paso 4: Esperar 10 segundos

```bash
# Windows PowerShell
Start-Sleep -Seconds 10

# Linux/macOS
sleep 10
```

### Paso 5: Probar conexión

```bash
node test-connection.js
```

Debería mostrar: `✅ Connection successful!`

### Paso 6: Ejecutar setup de base de datos

```bash
npm run db:setup
```

### Paso 7: Iniciar aplicación

```bash
npm run dev
```

## Si Aún No Funciona

### Opción A: Usar trust authentication (solo desarrollo)

Edita `docker-compose.yml` y agrega:

```yaml
services:
    postgres:
        command: postgres -c 'hba_file=/etc/postgresql/pg_hba.conf'
        environment:
            POSTGRES_HOST_AUTH_METHOD: trust
```

### Opción B: Cambiar puerto

Si el puerto 5432 está ocupado por otro PostgreSQL:

1. Edita `docker-compose.yml`:

```yaml
ports:
    - '5433:5432'
```

2. Edita `.env.local`:

```env
DATABASE_URL=postgresql://nike_user:nike_password_dev@localhost:5433/nike_ecommerce
```

3. Reinicia:

```bash
docker-compose down -v
docker-compose up -d
```

## Verificación Final

```bash
# 1. Verificar que el contenedor está corriendo
docker ps | grep nike-ecommerce-postgres

# 2. Verificar logs
docker logs nike-ecommerce-postgres --tail 20

# 3. Probar conexión desde el contenedor
docker exec nike-ecommerce-postgres psql -U nike_user -d nike_ecommerce -c "SELECT 1;"

# 4. Probar conexión desde Node.js
node test-connection.js

# 5. Si todo funciona, ejecutar setup
npm run db:setup
```
