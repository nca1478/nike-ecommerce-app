'use client';

import { Clock, CheckCircle, Truck, Package, XCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface OrderStatusBadgeProps {
    status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const { t } = useI18n();

    const statusConfig = {
        pending: {
            label: t.orders.confirmed,
            color: 'bg-yellow-100 text-yellow-800',
            icon: Clock,
        },
        paid: {
            label: t.orders.confirmed,
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
        },
        confirmed: {
            label: t.orders.confirmed,
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
        },
        preparing: {
            label: t.orders.preparing,
            color: 'bg-blue-100 text-blue-800',
            icon: Package,
        },
        shipped: {
            label: t.orders.shipped,
            color: 'bg-blue-100 text-blue-800',
            icon: Truck,
        },
        in_transit: {
            label: t.orders.inTransit,
            color: 'bg-blue-100 text-blue-800',
            icon: Truck,
        },
        delivered: {
            label: t.orders.delivered,
            color: 'bg-purple-100 text-purple-800',
            icon: Package,
        },
        cancelled: {
            label: t.orders.cancelled,
            color: 'bg-red-100 text-red-800',
            icon: XCircle,
        },
    };

    const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.confirmed;
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
