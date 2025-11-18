'use client';

import { useState } from 'react';

export interface SizeOption {
    id: string;
    name: string;
    inStock: boolean;
}

interface SizePickerWithStockProps {
    sizes: SizeOption[];
}

export function SizePickerWithStock({ sizes }: SizePickerWithStockProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleKeyDown = (
        e: React.KeyboardEvent,
        size: SizeOption,
        index: number,
    ) => {
        if (!size.inStock) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedSize(size.id);
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
                    onClick={() => size.inStock && setSelectedSize(size.id)}
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
