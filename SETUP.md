# Guía de Configuración

## 1. Configurar Neon PostgreSQL

1. Ve a [Neon](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto
3. Copia la cadena de conexión (Connection String)
4. Pégala en tu archivo `.env.local` como `DATABASE_URL`

## 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BETTER_AUTH_SECRET=genera_un_secreto_aleatorio_aqui
BETTER_AUTH_URL=http://localhost:3000
```

Para generar un secreto aleatorio, puedes usar:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Configurar la Base de Datos

Ejecuta los siguientes comandos en orden:

```bash
# Aplicar el schema a la base de datos
npm run db:push

# Insertar datos de ejemplo
npm run db:seed
```

## 4. Iniciar la Aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Solución de Problemas

### Error de conexión a la base de datos

- Verifica que tu `DATABASE_URL` sea correcta
- Asegúrate de que incluya `?sslmode=require` al final
- Verifica que tu IP esté permitida en Neon (por defecto permite todas)

### Error al hacer seed

- Asegúrate de haber ejecutado `npm run db:push` primero
- Verifica que la tabla no tenga datos duplicados

### Errores de TypeScript

- Ejecuta `npm install` para asegurarte de que todas las dependencias estén instaladas
- Reinicia tu editor/IDE
