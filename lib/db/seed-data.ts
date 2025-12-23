// Seed data
export const gendersData = [
    { label: 'Men', slug: 'men' },
    { label: 'Women', slug: 'women' },
    { label: 'Unisex', slug: 'unisex' },
    { label: 'Kids', slug: 'kids' },
];

export const colorsData = [
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

export const sizesData = [
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

export const brandsData = [
    { name: 'Nike', slug: 'nike', logoUrl: '/logo.svg' },
];

export const categoriesData = [
    { name: 'Running', slug: 'running', parentId: null },
    { name: 'Basketball', slug: 'basketball', parentId: null },
    { name: 'Training', slug: 'training', parentId: null },
    { name: 'Lifestyle', slug: 'lifestyle', parentId: null },
    { name: 'Soccer', slug: 'soccer', parentId: null },
];

export const collectionsData = [
    { name: 'Summer 2025', slug: 'summer-2025' },
    { name: 'Best Sellers', slug: 'best-sellers' },
    { name: 'New Arrivals', slug: 'new-arrivals' },
];

export const productsData = [
    {
        name: 'Air Max 270',
        description:
            'Nike first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.',
        category: 'lifestyle',
        gender: 'unisex',
        folder: 'shoe-1',
        colorVariants: ['black', 'blue', 'green', 'red'],
        basePrice: '150.00',
        salePrice: null,
    },
    {
        name: 'React Infinity Run',
        description:
            'A pioneer in the running world, the Nike React Infinity Run Flyknit 3 is designed to help reduce injury.',
        category: 'running',
        gender: 'men',
        folder: 'shoe-2',
        colorVariants: ['grey', 'orange', 'purple', 'yellow'],
        basePrice: '160.00',
        salePrice: '129.99',
    },
    {
        name: 'Air Force 1',
        description:
            'The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best.',
        category: 'lifestyle',
        gender: 'unisex',
        folder: 'shoe-3',
        colorVariants: ['blue', 'brown', 'orange', 'red'],
        basePrice: '110.00',
        salePrice: null,
    },
    {
        name: 'ZoomX Vaporfly',
        description:
            'Continue your running journey in the Nike ZoomX Vaporfly NEXT% 3. Engineered to the exact specifications of championship athletes.',
        category: 'running',
        gender: 'men',
        folder: 'shoe-4',
        colorVariants: ['black', 'blue', 'green', 'white'],
        basePrice: '250.00',
        salePrice: '199.99',
    },
    {
        name: 'Pegasus 40',
        description:
            'A springy ride for every run, the Pegasus 40 returns with improved comfort and responsiveness.',
        category: 'running',
        gender: 'women',
        folder: 'shoe-5',
        colorVariants: ['brown', 'pink', 'white', 'yellow'],
        basePrice: '130.00',
        salePrice: null,
    },
    {
        name: 'LeBron 21',
        description:
            'Created for the most powerful player in the game, the LeBron 21 is made for the all-around player.',
        category: 'basketball',
        gender: 'men',
        folder: 'shoe-6',
        colorVariants: ['blue', 'green', 'grey', 'yellow'],
        basePrice: '200.00',
        salePrice: '169.99',
    },
    {
        name: 'Metcon 9',
        description:
            'The Nike Metcon 9 combines stability, durability and versatility to stand up to serious strength training.',
        category: 'training',
        gender: 'unisex',
        folder: 'shoe-7',
        colorVariants: ['green', 'orange', 'red', 'yellow'],
        basePrice: '150.00',
        salePrice: null,
    },
    {
        name: 'Mercurial Superfly 9',
        description:
            'The Nike Mercurial Superfly 9 Elite FG is made for the player who demands speed.',
        category: 'soccer',
        gender: 'men',
        folder: 'shoe-8',
        colorVariants: ['black', 'blue', 'orange', 'white'],
        basePrice: '275.00',
        salePrice: '229.99',
    },
    {
        name: 'Blazer Mid 77',
        description:
            'In the 70s, Nike was the new shoe on the block. The Nike Blazer Mid 77 Vintage returns with a classic look.',
        category: 'lifestyle',
        gender: 'unisex',
        folder: 'shoe-9',
        colorVariants: ['brown', 'green', 'grey', 'purple'],
        basePrice: '100.00',
        salePrice: null,
    },
    {
        name: 'Air Jordan 1 Mid',
        description:
            'Inspired by the original AJ1, the Air Jordan 1 Mid offers fans a chance to follow in MJ footsteps.',
        category: 'basketball',
        gender: 'unisex',
        folder: 'shoe-10',
        colorVariants: ['blue', 'pink', 'red', 'yellow'],
        basePrice: '125.00',
        salePrice: '99.99',
    },
    {
        name: 'Dunk Low Retro',
        description:
            'Created for the hardwood but taken to the streets, the 80s basketball icon returns with perfectly shined overlays.',
        category: 'lifestyle',
        gender: 'unisex',
        folder: 'shoe-11',
        colorVariants: ['blue', 'green', 'pink', 'purple'],
        basePrice: '110.00',
        salePrice: null,
    },
    {
        name: 'Sonic Fly',
        description:
            'Fast-paced lifestyle shoe for active kids who love adventure. Lightweight design with vibrant colors.',
        category: 'lifestyle',
        gender: 'kids',
        folder: 'shoe-16',
        colorVariants: ['black', 'blue', 'orange', 'purple'],
        basePrice: '67.00',
        salePrice: null,
    },
    {
        name: 'Cosmic Runner',
        description:
            'Out-of-this-world running shoe designed for young athletes. Comfortable fit with stellar performance.',
        category: 'running',
        gender: 'kids',
        folder: 'shoe-17',
        colorVariants: ['blue', 'green', 'pink', 'red'],
        basePrice: '52.00',
        salePrice: null,
    },
    {
        name: 'Flex Runner 4',
        description:
            'Flexible running shoe that moves with growing feet. Perfect for playground adventures and sports.',
        category: 'running',
        gender: 'kids',
        folder: 'shoe-18',
        colorVariants: ['black', 'green', 'grey', 'pink'],
        basePrice: '45.00',
        salePrice: null,
    },
    {
        name: 'Air Max 270 Mini',
        description:
            'Junior version of the iconic Air Max with maximum comfort. Built for young basketball enthusiasts.',
        category: 'basketball',
        gender: 'kids',
        folder: 'shoe-19',
        colorVariants: ['blue', 'grey', 'pink', 'white'],
        basePrice: '132.00',
        salePrice: null,
    },
    {
        name: 'Air Max 90',
        description:
            'Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots.',
        category: 'lifestyle',
        gender: 'men',
        folder: 'shoe-12',
        colorVariants: ['blue', 'green', 'grey', 'white'],
        basePrice: '130.00',
        salePrice: '109.99',
    },
    {
        name: 'Free RN 5.0',
        description:
            'The Nike Free RN 5.0 is designed to give you a barefoot-like feel with the protection and traction you need.',
        category: 'running',
        gender: 'women',
        folder: 'shoe-13',
        colorVariants: ['black', 'blue', 'brown', 'white'],
        basePrice: '100.00',
        salePrice: null,
    },
    {
        name: 'Kyrie Infinity',
        description:
            'The Kyrie Infinity is designed to take your game to the next level with its lightweight, responsive cushioning.',
        category: 'basketball',
        gender: 'men',
        folder: 'shoe-14',
        colorVariants: ['blue', 'orange', 'red', 'yellow'],
        basePrice: '130.00',
        salePrice: '104.99',
    },
    {
        name: 'Cortez',
        description:
            'The Nike Cortez is a classic running shoe that has transcended its original purpose to become a lifestyle icon.',
        category: 'lifestyle',
        gender: 'unisex',
        folder: 'shoe-15',
        colorVariants: ['black', 'brown', 'green', 'purple'],
        basePrice: '75.00',
        salePrice: null,
    },
];
