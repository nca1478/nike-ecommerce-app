'use client';

import { useState, useContext, createContext } from 'react';
import { Heart } from 'lucide-react';
import { AddToCartButton } from '@/components';
import { SizePickerWithStock, SizeOption } from './SizePickerWithStock';
import Link from 'next/link';

interface ProductVariant {
    id: string;
    colorId: string;
    sizeId: string;
    price: string;
    salePrice: string | null;
    inStock: string;
}

interface ProductActionsProps {
    productName: string;
    productImage: string;
    category: string;
    sizes: SizeOption[];
    variants: ProductVariant[];
    selectedColorId: string;
    selectedColorName: string;
}

export function ProductActions({
    productName,
    productImage,
    category,
    sizes,
    variants,
    selectedColorId,
    selectedColorName,
}: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Encontrar la variante específica según color y talla seleccionados
    const selectedVariant = variants.find(
        (v) => v.colorId === selectedColorId && v.sizeId === selectedSize,
    );

    // Obtener el nombre de la talla seleccionada
    const selectedSizeName =
        sizes.find((s) => s.id === selectedSize)?.name || '';

    // Verificar si hay stock
    const hasStock = selectedVariant && parseInt(selectedVariant.inStock) > 0;

    // Determinar si el botón debe estar deshabilitado
    const isDisabled = !selectedSize || !selectedVariant || !hasStock;

    return (
        <div className="space-y-6">
            {/* Size Selector */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-body-medium text-dark-900">
                        Select Size
                    </h3>
                    <Link
                        href="#"
                        className="text-caption text-dark-700 hover:text-dark-900 underline focus:outline-none focus:ring-2 focus:ring-dark-900 rounded"
                    >
                        Size Guide
                    </Link>
                </div>
                <SizePickerWithStockControlled
                    sizes={sizes}
                    selectedSize={selectedSize}
                    onSizeChange={setSelectedSize}
                />
            </div>

            {/* Mensaje de validación */}
            {!selectedSize && (
                <p className="text-caption text-dark-700">
                    Please select a size
                </p>
            )}

            {selectedSize && !hasStock && (
                <p className="text-caption text-red">
                    This size is currently out of stock
                </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                <AddToCartButton
                    productVariantId={selectedVariant?.id || ''}
                    productName={productName}
                    productImage={productImage}
                    price={parseFloat(selectedVariant?.price || '0')}
                    salePrice={
                        selectedVariant?.salePrice
                            ? parseFloat(selectedVariant.salePrice)
                            : undefined
                    }
                    size={selectedSizeName}
                    color={selectedColorName}
                    category={category}
                    disabled={isDisabled}
                />

                <button className="w-full bg-light-100 text-dark-900 py-4 rounded-full text-body-medium font-medium border-2 border-dark-900 hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 cursor-pointer">
                    <span className="flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5" />
                        Favourite
                    </span>
                </button>
            </div>
        </div>
    );
}

// Componente controlado del SizePicker
function SizePickerWithStockControlled({
    sizes,
    selectedSize,
    onSizeChange,
}: {
    sizes: SizeOption[];
    selectedSize: string | null;
    onSizeChange: (sizeId: string | null) => void;
}) {
    const handleKeyDown = (
        e: React.KeyboardEvent,
        size: SizeOption,
        index: number,
    ) => {
        if (!size.inStock) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSizeChange(size.id);
        } else if (e.key === 'ArrowRight' && index < sizes.length - 1) {
            e.preventDefault();
            (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
        }
    };

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {sizes.map((size, index) => (
                <button
                    key={size.id}
                    onClick={() => size.inStock && onSizeChange(size.id)}
                    onKeyDown={(e) => handleKeyDown(e, size, index)}
                    disabled={!size.inStock}
                    className={`py-3 px-4 rounded-lg border-2 transition-all text-body-medium focus:outline-none ${
                        size.inStock
                            ? selectedSize === size.id
                                ? 'border-dark-900 bg-dark-900 text-light-100 focus:ring-2 focus:ring-dark-900'
                                : 'border-light-300 bg-light-100 text-dark-900 hover:border-dark-500 focus:ring-2 focus:ring-dark-900 cursor-pointer'
                            : 'border-light-300 bg-light-200 text-dark-500 cursor-not-allowed opacity-50'
                    }`}
                    aria-label={`Select size ${size.name}${!size.inStock ? ' (Out of stock)' : ''}`}
                    aria-pressed={selectedSize === size.id}
                    aria-disabled={!size.inStock}
                >
                    {size.name}
                </button>
            ))}
        </div>
    );
}
