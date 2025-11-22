'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function GuidesPage() {
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

                <h1 className="mb-8 text-heading-2 font-bold text-dark-900">
                    {t.legal.guides.title}
                </h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.guides.sizeGuide.title}
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            {t.legal.guides.sizeGuide.description}
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                {t.legal.guides.sizeGuide.howToMeasure}
                            </h3>
                            <ol className="list-decimal space-y-2 pl-5 text-body text-dark-700">
                                <li>{t.legal.guides.sizeGuide.step1}</li>
                                <li>{t.legal.guides.sizeGuide.step2}</li>
                                <li>{t.legal.guides.sizeGuide.step3}</li>
                                <li>{t.legal.guides.sizeGuide.step4}</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.guides.careInstructions.title}
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            {t.legal.guides.careInstructions.description}
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                {t.legal.guides.careInstructions.generalTips}
                            </h3>
                            <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                                <li>{t.legal.guides.careInstructions.tip1}</li>
                                <li>{t.legal.guides.careInstructions.tip2}</li>
                                <li>{t.legal.guides.careInstructions.tip3}</li>
                                <li>{t.legal.guides.careInstructions.tip4}</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.guides.shippingReturns.title}
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            {t.legal.guides.shippingReturns.description}
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                {t.legal.guides.shippingReturns.returnProcess}
                            </h3>
                            <ol className="list-decimal space-y-2 pl-5 text-body text-dark-700">
                                <li>{t.legal.guides.shippingReturns.step1}</li>
                                <li>{t.legal.guides.shippingReturns.step2}</li>
                                <li>{t.legal.guides.shippingReturns.step3}</li>
                                <li>{t.legal.guides.shippingReturns.step4}</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            {t.legal.guides.productTechnology.title}
                        </h2>
                        <p className="text-body text-dark-700">
                            {t.legal.guides.productTechnology.description}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
