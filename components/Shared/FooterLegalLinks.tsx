'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export function FooterLegalLinks() {
    const { t } = useI18n();

    const legalLinks = [
        { label: t.footer.guides, href: '/legal/guides' },
        { label: t.footer.termsOfSale, href: '/legal/terms-of-sale' },
        { label: t.footer.termsOfUse, href: '/legal/terms-of-use' },
        { label: t.footer.privacyPolicy, href: '/legal/privacy-policy' },
    ];

    return (
        <>
            {legalLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-caption text-dark-500 hover:text-light-100 transition-colors"
                >
                    {link.label}
                </Link>
            ))}
        </>
    );
}
