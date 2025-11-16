'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter valid images and ensure selected index is within bounds
    const validImages = useMemo(() => {
        return images.filter((img) => img && img.trim() !== '');
    }, [images]);

    // Ensure selected index is always valid
    const safeSelectedIndex = useMemo(() => {
        if (validImages.length === 0) return 0;
        return selectedIndex >= validImages.length ? 0 : selectedIndex;
    }, [selectedIndex, validImages.length]);

    const handlePrevious = () => {
        setSelectedIndex((prev) =>
            prev === 0 ? validImages.length - 1 : prev - 1,
        );
    };

    const handleNext = () => {
        setSelectedIndex((prev) =>
            prev === validImages.length - 1 ? 0 : prev + 1,
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedIndex(index);
        }
    };

    const handleArrowKeys = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrevious();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    // Empty state
    if (validImages.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square bg-light-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <ImageOff className="w-16 h-16 text-dark-500 mx-auto mb-2" />
                        <p className="text-body text-dark-700">
                            No images available
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div
                className="relative w-full aspect-square bg-light-200 rounded-lg overflow-hidden group cursor-pointer outline-none"
                onKeyDown={handleArrowKeys}
                tabIndex={0}
            >
                <Image
                    src={validImages[safeSelectedIndex]}
                    alt={`${productName} - Image ${safeSelectedIndex + 1}`}
                    fill
                    className="object-cover cursor-pointer"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={safeSelectedIndex === 0}
                />

                {/* Navigation Arrows */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-light-100/80 hover:bg-light-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-dark-900"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6 text-dark-900" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-light-100/80 hover:bg-light-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-dark-900"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6 text-dark-900" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {validImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 cursor-pointer ${
                                safeSelectedIndex === index
                                    ? 'border-dark-500'
                                    : 'border-light-300 hover:border-dark-400'
                            }`}
                            aria-label={`View image ${index + 1}`}
                            aria-pressed={safeSelectedIndex === index}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover cursor-pointer"
                                sizes="80px"
                            />
                            {safeSelectedIndex === index && (
                                <div className="absolute inset-0 bg-dark-900/10 pointer-events-none" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
