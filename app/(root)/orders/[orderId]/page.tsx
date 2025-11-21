import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import { getOrder } from '@/lib/actions/orders';
import { OrderDetails } from '@/components/Orders/OrderDetails';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Detalle del Pedido | Nike Store',
    description: 'Información detallada de tu pedido',
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
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Pedido no encontrado
                    </h1>
                    <p className="text-gray-600 mb-6">{result.error}</p>
                    <Link
                        href="/orders"
                        className="text-blue-600 hover:underline"
                    >
                        Volver a mis pedidos
                    </Link>
                </div>
            </div>
        );
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
