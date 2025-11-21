import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/actions';
import { getOrder } from '@/lib/actions/orders';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ orderId: string }> },
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 },
            );
        }

        const { orderId } = await context.params;
        const result = await getOrder(orderId);

        if (!result.success || !result.data) {
            return NextResponse.json(
                { error: 'Pedido no encontrado' },
                { status: 404 },
            );
        }

        // Verificar que el pedido pertenece al usuario
        if (result.data.order.userId !== user.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 },
            );
        }

        // Retornar los datos para generar el PDF en el cliente
        return NextResponse.json({
            order: result.data.order,
            items: result.data.items,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error al obtener datos de factura:', error);
        return NextResponse.json(
            { error: 'Error al obtener datos de la factura' },
            { status: 500 },
        );
    }
}
