import { jsPDF } from 'jspdf';
import type { Translations } from '@/lib/i18n/types';

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

export async function generateInvoicePDF(
    data: InvoiceData,
    orderNumber: string,
    translations: Translations,
    locale: 'en' | 'es' = 'es',
): Promise<void> {
    const t = translations.orders.invoice;

    const getStatusLabel = (status: string): string => {
        return t.statuses[status as keyof typeof t.statuses] || status;
    };
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
    doc.text(t.title, 150, yPos);
    yPos += 10;

    // Info factura
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t.number}: ${order.id.slice(0, 8).toUpperCase()}`, 150, yPos);
    yPos += 5;
    doc.text(
        `${t.date}: ${new Date(order.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}`,
        150,
        yPos,
    );
    yPos += 5;
    doc.text(`${t.status}: ${getStatusLabel(order.status)}`, 150, yPos);
    yPos += 10;

    // Línea
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Cliente
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.billedTo}:`, 20, yPos);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
    doc.text(user.name || t.customer, 20, yPos);
    yPos += 5;
    doc.text(user.email, 20, yPos);

    // Dirección
    let rightYPos = yPos - 11;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.shippingAddressLabel}:`, 110, rightYPos);
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
    doc.text(t.productsTitle, 20, yPos);
    yPos += 8;

    // Headers tabla
    doc.setFillColor(0, 0, 0);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(t.product, 22, yPos);
    doc.text(t.details, 80, yPos);
    doc.text(t.qty, 130, yPos);
    doc.text(t.price, 150, yPos);
    doc.text(t.total, 175, yPos);
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
    doc.text(`${t.subtotal}:`, 130, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, 175, yPos, { align: 'right' });
    yPos += 6;

    doc.text(`${t.shipping}:`, 130, yPos);
    if (shipping === 0) {
        doc.setTextColor(74, 222, 128);
        doc.text(t.free, 175, yPos, { align: 'right' });
        doc.setTextColor(0, 0, 0);
    } else {
        doc.text(`$${shipping.toFixed(2)}`, 175, yPos, { align: 'right' });
    }
    yPos += 6;

    doc.text(`${t.taxRate}:`, 130, yPos);
    doc.text(`$${tax.toFixed(2)}`, 175, yPos, { align: 'right' });
    yPos += 8;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(110, yPos, 190, yPos);
    yPos += 8;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.grandTotal}:`, 130, yPos);
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
    doc.text(t.thankYouMessage, 105, yPos, {
        align: 'center',
    });
    yPos += 5;
    doc.text(t.supportMessage, 105, yPos, { align: 'center' });
    yPos += 6;
    doc.setFontSize(9);
    doc.text(t.validInvoice, 105, yPos, {
        align: 'center',
    });

    // Guardar PDF
    const fileName = locale === 'es' ? 'factura' : 'invoice';
    doc.save(`${fileName}-${orderNumber}.pdf`);
}
