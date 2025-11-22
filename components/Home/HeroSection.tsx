'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export const HeroSection = () => {
    const { t } = useI18n();

    return (
        <section
            className="relative from-gray-100 to-gray-200 overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/hero-bg.png)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 z-10">
                        <p className="text-pink-500 font-semibold text-sm uppercase tracking-wide">
                            {t.home.hero.badge}
                        </p>
                        <h1 className="text-5xl lg:text-6xl font-black text-dark-900 leading-tight">
                            {t.home.hero.title}
                            <br />
                            {t.home.hero.titleLine2}
                        </h1>
                        <p className="text-lg text-dark-700 max-w-md">
                            {t.home.hero.description}
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-dark-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-dark-700 transition-colors duration-300"
                        >
                            {t.home.hero.cta}
                        </Link>
                    </div>

                    {/* Right Content - Shoe Image */}
                    <div className="relative">
                        {/* Background decorative elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl"></div>
                        </div>

                        {/* Shoe Image */}
                        <div className="relative z-10 hidden lg:block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/hero-shoe.png"
                                alt="Nike Air Jordan"
                                className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
                            />
                            {/* AIR Text */}
                            <div className="absolute top-1/4 right-0 text-orange-500 font-black text-6xl lg:text-8xl opacity-80">
                                AIR
                            </div>
                            {/* JORDEN Text */}
                            <div className="absolute bottom-1/4 right-0 text-dark-900 font-black text-5xl lg:text-7xl">
                                JORDEN
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
