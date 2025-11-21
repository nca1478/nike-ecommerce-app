'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DownloadInvoiceButtonProps {
    orderId: string;
    orderNumber: string;
}

export function DownloadInvoiceButton({
    orderId,
    orderNumber,
}: DownloadInvoiceButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

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

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            // Obtener los datos de la orden
            const response = await fetch(`/api/orders/${orderId}/invoice`);

            if (!response.ok) {
                throw new Error('Error al obtener datos de la factura');
            }

            const data = await response.json();

            // Importar jsPDF dinámicamente
            const { jsPDF } = await import('jspdf');

            // Generar PDF
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const { order, items, user } = data;

            const subtotal = items.reduce(
                (sum: number, item: any) => sum + item.price * item.quantity,
                0,
            );
            const tax = subtotal * 0.1;
            const total = parseFloat(order.totalAmount);

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
            items.forEach((item: any, index: number) => {
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
                doc.text(
                    `$${(item.price * item.quantity).toFixed(2)}`,
                    175,
                    yPos,
                );

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
            doc.setTextColor(74, 222, 128);
            doc.text('Gratis', 175, yPos, { align: 'right' });
            doc.setTextColor(0, 0, 0);
            yPos += 6;

            doc.text('Impuestos (10%):', 130, yPos);
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

            toast.success('Factura descargada correctamente');
        } catch (error) {
            console.error('Error al descargar factura:', error);
            toast.error('Error al descargar la factura');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black border-2 border-black px-6 py-3 rounded-full hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
        >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Descargando...' : 'Descargar Factura'}
        </button>
    );
}
