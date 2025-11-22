'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, Translations } from './types';
import en from './locales/en.json';
import es from './locales/es.json';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Locale, Translations> = {
    en: en as Translations,
    es: es as Translations,
};

export const LOCALE_COOKIE_NAME = 'nike-locale';

// Helper para guardar el idioma en la cookie
function setLocaleToCookie(locale: Locale) {
    if (typeof document === 'undefined') return;

    // Cookie que expira en 1 año
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

interface I18nProviderProps {
    children: ReactNode;
    initialLocale?: Locale;
}

export function I18nProvider({
    children,
    initialLocale = 'es',
}: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        setLocaleToCookie(newLocale);
        // Actualizar el atributo lang del HTML
        if (typeof document !== 'undefined') {
            document.documentElement.lang = newLocale;
        }
    };

    const value: I18nContextType = {
        locale,
        setLocale,
        t: translations[locale],
    };

    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
