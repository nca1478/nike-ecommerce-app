'use client';

import { CheckCircle, Circle } from 'lucide-react';

interface OrderTimelineProps {
    status: string;
}

const steps = [
    { key: 'pending', label: 'Pedido Recibido' },
    { key: 'paid', label: 'Pago Confirmado' },
    { key: 'shipped', label: 'En Camino' },
    { key: 'delivered', label: 'Entregado' },
];

const statusOrder = ['pending', 'paid', 'shipped', 'delivered'];

export function OrderTimeline({ status }: OrderTimelineProps) {
    const currentIndex = statusOrder.indexOf(status);
    const isCancelled = status === 'cancelled';

    if (isCancelled) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-red-600">
                    <Circle className="w-6 h-6" />
                    <span className="font-semibold">Pedido Cancelado</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Este pedido ha sido cancelado
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
                                    Estado actual
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
