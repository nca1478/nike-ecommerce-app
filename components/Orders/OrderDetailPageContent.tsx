'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export function OrderNotFound({ error }: { error?: string }) {
    const { t } = useI18n();

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">
                    {t.orders.orderNotFound}
                </h1>
                <p className="text-gray-600 mb-6">
                    {error || t.orders.orderNotFoundDescription}
                </p>
                <Link href="/orders" className="text-blue-600 hover:underline">
                    {t.orders.backToOrders}
                </Link>
            </div>
        </div>
    );
}
