'use client';

import { useI18n } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
    const { locale, setLocale } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
        { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    ];

    const currentLanguage = languages.find((lang) => lang.code === locale);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLanguageChange = (code: 'en' | 'es') => {
        setLocale(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-light-200 transition-colors cursor-pointer"
                aria-label="Change language"
                aria-expanded={isOpen}
            >
                <Globe className="w-4 h-4 text-dark-900" />
                <span className="text-sm text-body-medium text-dark-900">
                    {currentLanguage?.code.toUpperCase()}
                </span>
            </button>

            {isOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-light-300 py-2 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full px-4 py-2 text-left hover:bg-light-200 transition-colors flex items-center gap-3 cursor-pointer ${
                                locale === lang.code
                                    ? 'bg-light-100 font-medium'
                                    : ''
                            }`}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="text-sm text-dark-900">
                                {lang.name}
                            </span>
                            {locale === lang.code && (
                                <span className="ml-auto text-dark-900">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
