# Ejemplos de Uso del Sistema de Carrito

## Ejemplo 1: Página de Producto Completa

```tsx
// app/(root)/products/[id]/page.tsx
import { AddToCartButton } from '@/components';
import { getProductById } from '@/lib/data/products';

export default async function ProductPage({
    params,
}: {
    params: { id: string };
}) {
    const product = await getProductById(params.id);

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galería de imágenes */}
            <ProductGallery images={product.images} />

            {/* Información del producto */}
            <div className="space-y-6">
                <h1 className="text-heading-2">{product.name}</h1>
                <p className="text-lead">${product.price}</p>

                {/* Selector de variantes */}
                <ProductVariantSelector
                    product={product}
                    variants={product.variants}
                />
            </div>
        </div>
    );
}
```

## Ejemplo 2: Selector de Variantes con Carrito

```tsx
// components/Product/ProductVariantSelector.tsx
'use client';

import { useState } from 'react';
import { AddToCartButton } from '@/components';
import { ColorVariantPicker, SizePicker } from '@/components';

interface ProductVariantSelectorProps {
    product: Product;
    variants: ProductVariant[];
}

export function ProductVariantSelector({
    product,
    variants,
}: ProductVariantSelectorProps) {
    const [selectedColor, setSelectedColor] = useState(variants[0]?.colorId);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Filtrar variantes por color seleccionado
    const colorVariants = variants.filter((v) => v.colorId === selectedColor);

    // Obtener tallas disponibles para el color seleccionado
    const availableSizes = colorVariants.map((v) => ({
        id: v.sizeId,
        name: v.sizeName,
        inStock: parseInt(v.inStock) > 0,
    }));

    // Encontrar la variante específica
    const selectedVariant = colorVariants.find(
        (v) => v.sizeId === selectedSize,
    );

    // Obtener información del color
    const selectedColorInfo = variants.find((v) => v.colorId === selectedColor);

    return (
        <div className="space-y-6">
            {/* Selector de Color */}
            <div>
                <h3 className="text-body-medium mb-3">
                    Color: {selectedColorInfo?.colorName}
                </h3>
                <ColorVariantPicker
                    variants={variants}
                    selectedColorId={selectedColor}
                    onSelect={setSelectedColor}
                />
            </div>

            {/* Selector de Talla */}
            <div>
                <h3 className="text-body-medium mb-3">Select Size</h3>
                <SizePicker
                    sizes={availableSizes}
                    selectedSize={selectedSize}
                    onSelect={setSelectedSize}
                />
            </div>

            {/* Mensaje de validación */}
            {!selectedSize && (
                <p className="text-caption text-dark-700">
                    Please select a size
                </p>
            )}

            {selectedSize && !selectedVariant?.inStock && (
                <p className="text-caption text-red">
                    This size is currently out of stock
                </p>
            )}

            {/* Botón Añadir al Carrito */}
            <AddToCartButton
                productVariantId={selectedVariant?.id || ''}
                productName={product.name}
                productImage={selectedColorInfo?.images[0] || ''}
                price={parseFloat(selectedVariant?.price || '0')}
                salePrice={
                    selectedVariant?.salePrice
                        ? parseFloat(selectedVariant.salePrice)
                        : undefined
                }
                size={
                    availableSizes.find((s) => s.id === selectedSize)?.name ||
                    ''
                }
                color={selectedColorInfo?.colorName || ''}
                category={product.category.name}
                disabled={
                    !selectedSize ||
                    !selectedVariant ||
                    !selectedVariant.inStock
                }
            />
        </div>
    );
}
```

## Ejemplo 3: Quick Add desde Grid de Productos

```tsx
// components/Product/ProductCard.tsx
'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { addCartItem } from '@/lib/actions/cart';
import { useCartStore } from '@/lib/store/cart.store';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
    defaultVariant: ProductVariant;
}

export function ProductCard({ product, defaultVariant }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCartStore();

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevenir navegación al producto
        e.stopPropagation();

        setIsAdding(true);

        const result = await addCartItem(defaultVariant.id, 1);

        if (result.success && result.data) {
            addItem({
                id: result.data.itemId,
                productVariantId: defaultVariant.id,
                quantity: 1,
                productName: product.name,
                productImage: product.images[0]?.url || '',
                price: parseFloat(defaultVariant.price),
                salePrice: defaultVariant.salePrice
                    ? parseFloat(defaultVariant.salePrice)
                    : undefined,
                size: defaultVariant.sizeName,
                color: defaultVariant.colorName,
                category: product.category.name,
            });

            toast.success('Added to cart');
        } else {
            toast.error('Failed to add to cart');
        }

        setIsAdding(false);
    };

    return (
        <div className="group relative">
            <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative overflow-hidden rounded-lg">
                    <Image
                        src={product.images[0]?.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                    />
                </div>

                <div className="mt-4">
                    <h3 className="text-body-medium">{product.name}</h3>
                    <p className="text-caption text-dark-700">
                        {product.category.name}
                    </p>
                    <p className="text-body-medium font-medium mt-2">
                        ${defaultVariant.price}
                    </p>
                </div>
            </Link>

            {/* Botón Quick Add */}
            <button
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="absolute bottom-20 right-4 bg-light-100 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                aria-label="Quick add to cart"
            >
                <ShoppingBag className="w-5 h-5" />
            </button>
        </div>
    );
}
```

## Ejemplo 4: Mini Cart Dropdown

```tsx
// components/Cart/MiniCart.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart.store';
import { ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function MiniCart() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, getTotalItems, getSubtotal } = useCartStore();

    const totalItems = getTotalItems();
    const subtotal = getSubtotal();

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2"
            >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-dark-900 text-light-100 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Cart Panel */}
                    <div className="absolute right-0 top-12 w-96 bg-light-100 shadow-xl rounded-lg z-50 max-h-[600px] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-light-300">
                            <h3 className="text-body-medium font-medium">
                                Cart ({totalItems})
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-dark-700 hover:text-dark-900"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <p className="text-center text-dark-700 py-8">
                                    Your cart is empty
                                </p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-20 h-20 bg-light-200 rounded">
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-caption font-medium">
                                                {item.productName}
                                            </h4>
                                            <p className="text-footnote text-dark-700">
                                                Size {item.size} • Qty{' '}
                                                {item.quantity}
                                            </p>
                                            <p className="text-caption font-medium mt-1">
                                                $
                                                {(
                                                    (item.salePrice ??
                                                        item.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-light-300 space-y-3">
                                <div className="flex justify-between text-body-medium">
                                    <span>Subtotal</span>
                                    <span className="font-medium">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <Link
                                    href="/cart"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-dark-900 text-light-100 text-center py-3 rounded-full hover:bg-dark-700 transition-colors"
                                >
                                    View Cart
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
```

## Ejemplo 5: Carrito con Cupones

```tsx
// components/Cart/CartSummaryWithCoupon.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart.store';
import { applyCoupon } from '@/lib/actions/coupons';
import toast from 'react-hot-toast';

export function CartSummaryWithCoupon() {
    const { getSubtotal } = useCartStore();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isApplying, setIsApplying] = useState(false);

    const subtotal = getSubtotal();
    const deliveryFee = 2.0;
    const total = subtotal - discount + deliveryFee;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setIsApplying(true);
        const result = await applyCoupon(couponCode, subtotal);

        if (result.success && result.data) {
            setDiscount(result.data.discountAmount);
            toast.success(
                `Coupon applied! Saved $${result.data.discountAmount.toFixed(2)}`,
            );
        } else {
            toast.error(result.error || 'Invalid coupon code');
        }

        setIsApplying(false);
    };

    return (
        <div className="bg-light-100 p-6 rounded-lg">
            <h2 className="text-heading-3 mb-6">Summary</h2>

            {/* Coupon Input */}
            <div className="mb-6">
                <label className="text-caption text-dark-700 mb-2 block">
                    Coupon Code
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                    />
                    <button
                        onClick={handleApplyCoupon}
                        disabled={isApplying}
                        className="px-4 py-2 bg-dark-900 text-light-100 rounded-lg hover:bg-dark-700 disabled:opacity-50"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-body">
                    <span className="text-dark-700">Subtotal</span>
                    <span className="text-dark-900">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-body text-green">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-body">
                    <span className="text-dark-700">Delivery</span>
                    <span className="text-dark-900">
                        ${deliveryFee.toFixed(2)}
                    </span>
                </div>

                <div className="border-t border-light-300 pt-4">
                    <div className="flex justify-between text-body-medium">
                        <span className="text-dark-900">Total</span>
                        <span className="text-dark-900 font-medium">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <button className="w-full bg-dark-900 text-light-100 py-4 rounded-full hover:bg-dark-700">
                Proceed to Checkout
            </button>
        </div>
    );
}
```

## Ejemplo 6: Persistencia del Carrito

```tsx
// hooks/useCartPersistence.ts
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart.store';
import { getCart } from '@/lib/actions/cart';

export function useCartPersistence() {
    const { setItems, setLoading } = useCartStore();

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            const result = await getCart();

            if (result.success && result.data) {
                setItems(result.data);
            }
            setLoading(false);
        };

        loadCart();

        // Recargar carrito cuando la ventana recupera el foco
        const handleFocus = () => {
            loadCart();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [setItems, setLoading]);
}

// Uso en layout
// app/(root)/layout.tsx
('use client');

import { useCartPersistence } from '@/hooks/useCartPersistence';

export default function RootLayout({ children }) {
    useCartPersistence();

    return <>{children}</>;
}
```

## Ejemplo 7: Carrito con Animaciones

```tsx
// components/Cart/AnimatedCartItem.tsx
'use client';

import { motion } from 'framer-motion';
import { CartItem } from './CartItem';

export function AnimatedCartItem(props: CartItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
        >
            <CartItem {...props} />
        </motion.div>
    );
}

// Uso en CartList
import { AnimatePresence } from 'framer-motion';

export function CartList() {
    const { items } = useCartStore();

    return (
        <AnimatePresence>
            {items.map((item) => (
                <AnimatedCartItem key={item.id} {...item} />
            ))}
        </AnimatePresence>
    );
}
```

Estos ejemplos cubren los casos de uso más comunes del sistema de carrito. Puedes adaptarlos según las necesidades específicas de tu aplicación.
