'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { updateCartItem, removeCartItem } from '@/lib/actions/cart';
import { useCartStore } from '@/lib/store/cart.store';
import toast from 'react-hot-toast';

type CartItemProps = {
    id: string;
    productName: string;
    productImage: string;
    price: number;
    salePrice?: number;
    size: string;
    quantity: number;
    category: string;
    estimatedDelivery?: string;
};

export function CartItem({
    id,
    productName,
    productImage,
    price,
    salePrice,
    size,
    quantity,
    category,
    estimatedDelivery,
}: CartItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const { updateItem, removeItem } = useCartStore();

    const displayPrice = salePrice ?? price;
    const totalPrice = displayPrice * quantity;

    const handleUpdateQuantity = async (newQuantity: number) => {
        if (newQuantity < 1) return;

        setIsUpdating(true);
        const result = await updateCartItem(id, newQuantity);

        if (result.success) {
            updateItem(id, newQuantity);
        } else {
            toast.error(result.error || 'Error al actualizar cantidad');
        }
        setIsUpdating(false);
    };

    const handleRemove = async () => {
        setIsUpdating(true);
        const result = await removeCartItem(id);

        if (result.success) {
            removeItem(id);
            toast.success('Producto eliminado del carrito');
        } else {
            toast.error(result.error || 'Error al eliminar producto');
        }
        setIsUpdating(false);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-light-200 p-4 rounded-lg">
            {/* Imagen del producto */}
            <div className="relative w-full sm:w-32 h-32 shrink-0 bg-light-100 rounded-lg overflow-hidden">
                <Image
                    src={productImage}
                    alt={productName}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Detalles del producto */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {/* Fecha de entrega estimada */}
                    {estimatedDelivery && (
                        <p className="text-footnote text-orange mb-2">
                            Estimated arrival {estimatedDelivery}
                        </p>
                    )}

                    {/* Nombre del producto */}
                    <h3 className="text-body-medium font-medium text-dark-900 mb-1">
                        {productName}
                    </h3>

                    {/* Categoría */}
                    <p className="text-caption text-dark-700 mb-2">
                        {category}
                    </p>

                    {/* Talla y cantidad */}
                    <div className="flex gap-4 text-caption text-dark-700">
                        <span>Size {size}</span>
                        <span>Quantity</span>
                    </div>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => handleUpdateQuantity(quantity - 1)}
                        disabled={isUpdating || quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-light-400 rounded-full hover:bg-light-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-body-medium w-8 text-center">
                        {quantity}
                    </span>

                    <button
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        disabled={isUpdating}
                        className="w-8 h-8 flex items-center justify-center border border-light-400 rounded-full hover:bg-light-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Precio y botón eliminar */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between">
                <p className="text-body-medium font-medium text-dark-900">
                    ${totalPrice.toFixed(2)}
                </p>

                <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="text-dark-700 hover:text-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Remove item"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
