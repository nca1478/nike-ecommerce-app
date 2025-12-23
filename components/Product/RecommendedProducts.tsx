'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRecommendedProducts } from '@/lib/actions/product';
import { Card } from '@/components';
import { useI18n } from '@/lib/i18n/context';

interface RecommendedProductsProps {
    productId: string;
}

export function RecommendedProducts({ productId }: RecommendedProductsProps) {
    const { t } = useI18n();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const recommendedProducts =
                    await getRecommendedProducts(productId);
                setProducts(recommendedProducts);
            } catch (error) {
                console.error('Error loading recommended products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, [productId]);

    if (loading) {
        return (
            <div className="bg-light-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-96 bg-gray-300 rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="bg-light-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-heading-3 font-bold text-dark-900 mb-6">
                    {t.products.recommended}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const price = parseFloat(product.price);
                        const salePrice = product.salePrice
                            ? parseFloat(product.salePrice)
                            : null;
                        const displayPrice = salePrice || price;

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                            >
                                <Card
                                    title={product.name}
                                    description={product.category}
                                    image={product.primaryImage || ''}
                                    price={displayPrice}
                                    category={product.brand}
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
