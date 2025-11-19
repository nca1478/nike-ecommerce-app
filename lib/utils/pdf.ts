/**
 * Generador de facturas en PDF
 * Genera un PDF simple con HTML y CSS
 */

interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
}

interface Address {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface Order {
    id: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    shippingAddress: Address;
}

interface User {
    name?: string | null;
    email: string;
}

export async function generateInvoicePDF(
    order: Order,
    items: OrderItem[],
    user: User,
): Promise<Buffer> {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const tax = subtotal * 0.1;
    const total = parseFloat(order.totalAmount);

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #000;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-info h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .invoice-info p {
            margin: 5px 0;
            color: #666;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #000;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        .info-box {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .info-box p {
            margin: 5px 0;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background: #000;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 14px;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            margin-top: 20px;
            margin-left: auto;
            width: 300px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        .totals-row.total {
            border-top: 2px solid #000;
            margin-top: 10px;
            padding-top: 10px;
            font-weight: bold;
            font-size: 18px;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            background: #4ade80;
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">NIKE STORE</div>
        <div class="invoice-info">
            <h1>FACTURA</h1>
            <p><strong>Nº:</strong> ${order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
            <p><span class="status-badge">${getStatusLabel(order.status)}</span></p>
        </div>
    </div>

    <div class="info-grid">
        <div class="info-box">
            <h2>Facturado a:</h2>
            <p><strong>${user.name || 'Cliente'}</strong></p>
            <p>${user.email}</p>
        </div>
        <div class="info-box">
            <h2>Dirección de Envío:</h2>
            <p>${order.shippingAddress.line1}</p>
            ${order.shippingAddress.line2 ? `<p>${order.shippingAddress.line2}</p>` : ''}
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
            <p>${order.shippingAddress.country}</p>
        </div>
    </div>

    <div class="section">
        <h2>Productos</h2>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Detalles</th>
                    <th class="text-right">Cantidad</th>
                    <th class="text-right">Precio Unit.</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${items
                    .map(
                        (item) => `
                    <tr>
                        <td>${item.productName}</td>
                        <td>Talla: ${item.size} | Color: ${item.color}</td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-right">$${item.price.toFixed(2)}</td>
                        <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `,
                    )
                    .join('')}
            </tbody>
        </table>
    </div>

    <div class="totals">
        <div class="totals-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="totals-row">
            <span>Envío:</span>
            <span style="color: #4ade80;">Gratis</span>
        </div>
        <div class="totals-row">
            <span>Impuestos (10%):</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="totals-row total">
            <span>TOTAL:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    </div>

    <div class="footer">
        <p>Gracias por tu compra en Nike Store</p>
        <p>Para cualquier consulta, contáctanos en support@nikestore.com</p>
        <p style="margin-top: 10px;">Este documento es una factura válida</p>
    </div>
</body>
</html>
    `;

    // En producción, usarías una librería como puppeteer o pdfkit
    // Por ahora, retornamos el HTML como buffer
    // Para una implementación real, instala: npm install puppeteer
    return Buffer.from(html, 'utf-8');
}

function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        paid: 'Pagado',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
    };
    return labels[status] || status;
}
