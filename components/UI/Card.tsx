'use client';

import Image from 'next/image';

export interface CardProps {
    title: string;
    description?: string;
    image: string;
    price?: number;
    category?: string;
    badge?: string;
    onClick?: () => void;
    className?: string;
}

export function Card({
    title,
    description,
    image,
    price,
    category,
    badge,
    onClick,
    className = '',
}: CardProps) {
    return (
        <div
            className={`bg-light-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}
            onClick={onClick}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-light-200">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {badge && (
                    <div className="absolute top-4 left-4 bg-dark-900 text-light-100 px-3 py-1 rounded-full text-caption font-medium">
                        {badge}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-heading-3 font-medium text-dark-900 flex-1">
                        {title}
                    </h3>
                    {category && (
                        <span className="text-caption text-dark-700 bg-light-200 px-2 py-1 rounded ml-2">
                            {category}
                        </span>
                    )}
                </div>

                {description && (
                    <p className="text-body text-dark-700 mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                {price !== undefined && (
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-heading-3 font-bold text-dark-900">
                            ${price.toFixed(2)}
                        </span>
                        {/* <button
              className="bg-dark-900 text-light-100 px-6 py-2 rounded-full hover:bg-dark-700 transition-colors text-body-medium"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic here
              }}
            >
              Add to Cart
            </button> */}
                    </div>
                )}
            </div>
        </div>
    );
}
