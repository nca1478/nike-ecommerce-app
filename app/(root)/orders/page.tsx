import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import { getUserOrders } from '@/lib/actions/orders';
import { OrdersPageContent } from '@/components/Orders/OrdersPageContent';

export const dynamic = 'force-dynamic';

// Metadata will be set dynamically based on locale
export const metadata = {
    title: 'My Orders | Nike Store',
    description: 'Order history and shipment tracking',
};

export default async function OrdersPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/sign-in?redirect=/orders');
    }

    const result = await getUserOrders(user.id);

    if (!result.success || !result.data) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Error al cargar pedidos
                    </h1>
                    <p className="text-gray-600">{result.error}</p>
                </div>
            </div>
        );
    }

    return <OrdersPageContent orders={result.data} />;
}
