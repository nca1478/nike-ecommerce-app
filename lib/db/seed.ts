import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno antes de cualquier otro import
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { db } from './index';
import { products } from './schema';

const nikeProducts = [
    {
        name: 'Nike Air Max 270',
        description:
            'Zapatillas con la unidad Air más grande de Nike para una comodidad excepcional durante todo el día.',
        price: '149.99',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        category: 'Zapatillas',
    },
    {
        name: 'Nike Dri-FIT',
        description:
            'Camiseta deportiva con tecnología Dri-FIT que mantiene la piel seca y cómoda.',
        price: '34.99',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        category: 'Ropa',
    },
    {
        name: 'Nike React Infinity Run',
        description:
            'Zapatillas de running diseñadas para ayudar a reducir las lesiones y mantener el ritmo.',
        price: '159.99',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
        category: 'Zapatillas',
    },
    {
        name: 'Nike Sportswear Tech Fleece',
        description:
            'Sudadera con capucha de tejido ligero que proporciona calor sin peso adicional.',
        price: '109.99',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        category: 'Ropa',
    },
    {
        name: 'Nike Brasilia Backpack',
        description:
            'Mochila espaciosa con múltiples compartimentos para organizar tu equipo.',
        price: '39.99',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        category: 'Accesorios',
    },
    {
        name: 'Nike Pegasus 40',
        description:
            'Zapatillas de running versátiles con amortiguación reactiva para entrenamientos diarios.',
        price: '139.99',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
        category: 'Zapatillas',
    },
];

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        await db.insert(products).values(nikeProducts);
        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
