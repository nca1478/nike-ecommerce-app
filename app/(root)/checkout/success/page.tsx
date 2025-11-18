import Link from 'next/link';
import { stripe } from '@/lib/stripe/client';
import { getOrder } from '@/lib/actions/orders';
import OrderSuccess from '@/components/Cart/OrderSuccess';

interface PageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const sessionId = params.session_id;

    if (!sessionId) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    No se encontró la sesión
                </h1>
                <p className="text-gray-600">
                    No se pudo encontrar la información de tu pedido.
                </p>
            </div>
        );
    }

    try {
        // Obtener sesión de Stripe con payment_intent expandido
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent'],
        });

        if (!session || session.payment_status !== 'paid') {
            return (
                <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Pago pendiente</h1>
                    <p className="text-gray-600">
                        Tu pago aún no ha sido confirmado. Por favor, espera
                        unos momentos.
                    </p>
                </div>
            );
        }

        // Obtener el payment_intent ID
        const paymentIntentId =
            typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id;

        if (!paymentIntentId) {
            return (
                <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Procesando tu pedido...
                    </h1>
                    <p className="text-gray-600">
                        Tu pago ha sido confirmado. Estamos procesando tu
                        pedido.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        Recibirás un correo de confirmación en breve.
                    </p>
                </div>
            );
        }

        // Buscar pedido por transactionId (payment_intent) con reintentos
        let result = await getOrder(paymentIntentId);

        // Si no se encuentra el pedido, reintentar hasta 3 veces con delay
        let attempts = 1;
        const maxAttempts = 3;
        const delayMs = 1000; // 1 segundo entre intentos

        while ((!result.success || !result.data) && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            result = await getOrder(paymentIntentId);
            attempts++;
        }

        if (!result.success || !result.data) {
            // Si después de los reintentos no se encuentra, mostrar detalles desde Stripe
            const lineItems = await stripe.checkout.sessions.listLineItems(
                sessionId,
                { limit: 100, expand: ['data.price.product'] },
            );

            const items = lineItems.data.map((item) => {
                // Intentar obtener la imagen del producto desde Stripe
                const product = item.price?.product;
                let productImage = '';

                if (
                    product &&
                    typeof product === 'object' &&
                    'images' in product &&
                    Array.isArray(product.images) &&
                    product.images.length > 0
                ) {
                    productImage = product.images[0];
                }

                return {
                    id: item.id,
                    productName: item.description || 'Producto',
                    productImage,
                    quantity: item.quantity || 1,
                    price: (item.amount_total || 0) / 100,
                    size: '',
                    color: '',
                };
            });

            const total = (session.amount_total || 0) / 100;

            return (
                <OrderSuccess
                    orderId={paymentIntentId.slice(0, 8)}
                    items={items}
                    total={total}
                    orderDate={new Date()}
                />
            );
        }

        const { order, items } = result.data;

        return (
            <OrderSuccess
                orderId={order.id}
                items={items}
                total={parseFloat(order.totalAmount)}
                orderDate={new Date(order.createdAt)}
            />
        );
    } catch (error) {
        console.error('Error loading order:', error);

        // En lugar de redirigir, mostrar una página de error amigable
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-600">
                    Error al cargar el pedido
                </h1>
                <p className="text-gray-600 mb-4">
                    Hubo un problema al cargar los detalles de tu pedido, pero
                    tu pago fue procesado correctamente.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    Recibirás un correo de confirmación en breve con los
                    detalles de tu pedido.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800"
                >
                    Volver al inicio
                </Link>
            </div>
        );
    }
}
