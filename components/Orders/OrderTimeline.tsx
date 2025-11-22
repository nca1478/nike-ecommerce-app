'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface OrderTimelineProps {
    status: string;
}

const statusOrder = ['pending', 'paid', 'shipped', 'delivered'];

export function OrderTimeline({ status }: OrderTimelineProps) {
    const { t } = useI18n();

    const steps = [
        { key: 'pending', label: t.orders.orderReceived || 'Order Received' },
        {
            key: 'paid',
            label: t.orders.paymentConfirmed || 'Payment Confirmed',
        },
        { key: 'shipped', label: t.orders.inTransit },
        { key: 'delivered', label: t.orders.delivered },
    ];

    const currentIndex = statusOrder.indexOf(status);
    const isCancelled = status === 'cancelled';

    if (isCancelled) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-red-600">
                    <Circle className="w-6 h-6" />
                    <span className="font-semibold">{t.orders.cancelled}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {t.orders.orderCancelled || 'This order has been cancelled'}
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            {steps.map((step, index) => {
                const isCompleted = index <= currentIndex;
                const isActive = index === currentIndex;

                return (
                    <div
                        key={step.key}
                        className="flex items-start mb-8 last:mb-0"
                    >
                        {/* Línea vertical */}
                        {index < steps.length - 1 && (
                            <div
                                className={`absolute left-3 top-8 w-0.5 h-12 ${
                                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            />
                        )}

                        {/* Icono */}
                        <div className="relative z-10 shrink-0">
                            {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                                <Circle className="w-6 h-6 text-gray-300" />
                            )}
                        </div>

                        {/* Contenido */}
                        <div className="ml-4 flex-1">
                            <p
                                className={`font-semibold ${
                                    isActive
                                        ? 'text-black'
                                        : isCompleted
                                          ? 'text-gray-700'
                                          : 'text-gray-400'
                                }`}
                            >
                                {step.label}
                            </p>
                            {isActive && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {t.orders.currentStatus || 'Current status'}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
