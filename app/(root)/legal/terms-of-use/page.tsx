'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function TermsOfUsePage() {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-light-100">
            <div className="mx-auto max-w-4xl px-6 py-12">
                <Link
                    href="/"
                    className="mb-8 inline-block text-body text-dark-700 hover:text-dark-900"
                >
                    {t.legal.backToHome}
                </Link>

                <h1 className="mb-4 text-heading-2 font-bold text-dark-900">
                    {t.legal.termsOfUse.title}
                </h1>
                <p className="mb-8 text-caption text-dark-700">
                    {t.legal.termsOfUse.lastUpdated}
                </p>

                <div className="space-y-8">
                    <section>
                        <p className="text-body text-dark-700 mb-6">
                            {t.legal.termsOfUse.intro}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.termsOfUse.section1.title}
                        </h2>
                        <p className="text-body text-dark-700">
                            {t.legal.termsOfUse.section1.content}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.termsOfUse.section2.title}
                        </h2>
                        <p className="text-body text-dark-700">
                            {t.legal.termsOfUse.section2.content}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.termsOfUse.section3.title}
                        </h2>
                        <p className="text-body text-dark-700">
                            {t.legal.termsOfUse.section3.content}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.termsOfUse.section4.title}
                        </h2>
                        <p className="text-body text-dark-700">
                            {t.legal.termsOfUse.section4.content}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
