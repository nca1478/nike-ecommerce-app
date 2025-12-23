import 'dotenv/config';
import * as fs from 'fs';
import { Pool } from 'pg';
import * as path from 'path';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import {
    gendersData,
    colorsData,
    sizesData,
    brandsData,
    categoriesData,
    collectionsData,
    productsData,
} from '../data/seed.data';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function seed() {
    console.log('🌱 Starting database seed...\n');

    try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('✅ Created uploads directory\n');
        }

        // Clean up .avif, .webp and .jpg files from uploads directory
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

            // Get the specific colors for this product
            const productColors = colors.filter((color) =>
                productData.colorVariants.includes(color.slug),
            );

            // Generate random sizes for this product
            const numSizes = Math.floor(Math.random() * 6) + 5;
            const selectedSizes = sizes
                .sort(() => 0.5 - Math.random())
                .slice(0, numSizes);

            let firstVariantId: string | null = null;
            const colorVariantMap: { [colorSlug: string]: string[] } = {}; // Map color to variant IDs

            // Create variants for each specific color
            for (
                let colorIndex = 0;
                colorIndex < productColors.length;
                colorIndex++
            ) {
                const color = productColors[colorIndex];
                colorVariantMap[color.slug] = [];

                // Create variants for each size with this color
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

                    colorVariantMap[color.slug].push(variant.id);

                    if (!firstVariantId) {
                        firstVariantId = variant.id;
                    }
                }
            }

            // Set the first variant as default
            if (firstVariantId) {
                await db
                    .update(schema.products)
                    .set({ defaultVariantId: firstVariantId })
                    .where(eq(schema.products.id, product.id));
            }

            // Process and insert images for each color variant
            for (
                let colorIndex = 0;
                colorIndex < productColors.length;
                colorIndex++
            ) {
                const color = productColors[colorIndex];

                // Copy and process image for this color variant
                const imageExtension = 'jpg'; // All are .jpg now
                const imageName = `${productData.folder}-${color.slug}.${imageExtension}`;
                const sourcePath = path.join(
                    process.cwd(),
                    'public',
                    'shoes',
                    productData.folder,
                    imageName,
                );
                const uniqueFileName = `${uuidv4()}.${imageExtension}`;
                const destPath = path.join(uploadsDir, uniqueFileName);

                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, destPath);
                    const publicUrl = `/uploads/${uniqueFileName}`;

                    // Get all variant IDs for this color
                    const variantIds = colorVariantMap[color.slug];

                    // Insert image for each variant of this color
                    for (let i = 0; i < variantIds.length; i++) {
                        const variantId = variantIds[i];
                        await db.insert(schema.productImages).values({
                            productId: product.id,
                            variantId: variantId, // Associate with specific variant
                            url: publicUrl,
                            sortOrder: colorIndex.toString(),
                            isPrimary: colorIndex === 0 && i === 0, // Only first image of first color is primary
                        });
                    }
                } else {
                    console.log(`  ⚠️  Image not found: ${sourcePath}`);
                }
            }

            // Add to random collections
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
