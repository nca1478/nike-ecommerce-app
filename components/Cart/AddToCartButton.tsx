'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { addCartItem } from '@/lib/actions/cart';
import { useCartStore } from '@/lib/store/cart.store';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';

type AddToCartButtonProps = {
    productVariantId: string;
    productName: string;
    productImage: string;
    price: number;
    salePrice?: number;
    size: string;
    color: string;
    category: string;
    disabled?: boolean;
    className?: string;
};

export function AddToCartButton({
    productVariantId,
    productName,
    productImage,
    price,
    salePrice,
    size,
    color,
    category,
    disabled = false,
    className = '',
}: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCartStore();
    const { t } = useI18n();

    const handleAddToCart = async () => {
        setIsAdding(true);

        const result = await addCartItem(productVariantId, 1);

        if (result.success && result.data) {
            // Actualizar el estado global
            addItem({
                id: result.data.itemId,
                productVariantId,
                quantity: 1,
                productName,
                productImage,
                price,
                salePrice,
                size,
                color,
                category,
            });

            toast.success(t.cart.addedToCart);
        } else {
            toast.error(result.error || t.cart.errorProcessing);
        }

        setIsAdding(false);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={disabled || isAdding}
            className={`w-full bg-dark-900 text-light-100 py-4 rounded-full text-body-medium font-medium hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${className}`}
        >
            <ShoppingBag className="w-5 h-5" />
            {isAdding ? t.common.loading : t.products.addToCart}
        </button>
    );
}
