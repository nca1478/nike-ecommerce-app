'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import { useEffect } from 'react';
import { getCart } from '@/lib/actions/cart';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/hooks';
import { useI18n } from '@/lib/i18n';

export function CartIcon() {
    const { items, setItems } = useCartStore();
    const { user } = useAuth();
    const { t } = useI18n();

    // Calcular total de items reactivamente
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const loadCart = async () => {
            const result = await getCart();
            if (result.success && result.data) {
                setItems(result.data);
            }
        };

        loadCart();
    }, [setItems, user]); // Recargar cuando cambia el usuario

    return (
        <Link
            href="/cart"
            className="relative flex items-center gap-2 hover:text-dark-700 transition-colors whitespace-nowrap"
        >
            <ShoppingBag className="w-6 h-6 shrink-0" />
            <span className="text-body-medium">
                {t.cart.myCart} {totalItems > 0 && `(${totalItems})`}
            </span>
        </Link>
    );
}
