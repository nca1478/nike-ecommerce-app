'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { ProductGallery } from '@/components';

export interface VariantWithImages {
    colorId: string;
    colorName: string;
    colorHex: string;
    images: string[];
    thumbnail: string;
}

interface VariantContextType {
    selectedVariant: VariantWithImages;
    setSelectedVariant: (variant: VariantWithImages) => void;
}

const VariantContext = createContext<VariantContextType | null>(null);

export function VariantProvider({
    children,
    variants,
}: {
    children: ReactNode;
    variants: VariantWithImages[];
}) {
    const [selectedVariant, setSelectedVariant] = useState(
        variants[0] || {
            colorId: '',
            colorName: 'Default',
            colorHex: '#000000',
            images: [],
            thumbnail: '',
        },
    );

    return (
        <VariantContext.Provider
            value={{ selectedVariant, setSelectedVariant }}
        >
            {children}
        </VariantContext.Provider>
    );
}

function useVariant() {
    const context = useContext(VariantContext);
    if (!context) {
        throw new Error('useVariant must be used within VariantProvider');
    }
    return context;
}

export function ProductGalleryClient({ productName }: { productName: string }) {
    const { selectedVariant } = useVariant();
    return (
        <ProductGallery
            images={selectedVariant.images}
            productName={productName}
        />
    );
}

export function ColorVariantPickerClient({
    variants,
}: {
    variants: VariantWithImages[];
}) {
    const { selectedVariant, setSelectedVariant } = useVariant();

    const handleSelect = (variant: VariantWithImages) => {
        setSelectedVariant(variant);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent,
        variant: VariantWithImages,
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
                    key={variant.colorId}
                    onClick={() => handleSelect(variant)}
                    onKeyDown={(e) => handleKeyDown(e, variant, index)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-dark-900 ${
                        selectedVariant.colorId === variant.colorId
                            ? 'border-dark-900'
                            : 'border-light-300 hover:border-dark-500'
                    }`}
                    aria-label={`Select ${variant.colorName} color`}
                    aria-pressed={selectedVariant.colorId === variant.colorId}
                >
                    {variant.thumbnail ? (
                        <Image
                            src={variant.thumbnail}
                            alt={variant.colorName}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{ backgroundColor: variant.colorHex }}
                        />
                    )}
                    {selectedVariant.colorId === variant.colorId && (
                        <div className="absolute inset-0 bg-dark-900/30 flex items-center justify-center">
                            <Check className="w-6 h-6 text-light-100" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
