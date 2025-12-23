'use client';

import Link from 'next/link';
import { Card } from '@/components';
import { useI18n } from '@/lib/i18n';

interface Product {
    id: string;
    name: string;
    description: string;
    primaryImage: string | null;
    primaryColorId?: string | null;
    minPrice: string;
    category?: {
        name: string;
    } | null;
}

interface HomeContentProps {
    products: Product[];
}

export function HomeContent({ products }: HomeContentProps) {
    const { t } = useI18n();

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-heading-2 font-bold text-dark-900 mb-8">
                {t.home.latestShoes}
            </h2>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const href = product.primaryColorId
                            ? `/products/${product.id}?color=${product.primaryColorId}`
                            : `/products/${product.id}`;

                        return (
                            <Link key={product.id} href={href}>
                                <Card
                                    title={product.name}
                                    description={product.description}
                                    image={
                                        product.primaryImage ||
                                        '/placeholder-product.jpg'
                                    }
                                    price={parseFloat(product.minPrice)}
                                    category={product.category?.name}
                                />
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-body text-dark-700">
                        {t.home.noProducts}
                    </p>
                </div>
            )}
        </section>
    );
}
