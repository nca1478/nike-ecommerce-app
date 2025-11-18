'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart.store';
import { CartItem } from './CartItem';
import { getCart } from '@/lib/actions/cart';

export function CartList() {
    const { items, setItems, setLoading } = useCartStore();

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            const result = await getCart();

            if (result.success && result.data) {
                setItems(result.data);
            }
            setLoading(false);
        };

        loadCart();
    }, [setItems, setLoading]);

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-lead text-dark-700">Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <CartItem
                    key={item.id}
                    id={item.id}
                    productName={item.productName}
                    productImage={item.productImage}
                    price={item.price}
                    salePrice={item.salePrice}
                    size={item.size}
                    quantity={item.quantity}
                    category={item.category}
                    estimatedDelivery={item.estimatedDelivery}
                />
            ))}
        </div>
    );
}
