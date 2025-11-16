'use client';

import { Card } from './Card';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    salePrice?: number;
    category: string;
    badge?: string;
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <Card
                    key={product.id}
                    title={product.name}
                    description={product.description}
                    image={product.image}
                    price={product.salePrice || product.price}
                    category={product.category}
                    badge={product.badge}
                    onClick={() => {
                        // Navigate to product detail page
                        router.push(`/products/${product.id}`);
                    }}
                />
            ))}
        </div>
    );
}
