'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OrderItem {
    id: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
}

interface ReorderButtonProps {
    items: OrderItem[];
}

export function ReorderButton({ items }: ReorderButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleReorder = async () => {
        setIsLoading(true);

        try {
            // En producción, aquí harías una consulta para obtener los productos
            // y agregarlos al carrito usando el store
            // Por ahora, mostramos un mensaje informativo

            toast.success(
                `Funcionalidad de reordenar en desarrollo. ${items.length} ${items.length === 1 ? 'producto' : 'productos'} para agregar.`,
            );

            // Comentado para implementación futura:
            // const { useCartStore } = await import('@/lib/store/cart.store');
            // for (const item of items) {
            //     const product = await getProductVariant(item.productVariantId);
            //     useCartStore.getState().addItem(product);
            // }
            // window.location.href = '/cart';
        } catch (error) {
            console.error('Error al reordenar:', error);
            toast.error('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleReorder}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <ShoppingCart className="w-5 h-5" />
            {isLoading ? 'Procesando...' : 'Volver a Pedir'}
        </button>
    );
}
