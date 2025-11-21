'use client';

import { useI18n } from '@/lib/i18n';
import { CartList } from './CartList';
import CartSummary from './CartSummary';

export function CartPageContent() {
    const { t } = useI18n();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-heading-3 font-medium text-dark-900 mb-8">
                {t.cart.myCart}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de artículos del carrito */}
                <div className="lg:col-span-2">
                    <CartList />
                </div>

                {/* Resumen del carrito */}
                <div className="lg:col-span-1">
                    <CartSummary />
                </div>
            </div>
        </div>
    );
}
