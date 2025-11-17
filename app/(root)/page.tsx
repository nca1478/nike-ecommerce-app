import Link from 'next/link';
import { Card, FeatureSection } from '@/components';
import { getAllProducts } from '@/lib/actions/product';
import { HeroSection } from '@/components/Home/HeroSection';
import { TrendingSection } from '@/components/Home/TrendingSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
    // Fetch latest products from database
    const { products } = await getAllProducts({
        page: 1,
        limit: 3,
        sortBy: 'latest',
    });

    return (
        <div className="min-h-screen bg-light-200">
            {/* Hero Section */}
            <HeroSection />

            {/* Latest Shoes Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-heading-2 font-bold text-dark-900 mb-8">
                    Latest shoes
                </h2>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                            >
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
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-body text-dark-700">
                            No products available at the moment.
                        </p>
                    </div>
                )}
            </section>

            {/* Trending Now Section */}
            <TrendingSection />

            {/* Nike React Presto Section */}
            <FeatureSection />
        </div>
    );
}
