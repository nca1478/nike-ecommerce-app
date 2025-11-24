import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { eq } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

// Seed data
const gendersData = [
    { label: 'Men', slug: 'men' },
    { label: 'Women', slug: 'women' },
    { label: 'Unisex', slug: 'unisex' },
    { label: 'Kids', slug: 'kids' },
];

const colorsData = [
    { name: 'Black', slug: 'black', hexCode: '#000000' },
    { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
    { name: 'Red', slug: 'red', hexCode: '#FF0000' },
    { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
    { name: 'Green', slug: 'green', hexCode: '#00FF00' },
    { name: 'Yellow', slug: 'yellow', hexCode: '#FFFF00' },
    { name: 'Orange', slug: 'orange', hexCode: '#FFA500' },
    { name: 'Pink', slug: 'pink', hexCode: '#FFC0CB' },
    { name: 'Purple', slug: 'purple', hexCode: '#800080' },
    { name: 'Grey', slug: 'grey', hexCode: '#808080' },
    { name: 'Brown', slug: 'brown', hexCode: '#A52A2A' },
];

const sizesData = [
    { name: '6', slug: '6', sortOrder: 1 },
    { name: '6.5', slug: '6-5', sortOrder: 2 },
    { name: '7', slug: '7', sortOrder: 3 },
    { name: '7.5', slug: '7-5', sortOrder: 4 },
    { name: '8', slug: '8', sortOrder: 5 },
    { name: '8.5', slug: '8-5', sortOrder: 6 },
    { name: '9', slug: '9', sortOrder: 7 },
    { name: '9.5', slug: '9-5', sortOrder: 8 },
    { name: '10', slug: '10', sortOrder: 9 },
    { name: '10.5', slug: '10-5', sortOrder: 10 },
    { name: '11', slug: '11', sortOrder: 11 },
    { name: '11.5', slug: '11-5', sortOrder: 12 },
    { name: '12', slug: '12', sortOrder: 13 },
];

const brandsData = [{ name: 'Nike', slug: 'nike', logoUrl: '/logo.svg' }];

const categoriesData = [
    { name: 'Running', slug: 'running', parentId: null },
    { name: 'Basketball', slug: 'basketball', parentId: null },
    { name: 'Training', slug: 'training', parentId: null },
    { name: 'Lifestyle', slug: 'lifestyle', parentId: null },
    { name: 'Soccer', slug: 'soccer', parentId: null },
];

const collectionsData = [
    { name: 'Summer 2025', slug: 'summer-2025' },
    { name: 'Best Sellers', slug: 'best-sellers' },
    { name: 'New Arrivals', slug: 'new-arrivals' },
];

const productsData = [
    {
        name: 'Air Max 270',
        description:
            'Nike first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.',
        category: 'lifestyle',
        gender: 'unisex',
        images: ['shoe-1.jpg'],
        basePrice: '150.00',
        salePrice: null,
    },
    {
        name: 'React Infinity Run',
        description:
            'A pioneer in the running world, the Nike React Infinity Run Flyknit 3 is designed to help reduce injury.',
        category: 'running',
        gender: 'men',
        images: ['shoe-2.webp'],
        basePrice: '160.00',
        salePrice: '129.99',
    },
    {
        name: 'Air Force 1',
        description:
            'The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best.',
        category: 'lifestyle',
        gender: 'unisex',
        images: ['shoe-3.webp'],
        basePrice: '110.00',
        salePrice: null,
    },
    {
        name: 'ZoomX Vaporfly',
        description:
            'Continue your running journey in the Nike ZoomX Vaporfly NEXT% 3. Engineered to the exact specifications of championship athletes.',
        category: 'running',
        gender: 'men',
        images: ['shoe-4.webp'],
        basePrice: '250.00',
        salePrice: '199.99',
    },
    {
        name: 'Pegasus 40',
        description:
            'A springy ride for every run, the Pegasus 40 returns with improved comfort and responsiveness.',
        category: 'running',
        gender: 'women',
        images: ['shoe-5.avif'],
        basePrice: '130.00',
        salePrice: null,
    },
    {
        name: 'LeBron 21',
        description:
            'Created for the most powerful player in the game, the LeBron 21 is made for the all-around player.',
        category: 'basketball',
        gender: 'men',
        images: ['shoe-6.avif'],
        basePrice: '200.00',
        salePrice: '169.99',
    },
    {
        name: 'Metcon 9',
        description:
            'The Nike Metcon 9 combines stability, durability and versatility to stand up to serious strength training.',
        category: 'training',
        gender: 'unisex',
        images: ['shoe-7.avif'],
        basePrice: '150.00',
        salePrice: null,
    },
    {
        name: 'Mercurial Superfly 9',
        description:
            'The Nike Mercurial Superfly 9 Elite FG is made for the player who demands speed.',
        category: 'soccer',
        gender: 'men',
        images: ['shoe-8.avif'],
        basePrice: '275.00',
        salePrice: '229.99',
    },
    {
        name: 'Blazer Mid 77',
        description:
            'In the 70s, Nike was the new shoe on the block. The Nike Blazer Mid 77 Vintage returns with a classic look.',
        category: 'lifestyle',
        gender: 'unisex',
        images: ['shoe-9.avif'],
        basePrice: '100.00',
        salePrice: null,
    },
    {
        name: 'Air Jordan 1 Mid',
        description:
            'Inspired by the original AJ1, the Air Jordan 1 Mid offers fans a chance to follow in MJ footsteps.',
        category: 'basketball',
        gender: 'unisex',
        images: ['shoe-10.avif'],
        basePrice: '125.00',
        salePrice: '99.99',
    },
    {
        name: 'Dunk Low Retro',
        description:
            'Created for the hardwood but taken to the streets, the 80s basketball icon returns with perfectly shined overlays.',
        category: 'lifestyle',
        gender: 'unisex',
        images: ['shoe-11.avif'],
        basePrice: '110.00',
        salePrice: null,
    },
    {
        name: 'Air Max 90',
        description:
            'Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots.',
        category: 'lifestyle',
        gender: 'men',
        images: ['shoe-12.avif'],
        basePrice: '130.00',
        salePrice: '109.99',
    },
    {
        name: 'Free RN 5.0',
        description:
            'The Nike Free RN 5.0 is designed to give you a barefoot-like feel with the protection and traction you need.',
        category: 'running',
        gender: 'women',
        images: ['shoe-13.avif'],
        basePrice: '100.00',
        salePrice: null,
    },
    {
        name: 'Kyrie Infinity',
        description:
            'The Kyrie Infinity is designed to take your game to the next level with its lightweight, responsive cushioning.',
        category: 'basketball',
        gender: 'men',
        images: ['shoe-14.avif'],
        basePrice: '130.00',
        salePrice: '104.99',
    },
    {
        name: 'Cortez',
        description:
            'The Nike Cortez is a classic running shoe that has transcended its original purpose to become a lifestyle icon.',
        category: 'lifestyle',
        gender: 'unisex',
        images: ['shoe-15.avif'],
        basePrice: '75.00',
        salePrice: null,
    },
];

async function seed() {
    console.log('🌱 Starting database seed...\n');

    try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('✅ Created uploads directory\n');
        }

        // Clean up .avif and .webp files from uploads directory
        console.log('🧹 Cleaning up .avif, .webp and .jpg files...');
        const files = fs.readdirSync(uploadsDir);
        let deletedCount = 0;
        for (const file of files) {
            if (
                file.endsWith('.avif') ||
                file.endsWith('.webp') ||
                file.endsWith('.jpg')
            ) {
                fs.unlinkSync(path.join(uploadsDir, file));
                deletedCount++;
            }
        }
        console.log(`✅ Deleted ${deletedCount} .avif, .webp and .jpg files\n`);

        console.log('📊 Seeding genders...');
        let genders = await db
            .insert(schema.genders)
            .values(gendersData)
            .onConflictDoNothing()
            .returning();
        if (genders.length === 0) {
            genders = await db.select().from(schema.genders);
        }
        console.log(`✅ Seeded ${genders.length} genders\n`);

        console.log('🎨 Seeding colors...');
        let colors = await db
            .insert(schema.colors)
            .values(colorsData)
            .onConflictDoNothing()
            .returning();
        if (colors.length === 0) {
            colors = await db.select().from(schema.colors);
        }
        console.log(`✅ Seeded ${colors.length} colors\n`);

        console.log('📏 Seeding sizes...');
        let sizes = await db
            .insert(schema.sizes)
            .values(sizesData)
            .onConflictDoNothing()
            .returning();
        if (sizes.length === 0) {
            sizes = await db.select().from(schema.sizes);
        }
        console.log(`✅ Seeded ${sizes.length} sizes\n`);

        console.log('🏷️  Seeding brands...');
        let brands = await db
            .insert(schema.brands)
            .values(brandsData)
            .onConflictDoNothing()
            .returning();
        if (brands.length === 0) {
            brands = await db.select().from(schema.brands);
        }
        console.log(`✅ Seeded ${brands.length} brands\n`);

        console.log('📁 Seeding categories...');
        let categories = await db
            .insert(schema.categories)
            .values(categoriesData)
            .onConflictDoNothing()
            .returning();
        if (categories.length === 0) {
            categories = await db.select().from(schema.categories);
        }
        console.log(`✅ Seeded ${categories.length} categories\n`);

        console.log('🗂️  Seeding collections...');
        let collections = await db
            .insert(schema.collections)
            .values(collectionsData)
            .onConflictDoNothing()
            .returning();
        if (collections.length === 0) {
            collections = await db.select().from(schema.collections);
        }
        console.log(`✅ Seeded ${collections.length} collections\n`);

        console.log('👟 Seeding products and variants...');
        const nikeBrand = brands.find((b) => b.slug === 'nike')!;

        for (const productData of productsData) {
            const category = categories.find(
                (c) => c.slug === productData.category,
            )!;
            const gender = genders.find((g) => g.slug === productData.gender)!;

            // Check if product already exists
            const existingProduct = await db
                .select()
                .from(schema.products)
                .where(eq(schema.products.name, productData.name))
                .limit(1);

            if (existingProduct.length > 0) {
                console.log(
                    `  ⏭️  Skipped existing product: ${productData.name}`,
                );
                continue;
            }

            const [product] = await db
                .insert(schema.products)
                .values({
                    name: productData.name,
                    description: productData.description,
                    categoryId: category.id,
                    genderId: gender.id,
                    brandId: nikeBrand.id,
                    isPublished: true,
                })
                .returning();

            console.log(`  ✓ Created product: ${product.name}`);

            const productImages: string[] = [];
            for (const imageName of productData.images) {
                const sourcePath = path.join(
                    process.cwd(),
                    'public',
                    'shoes',
                    imageName,
                );
                const destPath = path.join(
                    uploadsDir,
                    `${uuidv4()}-${imageName}`,
                );

                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, destPath);
                    const publicUrl = `/uploads/${path.basename(destPath)}`;
                    productImages.push(publicUrl);
                }
            }

            const numColors = Math.floor(Math.random() * 3) + 2;
            const selectedColors = colors
                .sort(() => 0.5 - Math.random())
                .slice(0, numColors);

            const numSizes = Math.floor(Math.random() * 6) + 5;
            const selectedSizes = sizes
                .sort(() => 0.5 - Math.random())
                .slice(0, numSizes);

            let firstVariantId: string | null = null;

            for (const color of selectedColors) {
                for (const size of selectedSizes) {
                    const sku = `${product.name.replace(/\s+/g, '-').toLowerCase()}-${color.slug.toLowerCase()}-${size.slug.toLowerCase()}`;
                    const stock = Math.floor(Math.random() * 50) + 10;

                    const [variant] = await db
                        .insert(schema.productVariants)
                        .values({
                            productId: product.id,
                            sku,
                            price: productData.basePrice,
                            salePrice: productData.salePrice,
                            colorId: color.id,
                            sizeId: size.id,
                            inStock: stock.toString(),
                            weight: (Math.random() * 0.5 + 0.3).toFixed(2),
                            dimensions: JSON.stringify({
                                length: 30,
                                width: 20,
                                height: 12,
                            }),
                        })
                        .returning();

                    if (!firstVariantId) {
                        firstVariantId = variant.id;
                    }
                }
            }

            if (firstVariantId) {
                await db
                    .update(schema.products)
                    .set({ defaultVariantId: firstVariantId })
                    .where(eq(schema.products.id, product.id));
            }

            for (let i = 0; i < productImages.length; i++) {
                await db.insert(schema.productImages).values({
                    productId: product.id,
                    variantId: null,
                    url: productImages[i],
                    sortOrder: i.toString(),
                    isPrimary: i === 0,
                });
            }

            const numCollections = Math.floor(Math.random() * 2) + 1;
            const selectedCollections = collections
                .sort(() => 0.5 - Math.random())
                .slice(0, numCollections);

            for (const collection of selectedCollections) {
                await db.insert(schema.productCollections).values({
                    productId: product.id,
                    collectionId: collection.id,
                });
            }
        }

        console.log(
            `✅ Seeded ${productsData.length} products with variants\n`,
        );
        console.log('🎉 Database seed completed successfully!\n');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seed();
