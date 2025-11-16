import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProduct } from '@/lib/actions/product';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const { id } = await params;

    // Fetch product details
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Group variants by color
    const variantsByColor = product.variants.reduce(
        (acc, variant) => {
            const colorId = variant.colorId;
            if (!acc[colorId]) {
                acc[colorId] = {
                    color: variant.color,
                    variants: [],
                };
            }
            acc[colorId].variants.push(variant);
            return acc;
        },
        {} as Record<
            string,
            {
                color: (typeof product.variants)[0]['color'];
                variants: typeof product.variants;
            }
        >,
    );

    // Get images for display
    const primaryImage =
        product.images.find((img) => img.isPrimary) || product.images[0];

    return (
        <div className="min-h-screen bg-light-100">
            <div className="max-w-[1440px] mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-body text-dark-700">
                    <Link href="/" className="hover:text-dark-900">
                        Home
                    </Link>
                    {' / '}
                    <Link href="/products" className="hover:text-dark-900">
                        Products
                    </Link>
                    {' / '}
                    <span className="text-dark-900">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images Section */}
                    <div className="space-y-4">
                        {/* Primary Image */}
                        {primaryImage && (
                            <div className="relative w-full aspect-square bg-light-200 rounded-lg overflow-hidden">
                                <Image
                                    src={primaryImage.url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Thumbnail Gallery */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.slice(0, 4).map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative aspect-square bg-light-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                        <Image
                                            src={image.url}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-heading-1 font-bold text-dark-900 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-body text-dark-700 mb-4">
                                {product.category.name} • {product.gender.label}
                            </p>
                            <p className="text-heading-2 font-bold text-dark-900">
                                $
                                {parseFloat(
                                    product.variants[0]?.price || '0',
                                ).toFixed(2)}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-body text-dark-900 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h3 className="text-heading-3 font-medium text-dark-900 mb-3">
                                Select Color
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {Object.values(variantsByColor).map(
                                    ({ color }) => (
                                        <button
                                            key={color.id}
                                            className="group relative"
                                            title={color.name}
                                        >
                                            <div
                                                className="w-12 h-12 rounded-full border-2 border-dark-300 hover:border-dark-900 transition-colors"
                                                style={{
                                                    backgroundColor:
                                                        color.hexCode,
                                                }}
                                            />
                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-caption text-dark-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {color.name}
                                            </span>
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <h3 className="text-heading-3 font-medium text-dark-900 mb-3">
                                Select Size
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    ...new Set(
                                        product.variants.map((v) => v.size),
                                    ),
                                ]
                                    .sort((a, b) => a.sortOrder - b.sortOrder)
                                    .map((size) => {
                                        const hasStock = product.variants.some(
                                            (v) =>
                                                v.sizeId === size.id &&
                                                parseInt(v.inStock) > 0,
                                        );
                                        return (
                                            <button
                                                key={size.id}
                                                disabled={!hasStock}
                                                className={`py-3 px-4 border-2 rounded-lg text-body-medium transition-colors ${
                                                    hasStock
                                                        ? 'border-dark-300 hover:border-dark-900 text-dark-900'
                                                        : 'border-dark-200 text-dark-400 cursor-not-allowed line-through'
                                                }`}
                                            >
                                                {size.name}
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="w-full py-4 bg-dark-900 text-light-100 rounded-full hover:bg-dark-700 transition-colors text-body-medium font-medium">
                            Add to Cart
                        </button>

                        {/* Product Details */}
                        <div className="border-t border-dark-200 pt-6 space-y-4">
                            <div>
                                <h4 className="text-body-medium font-medium text-dark-900 mb-2">
                                    Brand
                                </h4>
                                <p className="text-body text-dark-700">
                                    {product.brand.name}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-body-medium font-medium text-dark-900 mb-2">
                                    Available Colors
                                </h4>
                                <p className="text-body text-dark-700">
                                    {Object.values(variantsByColor)
                                        .map(({ color }) => color.name)
                                        .join(', ')}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-body-medium font-medium text-dark-900 mb-2">
                                    Available Sizes
                                </h4>
                                <p className="text-body text-dark-700">
                                    {[
                                        ...new Set(
                                            product.variants.map(
                                                (v) => v.size.name,
                                            ),
                                        ),
                                    ].join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
