'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface TrendingItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    link: string;
    size?: 'large' | 'small';
}

interface TrendingSectionProps {
    items?: TrendingItem[];
}

export function TrendingSection({ items }: TrendingSectionProps) {
    const { t } = useI18n();

    const defaultItems: TrendingItem[] = [
        {
            id: '1',
            title: t.home.trending.reactPresto,
            description: t.home.trending.reactPrestoDesc,
            image: '/trending-1.png',
            link: '/trending-1.png',
            size: 'large',
        },
        {
            id: '2',
            title: t.home.trending.summerMustHaves,
            image: '/trending-2.png',
            link: '/trending-2.png',
            size: 'small',
        },
        {
            id: '3',
            title: t.home.trending.airJordan,
            image: '/trending-3.png',
            link: '/trending-3.png',
            size: 'small',
        },
    ];

    const displayItems = items || defaultItems;
    const largeItem =
        displayItems.find((item) => item.size === 'large') || displayItems[0];
    const smallItems = displayItems.filter((item) => item.size === 'small');

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-heading-2 font-bold text-dark-900 mb-8">
                {t.home.trendingNow}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Large Featured Item */}
                <div className="lg:col-span-2 relative group overflow-hidden">
                    <div className="relative h-[400px] w-full">
                        <Image
                            src={largeItem.link}
                            alt={largeItem.title}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            fill
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h3 className="text-4xl font-bold mb-2">
                                {largeItem.title}
                            </h3>
                            {largeItem.description && (
                                <p className="text-lg mb-4 max-w-md">
                                    {largeItem.description}
                                </p>
                            )}
                            <Link
                                href="/products"
                                className="inline-block bg-white text-dark-900 px-6 py-2 rounded-full font-medium cursor-pointer hover:bg-dark-900 hover:text-white transition-colors duration-300"
                            >
                                {t.home.shopNow}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Small Items Grid */}
                {smallItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        className="relative group overflow-hidden"
                    >
                        <div className="relative h-[300px] w-full">
                            <Image
                                src={item.link}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h3 className="text-2xl font-bold">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
