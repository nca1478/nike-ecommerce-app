'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useI18n } from '@/lib/i18n';

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
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState(false);

    const handleReorder = async () => {
        setIsLoading(true);

        try {
            // En producción, aquí harías una consulta para obtener los productos
            // y agregarlos al carrito usando el store
            // Por ahora, mostramos un mensaje informativo

            const itemText =
                items.length === 1 ? t.orders.item : t.orders.items;
            toast.success(
                `Funcionalidad de reordenar en desarrollo. ${items.length} ${itemText} para agregar.`,
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
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
            <ShoppingCart className="w-5 h-5" />
            {isLoading ? t.cart.processing : t.orders.reorder}
        </button>
    );
}
