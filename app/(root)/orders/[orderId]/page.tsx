import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import { getOrder } from '@/lib/actions/orders';
import { OrderDetails } from '@/components/Orders/OrderDetails';
import { OrderNotFound } from '@/components/Orders/OrderDetailPageContent';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Order Details | Nike Store',
    description: 'Detailed information about your order',
};

interface OrderDetailPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function OrderDetailPage({
    params,
}: OrderDetailPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/sign-in?redirect=/orders');
    }

    const { orderId } = await params;
    const result = await getOrder(orderId);

    if (!result.success || !result.data) {
        return <OrderNotFound error={result.error} />;
    }

    // Verificar que el pedido pertenece al usuario
    if (result.data.order.userId !== user.id) {
        redirect('/orders');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <OrderDetails order={result.data.order} items={result.data.items} />
        </div>
    );
}
