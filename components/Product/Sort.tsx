'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { parseFilters, stringifyFilters } from '@/lib/utils/query';
import { sortOptions } from '@/lib/data/mock-products';

export function Sort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Derive selected sort from URL params
    const selectedSort = useMemo(() => {
        const filters = parseFilters(searchParams.toString());
        return filters.sort || 'featured';
    }, [searchParams]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSortChange = (value: string) => {
        const filters = parseFilters(searchParams.toString());
        const newFilters = {
            ...filters,
            sort: value,
            page: '1', // Reset to page 1 when sorting changes
        };

        const queryString = stringifyFilters(newFilters);
        router.push(`/products${queryString ? `?${queryString}` : ''}`, {
            scroll: false,
        });

        setIsOpen(false);
    };

    const selectedLabel =
        sortOptions.find((opt) => opt.value === selectedSort)?.label ||
        'Featured';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 text-body-medium text-dark-900 border border-light-400 rounded hover:border-dark-700 transition-colors bg-light-100"
                aria-label="Sort products"
                aria-expanded={isOpen}
            >
                <span className="hidden sm:inline text-dark-700">Sort By:</span>
                <span>{selectedLabel}</span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-light-100 border border-light-300 rounded-lg shadow-lg z-10 overflow-hidden">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full px-4 py-3 text-left text-body transition-colors ${
                                selectedSort === option.value
                                    ? 'bg-dark-900 text-light-100'
                                    : 'text-dark-900 hover:bg-light-200'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
