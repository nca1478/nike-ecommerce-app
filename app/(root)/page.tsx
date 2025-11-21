import { FeatureSection } from '@/components';
import { getAllProducts } from '@/lib/actions/product';
import { HeroSection } from '@/components/Home/HeroSection';
import { TrendingSection } from '@/components/Home/TrendingSection';
import { HomeContent } from '@/components/Home/HomeContent';

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
            <HomeContent products={products} />

            {/* Trending Now Section */}
            <TrendingSection />

            {/* Nike React Presto Section */}
            <FeatureSection />
        </div>
    );
}
