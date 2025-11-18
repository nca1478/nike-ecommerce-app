'use client';

import { useCartStore } from '@/lib/store/cart.store';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/actions';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function CartSummary() {
    const { items } = useCartStore();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);

    // Calcular subtotal reactivamente basado en items
    const subtotal = items.reduce((total, item) => {
        const price = item.salePrice ?? item.price;
        return total + price * item.quantity;
    }, 0);

    const deliveryFee = 2.0;
    const total = subtotal + deliveryFee;

    const handleCheckout = async () => {
        if (subtotal === 0) return;

        setIsChecking(true);
        const authenticated = await isAuthenticated();

        if (!authenticated) {
            // Redirigir a login/registro con parámetro de redirección
            router.push('/sign-in?redirect=/cart&action=checkout');
        } else {
            // Por ahora, mostrar mensaje (la página de checkout se implementará después)
            toast.error('Checkout functionality coming soon!.');
            // TODO: Cuando se implemente checkout, descomentar:
            // router.push('/checkout');
        }
        setIsChecking(false);
    };

    return (
        <div className="bg-light-100 p-6 rounded-lg sticky top-24">
            <h2 className="text-heading-3 font-medium text-dark-900 mb-6">
                Summary
            </h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-body">
                    <span className="text-dark-700">Subtotal</span>
                    <span className="text-dark-900 font-medium">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between text-body">
                    <span className="text-dark-700">
                        Estimated Delivery & Handling
                    </span>
                    <span className="text-dark-900 font-medium">
                        ${deliveryFee.toFixed(2)}
                    </span>
                </div>

                <div className="border-t border-light-300 pt-4">
                    <div className="flex justify-between text-body-medium">
                        <span className="text-dark-900">Total</span>
                        <span className="text-dark-900 font-medium">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={isChecking || subtotal === 0}
                className="w-full bg-dark-900 text-light-100 py-4 rounded-full text-body-medium font-medium hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {isChecking ? 'Processing...' : 'Proceed to Checkout'}
            </button>
        </div>
    );
}
