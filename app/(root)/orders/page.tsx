import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import { getUserOrders } from '@/lib/actions/orders';
import { OrdersList } from '@/components/Orders/OrdersList';

export const metadata = {
    title: 'Mis Pedidos | Nike Store',
    description: 'Historial de pedidos y seguimiento de envíos',
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Mis Pedidos</h1>
                <p className="text-gray-600">
                    Revisa el estado de tus pedidos y realiza seguimiento de
                    envíos
                </p>
            </div>

            <OrdersList orders={result.data} />
        </div>
    );
}
