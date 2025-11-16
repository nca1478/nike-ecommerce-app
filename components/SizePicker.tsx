'use client';

import { useState } from 'react';

interface SizePickerProps {
    sizes: string[];
}

export function SizePicker({ sizes }: SizePickerProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleKeyDown = (
        e: React.KeyboardEvent,
        size: string,
        index: number,
    ) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedSize(size);
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
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    onKeyDown={(e) => handleKeyDown(e, size, index)}
                    className={`py-3 px-4 rounded-lg border-2 transition-all text-body-medium focus:outline-none focus:ring-2 focus:ring-dark-900 cursor-pointer ${
                        selectedSize === size
                            ? 'border-dark-900 bg-dark-900 text-light-100'
                            : 'border-light-300 bg-light-100 text-dark-900 hover:border-dark-500'
                    }`}
                    aria-label={`Select size ${size}`}
                    aria-pressed={selectedSize === size}
                >
                    {size}
                </button>
            ))}
        </div>
    );
}
