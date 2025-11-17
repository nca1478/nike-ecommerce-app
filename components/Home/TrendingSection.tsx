import Image from 'next/image';
import Link from 'next/link';

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

const defaultItems: TrendingItem[] = [
    {
        id: '1',
        title: 'REACT PRESTO',
        description: 'With React foam for the most comfortable Presto ever.',
        image: '/trending-1.png',
        link: '/trending-1.png',
        size: 'large',
    },
    {
        id: '2',
        title: 'Summer Must-Haves: Air Max Dia',
        image: '/trending-2.png',
        link: '/trending-2.png',
        size: 'small',
    },
    {
        id: '3',
        title: 'Air Jordan 11 Retro Low LE',
        image: '/trending-3.png',
        link: '/trending-3.png',
        size: 'small',
    },
];

export function TrendingSection({
    items = defaultItems,
}: TrendingSectionProps) {
    const largeItem = items.find((item) => item.size === 'large') || items[0];
    const smallItems = items.filter((item) => item.size === 'small');

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-heading-2 font-bold text-dark-900 mb-8">
                Trending Now
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Large Featured Item */}
                <Link
                    href={largeItem.link}
                    className="lg:col-span-2 relative group overflow-hidden"
                >
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
                            <button className="bg-white text-dark-900 px-6 py-2 rounded-full font-medium hover:bg-light-100 transition-colors">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </Link>

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
