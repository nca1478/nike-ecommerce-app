'use client';

import { Clock, CheckCircle, Truck, Package, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
    status: string;
}

const statusConfig = {
    pending: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
    },
    paid: {
        label: 'Pagado',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
    },
    shipped: {
        label: 'Enviado',
        color: 'bg-blue-100 text-blue-800',
        icon: Truck,
    },
    delivered: {
        label: 'Entregado',
        color: 'bg-purple-100 text-purple-800',
        icon: Package,
    },
    cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
    },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.pending;
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
        >
            <Icon className="w-4 h-4" />
            {config.label}
        </span>
    );
}
