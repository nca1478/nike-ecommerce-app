import { jsPDF } from 'jspdf';

interface OrderItem {
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
}

interface ShippingAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: string;
    shippingAddress: ShippingAddress;
}

interface User {
    name?: string;
    email: string;
}

interface InvoiceData {
    order: Order;
    items: OrderItem[];
    user: User;
}

const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        paid: 'Pagado',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
    };
    return labels[status] || status;
};

export async function generateInvoicePDF(
    data: InvoiceData,
    orderNumber: string,
): Promise<void> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const { order, items, user } = data;

    const subtotal = items.reduce(
        (sum: number, item: OrderItem) => sum + item.price * item.quantity,
        0,
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% de impuestos
    const total = subtotal + shipping + tax;

    let yPos = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('NIKE STORE', 20, yPos);
    doc.setFontSize(18);
    doc.text('FACTURA', 150, yPos);
    yPos += 10;

    // Info factura
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`No: ${order.id.slice(0, 8).toUpperCase()}`, 150, yPos);
    yPos += 5;
    doc.text(
        `Fecha: ${new Date(order.createdAt).toLocaleDateString('es-ES')}`,
        150,
        yPos,
    );
    yPos += 5;
    doc.text(`Estado: ${getStatusLabel(order.status)}`, 150, yPos);
    yPos += 10;

    // Línea
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Cliente
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Facturado a:', 20, yPos);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
    doc.text(user.name || 'Cliente', 20, yPos);
    yPos += 5;
    doc.text(user.email, 20, yPos);

    // Dirección
    let rightYPos = yPos - 11;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Direccion de Envio:', 110, rightYPos);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    rightYPos += 6;
    doc.text(order.shippingAddress.line1, 110, rightYPos);
    rightYPos += 5;

    if (order.shippingAddress.line2) {
        doc.text(order.shippingAddress.line2, 110, rightYPos);
        rightYPos += 5;
    }

    doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
        110,
        rightYPos,
    );
    rightYPos += 5;
    doc.text(order.shippingAddress.country, 110, rightYPos);

    yPos = Math.max(yPos, rightYPos) + 15;

    // Tabla productos
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Productos', 20, yPos);
    yPos += 8;

    // Headers tabla
    doc.setFillColor(0, 0, 0);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Producto', 22, yPos);
    doc.text('Detalles', 80, yPos);
    doc.text('Cant.', 130, yPos);
    doc.text('Precio', 150, yPos);
    doc.text('Total', 175, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Items
    doc.setFont('helvetica', 'normal');
    items.forEach((item: OrderItem, index: number) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }

        if (index % 2 === 0) {
            doc.setFillColor(249, 249, 249);
            doc.rect(20, yPos - 5, 170, 10, 'F');
        }

        const productName =
            item.productName.length > 25
                ? item.productName.substring(0, 25) + '...'
                : item.productName;
        doc.text(productName, 22, yPos);
        doc.text(`${item.size} | ${item.color}`, 80, yPos);
        doc.text(item.quantity.toString(), 135, yPos);
        doc.text(`$${item.price.toFixed(2)}`, 150, yPos);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 175, yPos);

        yPos += 10;
    });

    yPos += 5;

    // Totales
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(110, yPos, 190, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text('Subtotal:', 130, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, 175, yPos, { align: 'right' });
    yPos += 6;

    doc.text('Envio:', 130, yPos);
    if (shipping === 0) {
        doc.setTextColor(74, 222, 128);
        doc.text('Gratis', 175, yPos, { align: 'right' });
        doc.setTextColor(0, 0, 0);
    } else {
        doc.text(`$${shipping.toFixed(2)}`, 175, yPos, { align: 'right' });
    }
    yPos += 6;

    doc.text('Impuestos (8%):', 130, yPos);
    doc.text(`$${tax.toFixed(2)}`, 175, yPos, { align: 'right' });
    yPos += 8;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(110, yPos, 190, yPos);
    yPos += 8;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 130, yPos);
    doc.text(`$${total.toFixed(2)}`, 175, yPos, { align: 'right' });

    // Footer
    yPos = 270;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Gracias por tu compra en Nike Store', 105, yPos, {
        align: 'center',
    });
    yPos += 5;
    doc.text(
        'Para cualquier consulta, contactanos en support@nikestore.com',
        105,
        yPos,
        { align: 'center' },
    );
    yPos += 6;
    doc.setFontSize(9);
    doc.text('Este documento es una factura valida', 105, yPos, {
        align: 'center',
    });

    // Guardar PDF
    doc.save(`factura-${orderNumber}.pdf`);
}
