'use client';

import { useI18n } from '@/lib/i18n';
import { OrdersList } from './OrdersList';

interface Order {
    id: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    items: Array<{
        id: string;
        quantity: string;
        priceAtPurchase: string;
        productVariant: {
            product: {
                name: string;
                images: Array<{ url: string }>;
            };
            images?: Array<{ url: string }>;
        };
    }>;
}

interface OrdersPageContentProps {
    orders: Order[];
}

export function OrdersPageContent({ orders }: OrdersPageContentProps) {
    const { t } = useI18n();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{t.orders.title}</h1>
                <p className="text-gray-600">{t.orders.description}</p>
            </div>

            <OrdersList orders={orders} />
        </div>
    );
}
