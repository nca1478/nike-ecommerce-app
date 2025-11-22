import { Suspense } from 'react';
import { getProduct } from '@/lib/actions/product';
import { RecommendedProducts, RecommendedSkeleton } from '@/components';
import ProductPageClient from './ProductPageClient';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return <ProductPageClient product={null} />;
    }

    return (
        <>
            <ProductPageClient product={product} />
            <Suspense fallback={<RecommendedSkeleton />}>
                <RecommendedProducts productId={product.id} />
            </Suspense>
        </>
    );
}
