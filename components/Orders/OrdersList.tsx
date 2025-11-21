'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderItem {
    id: string;
    quantity: string;
    priceAtPurchase: string;
    productVariant: {
        product: {
            name: string;
            images: Array<{ url: string }>;
        };
    };
}

interface Order {
    id: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    items: OrderItem[];
}

interface OrdersListProps {
    orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                    No tienes pedidos aún
                </h2>
                <p className="text-gray-600 mb-6">
                    Cuando realices tu primera compra, aparecerá aquí
                </p>
                <Link
                    href="/products"
                    className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                const firstItem = order.items[0];
                const itemCount = order.items.length;
                const totalItems = order.items.reduce(
                    (sum, item) => sum + parseInt(item.quantity),
                    0,
                );

                // Calcular el total correcto (subtotal + shipping + tax)
                const subtotal = order.items.reduce((sum, item) => {
                    return (
                        sum +
                        parseFloat(item.priceAtPurchase) *
                            parseInt(item.quantity)
                    );
                }, 0);
                const shipping = subtotal > 100 ? 0 : 10;
                const tax = subtotal * 0.08;
                const calculatedTotal = (subtotal + shipping + tax).toFixed(2);

                return (
                    <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start gap-6">
                            {/* Imagen del primer producto */}
                            <div className="shrink-0">
                                {firstItem?.productVariant.product.images[0]
                                    ?.url ? (
                                    <Image
                                        src={
                                            firstItem.productVariant.product
                                                .images[0].url
                                        }
                                        alt={
                                            firstItem.productVariant.product
                                                .name
                                        }
                                        width={120}
                                        height={120}
                                        className="rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-[120px] h-[120px] bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Información del pedido */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Pedido #{order.id.slice(0, 8)}
                                        </p>
                                        <h3 className="font-semibold text-lg mb-1">
                                            {firstItem?.productVariant.product
                                                .name || 'Producto'}
                                            {itemCount > 1 &&
                                                ` y ${itemCount - 1} más`}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {totalItems}{' '}
                                            {totalItems === 1
                                                ? 'artículo'
                                                : 'artículos'}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <OrderStatusBadge status={order.status} />
                                    <span className="text-sm text-gray-500">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-lg font-semibold">
                                        Total: ${calculatedTotal}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
