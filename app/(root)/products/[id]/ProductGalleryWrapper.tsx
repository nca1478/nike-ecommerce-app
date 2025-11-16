'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ProductGallery } from '@/components/ProductGallery';
import {
    ColorVariantPicker,
    ColorVariant,
} from '@/components/ColorVariantPicker';

// Context to share variant state between gallery and picker
interface VariantContextType {
    selectedVariant: ColorVariant;
    setSelectedVariant: (variant: ColorVariant) => void;
}

const VariantContext = createContext<VariantContextType | null>(null);

// Provider component
export function VariantProvider({
    children,
    variants,
}: {
    children: ReactNode;
    variants: ColorVariant[];
}) {
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);

    return (
        <VariantContext.Provider
            value={{ selectedVariant, setSelectedVariant }}
        >
            {children}
        </VariantContext.Provider>
    );
}

// Hook to use variant context
function useVariant() {
    const context = useContext(VariantContext);
    if (!context) {
        throw new Error('useVariant must be used within VariantProvider');
    }
    return context;
}

// Gallery component that uses context
export function ProductGalleryClient({ productName }: { productName: string }) {
    const { selectedVariant } = useVariant();
    return (
        <ProductGallery
            images={selectedVariant.images}
            productName={productName}
        />
    );
}

// Color picker component that uses context
export function ColorVariantPickerClient({
    variants,
}: {
    variants: ColorVariant[];
}) {
    const { setSelectedVariant } = useVariant();
    return (
        <ColorVariantPicker
            variants={variants}
            onVariantChange={setSelectedVariant}
        />
    );
}
