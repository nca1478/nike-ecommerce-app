'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
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

const LOCALE_COOKIE_NAME = 'nike-locale';

// Helper para obtener el idioma de la cookie
function getLocaleFromCookie(): Locale {
    if (typeof document === 'undefined') return 'es';

    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(`${LOCALE_COOKIE_NAME}=`),
    );

    if (localeCookie) {
        const locale = localeCookie.split('=')[1].trim() as Locale;
        if (locale === 'en' || locale === 'es') {
            return locale;
        }
    }

    return 'es'; // Default a español
}

// Helper para guardar el idioma en la cookie
function setLocaleToCookie(locale: Locale) {
    if (typeof document === 'undefined') return;

    // Cookie que expira en 1 año
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('es');
    const [mounted, setMounted] = useState(false);

    // Cargar el idioma de la cookie al montar
    useEffect(() => {
        const savedLocale = getLocaleFromCookie();
        setLocaleState(savedLocale);
        setMounted(true);
    }, []);

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

    // Evitar flash de contenido sin traducir
    if (!mounted) {
        return null;
    }

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
