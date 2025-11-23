'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { ReorderButton } from './ReorderButton';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';
import { useI18n } from '@/lib/i18n';

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
    const { t, locale } = useI18n();
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% de impuesto
    const calculatedTotal = (subtotal + shipping + tax).toFixed(2);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t.orders.backToOrders}
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {t.orders.orderNumber} #{order.id.slice(0, 8)}
                        </h1>
                        <p className="text-gray-600">
                            {t.orders.placedOn}{' '}
                            {new Date(order.createdAt).toLocaleDateString(
                                locale === 'es' ? 'es-ES' : 'en-US',
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
                            {t.orders.orderStatus}
                        </h2>
                        <OrderTimeline status={order.status} />
                    </div>

                    {/* Products */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {t.orders.products} ({items.length})
                            </h2>
                            {/* Precios en móvil - alineados con el título */}
                            <div className="md:hidden text-right">
                                {items.map((item) => (
                                    <div key={item.id}>
                                        <p className="font-semibold">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ${item.price.toFixed(2)}{' '}
                                            {t.orders.each}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                                            {t.cart.size}: {item.size}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {t.cart.color}: {item.color}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t.orders.quantity}: {item.quantity}
                                        </p>
                                    </div>
                                    {/* Precios en desktop - posición original */}
                                    <div className="hidden md:block text-right">
                                        <p className="font-semibold">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ${item.price.toFixed(2)}{' '}
                                            {t.orders.each}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dirección de envío */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {t.orders.shippingAddress}
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
                        <h2 className="text-xl font-semibold mb-4">
                            {t.orders.summary}
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>{t.cart.subtotal}</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>{t.cart.shipping}</span>
                                <span
                                    className={
                                        shipping === 0 ? 'text-green-600' : ''
                                    }
                                >
                                    {shipping === 0
                                        ? t.cart.free
                                        : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>{t.cart.tax}</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>{t.cart.total}</span>
                                    <span>${calculatedTotal}</span>
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
                            {t.orders.needHelp}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {t.orders.needHelpDescription}
                        </p>
                        <a
                            href="/contact"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            {t.orders.contactSupport}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
