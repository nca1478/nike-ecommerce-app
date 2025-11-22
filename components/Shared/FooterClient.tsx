'use client';

import { useI18n } from '@/lib/i18n';

export function FooterClient() {
    const { t } = useI18n();

    return (
        <div className="flex items-center gap-2 text-caption text-dark-500">
            <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                />
            </svg>
            <span>{t.footer.location}</span>
            <span className="ml-4">{t.footer.copyright}</span>
        </div>
    );
}
