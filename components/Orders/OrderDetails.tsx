'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { ReorderButton } from './ReorderButton';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';

interface OrderItem {
    id: string;
    productName: string;
    productImage: string;
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
    billingAddress: Address;
}

interface OrderDetailsProps {
    order: Order;
    items: OrderItem[];
}

export function OrderDetails({ order, items }: OrderDetailsProps) {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const tax = subtotal * 0.1; // 10% de impuesto

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a mis pedidos
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Pedido #{order.id.slice(0, 8)}
                        </h1>
                        <p className="text-gray-600">
                            Realizado el{' '}
                            {new Date(order.createdAt).toLocaleDateString(
                                'es-ES',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                },
                            )}
                        </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Timeline de estado */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Estado del Pedido
                        </h2>
                        <OrderTimeline status={order.status} />
                    </div>

                    {/* Productos */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Productos ({items.length})
                        </h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                >
                                    {item.productImage ? (
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            width={100}
                                            height={100}
                                            className="rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-[100px] h-[100px] bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Package className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">
                                            {item.productName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Talla: {item.size} | Color:{' '}
                                            {item.color}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ${item.price.toFixed(2)} c/u
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dirección de envío */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Dirección de Envío
                        </h2>
                        <div className="text-gray-700">
                            <p>{order.shippingAddress.line1}</p>
                            {order.shippingAddress.line2 && (
                                <p>{order.shippingAddress.line2}</p>
                            )}
                            <p>
                                {order.shippingAddress.city},{' '}
                                {order.shippingAddress.state}{' '}
                                {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Resumen */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Envío</span>
                                <span className="text-green-600">Gratis</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Impuestos</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-3">
                        <ReorderButton items={items} />
                        <DownloadInvoiceButton
                            orderId={order.id}
                            orderNumber={order.id.slice(0, 8)}
                        />
                    </div>

                    {/* Ayuda */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold mb-2">
                            ¿Necesitas ayuda?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Contáctanos si tienes alguna pregunta sobre tu
                            pedido
                        </p>
                        <a
                            href="/contact"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Contactar soporte
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
