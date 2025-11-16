/**
 * Script para aplicar índices adicionales de rendimiento
 * Estos índices no se pueden definir directamente en el esquema de Drizzle
 * pero son importantes para el rendimiento de búsqueda
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function applyAdditionalIndexes() {
    console.log('🔧 Aplicando índices adicionales de rendimiento...\n');

    try {
        // Habilitar extensión pg_trgm para búsqueda de texto
        console.log('📦 Habilitando extensión pg_trgm...');
        await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
        console.log('✅ Extensión pg_trgm habilitada\n');

        // Índice GIN para búsqueda en nombre de producto
        console.log('🔍 Creando índice de búsqueda en nombre de producto...');
        await sql`
            CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
            ON products USING gin(name gin_trgm_ops)
        `;
        console.log('✅ Índice de búsqueda en nombre creado\n');

        // Índice GIN para búsqueda en descripción
        console.log('🔍 Creando índice de búsqueda en descripción...');
        await sql`
            CREATE INDEX IF NOT EXISTS idx_products_description_trgm 
            ON products USING gin(description gin_trgm_ops)
        `;
        console.log('✅ Índice de búsqueda en descripción creado\n');

        // Índice funcional para precio como decimal
        console.log('💰 Creando índice funcional para precio...');
        await sql`
            CREATE INDEX IF NOT EXISTS idx_variants_price_decimal 
            ON product_variants((CAST(price AS DECIMAL)))
        `;
        console.log('✅ Índice de precio creado\n');

        // Agregar comentarios a los índices
        console.log('📝 Agregando comentarios de documentación...');
        await sql`
            COMMENT ON INDEX idx_products_name_trgm 
            IS 'Optimiza búsqueda de texto en nombre de producto usando trigram'
        `;
        await sql`
            COMMENT ON INDEX idx_products_description_trgm 
            IS 'Optimiza búsqueda de texto en descripción usando trigram'
        `;
        await sql`
            COMMENT ON INDEX idx_variants_price_decimal 
            IS 'Optimiza filtrado y ordenamiento por rango de precio'
        `;
        console.log('✅ Comentarios agregados\n');

        console.log(
            '🎉 ¡Todos los índices adicionales se aplicaron correctamente!\n',
        );
        console.log('📊 Resumen de índices aplicados:');
        console.log('   • Extensión pg_trgm habilitada');
        console.log('   • Índice de búsqueda en nombre (GIN trigram)');
        console.log('   • Índice de búsqueda en descripción (GIN trigram)');
        console.log('   • Índice funcional para precio (DECIMAL)');
        console.log(
            '\n✨ Los índices básicos ya están en el esquema de Drizzle',
        );
        console.log('   y se aplican automáticamente con "npm run db:push"\n');
    } catch (error) {
        console.error('❌ Error al aplicar índices:', error);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    applyAdditionalIndexes()
        .then(() => {
            console.log('✅ Script completado exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script falló:', error);
            process.exit(1);
        });
}

export { applyAdditionalIndexes };
