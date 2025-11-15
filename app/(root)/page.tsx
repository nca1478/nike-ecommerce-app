import { Card } from '@/components';
import { latestShoes } from '@/data';
import { getCurrentUser } from '@/lib/auth/actions';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const user = await getCurrentUser();

    console.log({ user });

    return (
        <div className="min-h-screen bg-light-200">
            {/* Latest Shoes Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-heading-2 font-bold text-dark-900 mb-8">
                    Latest shoes
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestShoes.map((shoe) => (
                        <Card
                            key={shoe.id}
                            title={shoe.title}
                            description={shoe.description}
                            image={shoe.image}
                            price={shoe.price}
                            category={shoe.category}
                            badge={shoe.badge}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
