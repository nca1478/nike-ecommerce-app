import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/actions';
import { getOrder } from '@/lib/actions/orders';
import { generateInvoicePDF } from '@/lib/utils/pdf';

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

        // Generar PDF
        const pdfBuffer = await generateInvoicePDF(
            result.data.order,
            result.data.items,
            user,
        );

        // Retornar PDF
        return new NextResponse(pdfBuffer as BodyInit, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="factura-${orderId.slice(0, 8)}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error al generar factura:', error);
        return NextResponse.json(
            { error: 'Error al generar la factura' },
            { status: 500 },
        );
    }
}
