'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

export interface ColorVariant {
    id: string;
    name: string;
    images: string[];
    thumbnail: string;
}

interface ColorVariantPickerProps {
    variants: ColorVariant[];
    onVariantChange: (variant: ColorVariant) => void;
}

export function ColorVariantPicker({
    variants,
    onVariantChange,
}: ColorVariantPickerProps) {
    const [selectedId, setSelectedId] = useState(variants[0]?.id || '');

    const handleSelect = (variant: ColorVariant) => {
        setSelectedId(variant.id);
        onVariantChange(variant);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent,
        variant: ColorVariant,
        index: number,
    ) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(variant);
        } else if (e.key === 'ArrowRight' && index < variants.length - 1) {
            e.preventDefault();
            const nextVariant = variants[index + 1];
            handleSelect(nextVariant);
            (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            const prevVariant = variants[index - 1];
            handleSelect(prevVariant);
            (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
        }
    };

    if (variants.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {variants.map((variant, index) => (
                <button
                    key={variant.id}
                    onClick={() => handleSelect(variant)}
                    onKeyDown={(e) => handleKeyDown(e, variant, index)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                        selectedId === variant.id
                            ? 'border-dark-500'
                            : 'border-light-300 hover:border-dark-500'
                    }`}
                    aria-label={`Select ${variant.name} color`}
                    aria-pressed={selectedId === variant.id}
                >
                    <Image
                        src={variant.thumbnail}
                        alt={variant.name}
                        fill
                        className="object-cover cursor-pointer"
                        sizes="48px"
                    />
                    {selectedId === variant.id && (
                        <div className="absolute inset-0 bg-dark-900/30 flex items-center justify-center">
                            <Check className="w-6 h-6 text-light-100" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
