import Link from 'next/link';
import { getRecommendedProducts } from '@/lib/actions/product';
import { Card } from '@/components';

interface RecommendedProductsProps {
    productId: string;
}

export async function RecommendedProducts({
    productId,
}: RecommendedProductsProps) {
    const products = await getRecommendedProducts(productId);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="bg-light-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-heading-3 font-bold text-dark-900 mb-6">
                    You Might Also Like
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
