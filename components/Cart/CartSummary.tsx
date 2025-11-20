'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart.store';
import { createStripeCheckoutSession } from '@/lib/actions/checkout';
import { isAuthenticated } from '@/lib/auth/actions';
import { ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartSummary() {
    const router = useRouter();
    const { getTotalItems, getSubtotal } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    const subtotal = getSubtotal();
    const itemCount = getTotalItems();
    const shipping = subtotal > 100 ? 0 : 10; // Envío gratis para pedidos > $100
    const tax = subtotal * 0.08; // 8% de impuestos
    const total = subtotal + shipping + tax;

    const handleCheckout = async () => {
        if (itemCount === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setIsLoading(true);

        try {
            // Verificar si el usuario está autenticado
            const authenticated = await isAuthenticated();

            if (!authenticated) {
                // Redirigir a sign-in con parámetros de redirección
                toast.error('Please sign in to complete your purchase');
                router.push('/sign-in?redirect=/cart&action=checkout');
                setIsLoading(false);
                return;
            }

            // Usuario autenticado - proceder con Stripe
            const result = await createStripeCheckoutSession();

            if (!result.success || !result.data) {
                toast.error(result.error || 'Error processing payment');
                setIsLoading(false);
                return;
            }

            // Redirigir a Stripe Checkout
            window.location.href = result.data.url;
        } catch (error) {
            console.error('Error en checkout:', error);
            toast.error('Error processing payment');
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-light-100 rounded-lg p-6">
            <h2 className="text-heading-5 font-medium text-dark-900 mb-6">
                Summary
            </h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-body">
                    <span className="text-dark-700">Subtotal</span>
                    <span className="font-medium text-dark-900">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between text-body">
                    <span className="text-dark-700">
                        Estimated Delivery & Handling
                    </span>
                    <span className="font-medium text-dark-900">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                </div>

                <div className="flex justify-between text-body">
                    <span className="text-dark-700">Estimated Tax</span>
                    <span className="font-medium text-dark-900">
                        ${tax.toFixed(2)}
                    </span>
                </div>

                <div className="border-t border-dark-300 pt-4">
                    <div className="flex justify-between">
                        <span className="text-body font-medium text-dark-900">
                            Total
                        </span>
                        <span className="text-heading-5 font-medium text-dark-900">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={isLoading || itemCount === 0}
                className="w-full bg-dark-900 text-light-100 py-4 rounded-full font-medium hover:bg-dark-800 transition-colors disabled:bg-dark-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5" />
                        Checkout
                    </>
                )}
            </button>

            <p className="text-caption text-dark-600 text-center mt-4">
                Secure payment powered by Stripe
            </p>
        </div>
    );
}
