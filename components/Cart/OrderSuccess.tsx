'use client';

import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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

interface OrderSuccessProps {
    orderId: string;
    items: OrderItem[];
    total: number;
    orderDate: Date;
}

export default function OrderSuccess({
    orderId,
    items,
    total,
    orderDate,
}: OrderSuccessProps) {
    const { t } = useI18n();

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            {/* Success Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                    {t.orders.orderConfirmed}
                </h1>
                <p className="text-gray-600">{t.orders.thankYou}</p>
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600 mb-1">
                            {t.orders.orderNumber}
                        </p>
                        <p className="font-semibold">{orderId.slice(0, 8)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1">{t.orders.date}</p>
                        {/* Formato corto en móvil, largo en desktop */}
                        <p className="font-semibold md:hidden">
                            {orderDate.toLocaleDateString('es-ES')}
                        </p>
                        <p className="font-semibold hidden md:block">
                            {orderDate.toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    {t.orders.orderStatus}
                </h2>
                <div className="flex items-center gap-1 md:gap-4">
                    <div className="flex flex-col items-center gap-1 md:gap-2 shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-center whitespace-nowrap">
                            {t.orders.confirmed}
                        </span>
                    </div>
                    <div className="flex-1 min-w-[10px] h-0.5 bg-gray-200"></div>
                    <div className="flex flex-col items-center gap-1 md:gap-2 shrink-0">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-500 text-center whitespace-nowrap">
                            {t.orders.preparing}
                        </span>
                    </div>
                    <div className="flex-1 min-w-[10px] h-0.5 bg-gray-200"></div>
                    <div className="flex flex-col items-center gap-1 md:gap-2 shrink-0">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Truck className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-500 text-center whitespace-nowrap">
                            {t.orders.inTransit}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    {t.orders.orderItems}
                </h2>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 pb-4 border-b last:border-b-0"
                        >
                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                {item.productImage && (
                                    <Image
                                        src={item.productImage}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium mb-1">
                                    {item.productName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {t.cart.size}: {item.size} | {t.cart.color}:{' '}
                                    {item.color}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {t.cart.quantity}: {item.quantity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>{t.cart.total}</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-center"
                >
                    {t.orders.continueShopping}
                </Link>
                <Link
                    href="/orders"
                    className="flex-1 bg-white text-black border-2 border-black py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center"
                >
                    {t.orders.viewMyOrders}
                </Link>
            </div>
        </div>
    );
}
