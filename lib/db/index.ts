import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Cargar variables de entorno
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error(
        `DATABASE_URL is not defined. Please check your envFile file.`,
    );
}

// Configuración del pool de conexiones PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: process.env.NODE_ENV === 'production' ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: process.env.VERCEL === '1' ? { rejectUnauthorized: false } : false,
});

// Manejo de errores del pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

// Inicializar Drizzle con el adaptador node-postgres
export const db = drizzle(pool, { schema });

// Exportar pool para casos de uso avanzados (transacciones manuales, etc.)
export { pool };
