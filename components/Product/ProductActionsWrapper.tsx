'use client';

import { ProductActions } from './ProductActions';
import { useVariant } from './ProductVariantManager';
import { SizeOption } from './SizePickerWithStock';

interface ProductVariant {
    id: string;
    colorId: string;
    sizeId: string;
    price: string;
    salePrice: string | null;
    inStock: string;
    color: {
        name: string;
    };
}

interface ProductActionsWrapperProps {
    productName: string;
    productImage: string;
    category: string;
    sizes: SizeOption[];
    variants: ProductVariant[];
}

export function ProductActionsWrapper({
    productName,
    productImage,
    category,
    sizes,
    variants,
}: ProductActionsWrapperProps) {
    const { selectedVariant } = useVariant();

    // Obtener la imagen del color seleccionado
    const currentImage = selectedVariant.images[0] || productImage;

    // Obtener el nombre del color seleccionado
    const selectedColorVariant = variants.find(
        (v) => v.colorId === selectedVariant.colorId,
    );
    const colorName = selectedColorVariant?.color.name || '';

    return (
        <ProductActions
            productName={productName}
            productImage={currentImage}
            category={category}
            sizes={sizes}
            variants={variants.map((v) => ({
                id: v.id,
                colorId: v.colorId,
                sizeId: v.sizeId,
                price: v.price,
                salePrice: v.salePrice,
                inStock: v.inStock,
            }))}
            selectedColorId={selectedVariant.colorId}
            selectedColorName={colorName}
        />
    );
}
