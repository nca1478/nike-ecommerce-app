'use client';

import { useI18n } from '@/lib/i18n';

export function FooterClient() {
    const { t } = useI18n();

    return (
        <div className="flex items-center justify-center md:justify-start gap-2 text-caption text-dark-500">
            <span className="md:ml-4">{t.footer.copyright}</span>
        </div>
    );
}
