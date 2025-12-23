'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { filterOptions } from '@/lib/data/mock-products.data';
import {
    parseFilters,
    stringifyFilters,
    toggleFilter,
    clearAllFilters,
    isFilterActive,
    type FilterParams,
} from '@/lib/utils/query';

export function Filters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useI18n();
    // Initialize filters from URL directly
    const [filters, setFilters] = useState<FilterParams>(() =>
        parseFilters(searchParams.toString()),
    );
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        gender: true,
        size: false,
        color: false,
        price: false,
    });

    // Sync filters when URL changes
    useEffect(() => {
        const parsed = parseFilters(searchParams.toString());
        setFilters((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
                return parsed;
            }
            return prev;
        });
    }, [searchParams]);

    const updateURL = (newFilters: FilterParams) => {
        const queryString = stringifyFilters(newFilters);
        router.push(`/products${queryString ? `?${queryString}` : ''}`, {
            scroll: false,
        });
    };

    const handleFilterToggle = (key: keyof FilterParams, value: string) => {
        const newFilters = toggleFilter(filters, key, value);
        setFilters(newFilters);
        updateURL(newFilters);
        // Close mobile drawer after selecting a filter
        setIsOpen(false);
    };

    const handleClearAll = () => {
        const cleared = clearAllFilters();
        setFilters(cleared);
        updateURL(cleared);
        // Close mobile drawer after clearing filters
        setIsOpen(false);
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 bg-dark-900 text-light-100 p-4 rounded-full shadow-lg hover:bg-dark-700 transition-colors cursor-pointer"
                aria-label="Open filters"
            >
                <SlidersHorizontal className="w-6 h-6" />
            </button>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-dark-900/50 z-50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-light-100 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-heading-3 font-medium text-dark-900">
                            {t.products.filters}
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-light-200 rounded-full transition-colors"
                            aria-label="Close filters"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <FilterContent />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24">
                    <h2 className="text-heading-3 font-medium text-dark-900 mb-6">
                        {t.products.filters}
                    </h2>
                    <FilterContent />
                </div>
            </aside>
        </>
    );

    function FilterSection({
        title,
        section,
        children,
    }: {
        title: string;
        section: keyof typeof expandedSections;
        children: React.ReactNode;
    }) {
        return (
            <div className="border-b border-light-300 pb-4">
                <button
                    onClick={() => toggleSection(section)}
                    className="flex items-center justify-between w-full py-3 text-body-medium text-dark-900 hover:text-dark-700 transition-colors cursor-pointer"
                >
                    <span>{title}</span>
                    {expandedSections[section] ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>
                {expandedSections[section] && (
                    <div className="mt-2 space-y-2">{children}</div>
                )}
            </div>
        );
    }

    function FilterContent() {
        // Gender options with translations
        const genderOptions = [
            { label: t.nav.men, value: 'men' },
            { label: t.nav.women, value: 'women' },
            { label: t.nav.kids, value: 'kids' },
            { label: t.nav.unisex, value: 'unisex' },
        ];

        return (
            <div className="space-y-4">
                {/* Gender Filter */}
                <FilterSection title={t.products.gender} section="gender">
                    {genderOptions.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={isFilterActive(
                                    filters,
                                    'gender',
                                    option.value,
                                )}
                                onChange={() =>
                                    handleFilterToggle('gender', option.value)
                                }
                                className="w-5 h-5 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 cursor-pointer"
                            />
                            <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </FilterSection>

                {/* Size Filter */}
                <FilterSection title={t.products.size} section="size">
                    <div className="grid grid-cols-3 gap-2">
                        {filterOptions.sizes.map((option) => (
                            <button
                                key={option.value}
                                onClick={() =>
                                    handleFilterToggle('size', option.value)
                                }
                                className={`px-3 py-2 text-body border rounded transition-all cursor-pointer ${
                                    isFilterActive(
                                        filters,
                                        'size',
                                        option.value,
                                    )
                                        ? 'border-dark-900 bg-dark-900 text-light-100'
                                        : 'border-light-400 bg-light-100 text-dark-900 hover:border-dark-700'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Color Filter */}
                <FilterSection title={t.products.color} section="color">
                    <div className="grid grid-cols-3 gap-3">
                        {filterOptions.colors.map((option) => {
                            // Get translated color name
                            const translatedLabel =
                                t.products.colors[
                                    option.value as keyof typeof t.products.colors
                                ] || option.label;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() =>
                                        handleFilterToggle(
                                            'color',
                                            option.value,
                                        )
                                    }
                                    className="flex flex-col items-center gap-2 group cursor-pointer"
                                    title={translatedLabel}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                                            isFilterActive(
                                                filters,
                                                'color',
                                                option.value,
                                            )
                                                ? 'border-dark-900 scale-110'
                                                : 'border-light-400 group-hover:border-dark-700'
                                        }`}
                                        style={{ backgroundColor: option.hex }}
                                    />
                                    <span className="text-footnote text-dark-700 group-hover:text-dark-900">
                                        {translatedLabel}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* Price Range Filter */}
                <FilterSection title={t.products.price} section="price">
                    {filterOptions.priceRanges.map((range) => {
                        // Get translated price range label
                        let translatedLabel = range.label;
                        if (range.min === 0 && range.max === 50) {
                            translatedLabel = t.products.priceRanges.under50;
                        } else if (range.min === 50 && range.max === 100) {
                            translatedLabel = t.products.priceRanges['50to100'];
                        } else if (range.min === 100 && range.max === 150) {
                            translatedLabel =
                                t.products.priceRanges['100to150'];
                        } else if (range.min === 150 && range.max === 999999) {
                            translatedLabel = t.products.priceRanges.over150;
                        }

                        return (
                            <label
                                key={range.label}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        filters.minPrice ===
                                            range.min.toString() &&
                                        filters.maxPrice ===
                                            range.max.toString()
                                    }
                                    onChange={() => {
                                        const newFilters = {
                                            ...filters,
                                            minPrice: range.min.toString(),
                                            maxPrice: range.max.toString(),
                                        };
                                        setFilters(newFilters);
                                        updateURL(newFilters);
                                        // Close mobile drawer after selecting price range
                                        setIsOpen(false);
                                    }}
                                    className="w-5 h-5 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 cursor-pointer"
                                />
                                <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                                    {translatedLabel}
                                </span>
                            </label>
                        );
                    })}
                </FilterSection>

                {/* Clear Filters */}
                <button
                    onClick={handleClearAll}
                    className="w-full py-3 text-body-medium text-dark-900 border border-dark-900 rounded hover:bg-dark-900 hover:text-light-100 transition-colors cursor-pointer"
                >
                    {t.products.clearAllFilters}
                </button>
            </div>
        );
    }
}
