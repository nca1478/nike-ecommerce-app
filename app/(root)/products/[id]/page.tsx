import { Suspense } from 'react';
import { getProduct } from '@/lib/actions/product';
import { RecommendedProducts, RecommendedSkeleton } from '@/components';
import ProductPageClient from '@/components/Product/ProductPageClient';

interface ProductPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({
    params,
    searchParams,
}: ProductPageProps) {
    const { id } = await params;
    const searchParamsObj = await searchParams;
    const selectedColorId = searchParamsObj.color as string | undefined;
    const product = await getProduct(id);

    if (!product) {
        return (
            <ProductPageClient
                product={null}
                selectedColorId={selectedColorId}
            />
        );
    }

    return (
        <>
            <ProductPageClient
                product={product}
                selectedColorId={selectedColorId}
            />
            <Suspense fallback={<RecommendedSkeleton />}>
                <RecommendedProducts productId={product.id} />
            </Suspense>
        </>
    );
}
