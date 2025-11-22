'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/hooks';
import { signOut } from '@/lib/auth/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { CartIcon } from '@/components/Cart/CartIcon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '@/lib/i18n';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, loading, refresh } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useI18n();

    const navLinks = [
        { href: '/products?gender=men', label: t.nav.men, gender: 'men' },
        { href: '/products?gender=women', label: t.nav.women, gender: 'women' },
        { href: '/products?gender=kids', label: t.nav.kids, gender: 'kids' },
        {
            href: '/products?gender=unisex',
            label: t.nav.unisex,
            gender: 'unisex',
        },
    ];

    const currentGender = searchParams.get('gender');

    const isActiveLink = (gender: string) => {
        return currentGender === gender;
    };

    const handleLogout = async () => {
        const result = await signOut();
        if (result.success) {
            await refresh();
            const { useCartStore } = await import('@/lib/store/cart.store');
            useCartStore.getState().clearCart();
            router.push('/');
            router.refresh();
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsMenuOpen(false);
            router.push(
                `/products?search=${encodeURIComponent(searchQuery.trim())}`,
            );
        }
    };

    return (
        <nav className="bg-light-100 sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-light-200 border-b border-light-300">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-end h-9 text-sm">
                        <div className="flex items-center space-x-3">
                            {!loading && (
                                <>
                                    {user ? (
                                        <div className="flex items-center space-x-3">
                                            <span className="text-dark-900 font-medium">
                                                {t.nav.hi},{' '}
                                                {user.name ||
                                                    user.email?.split('@')[0]}
                                            </span>
                                            <span className="text-dark-500">
                                                |
                                            </span>
                                            <Link
                                                href="/orders"
                                                className="text-dark-900 hover:text-dark-700 transition-colors"
                                            >
                                                {t.nav.myOrders}
                                            </Link>
                                            <span className="text-dark-500">
                                                |
                                            </span>
                                            <button
                                                onClick={handleLogout}
                                                className="text-dark-900 hover:text-dark-700 transition-colors cursor-pointer"
                                            >
                                                {t.nav.logout}
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/sign-in"
                                            className="text-dark-900 hover:text-dark-700 transition-colors"
                                        >
                                            {t.nav.signIn}
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="border-b border-light-300">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        {/* Logo - Fixed width */}
                        <div className="w-[200px] shrink-0">
                            <Link href="/" className="inline-block">
                                <Image
                                    src="/logo.svg"
                                    alt="Nike Logo"
                                    width={60}
                                    height={22}
                                    className="h-6 w-auto invert"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Center Navigation - Desktop */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center space-x-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-dark-900 hover:text-dark-700 transition-colors text-base font-medium px-2 py-1 border-b-2 ${
                                            isActiveLink(link.gender)
                                                ? 'border-dark-900'
                                                : 'border-transparent hover:border-dark-900'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div
                            className="hidden md:flex items-center justify-end space-x-1 lg:space-x-2 shrink-0"
                            style={{ width: '200px' }}
                        >
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onBlur={() => setSearchQuery('')}
                                        placeholder={t.nav.search}
                                        className="w-28 lg:w-32 focus:w-52 pl-9 pr-3 py-1.5 bg-light-200 rounded-full text-sm text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 transition-all duration-300 ease-in-out"
                                    />
                                    <svg
                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-700"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </form>

                            {/* Language Switcher */}
                            <LanguageSwitcher />

                            {/* Cart Icon */}
                            <CartIcon />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden ml-auto p-2 rounded-md text-dark-900 hover:bg-light-200"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-b border-light-300 bg-light-100">
                    <div className="px-6 py-6">
                        {/* Actions Row - Top */}
                        <div className="flex items-center justify-between mb-4">
                            <div onClick={() => setIsMenuOpen(false)}>
                                <CartIcon />
                            </div>
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Search */}
                        <form
                            onSubmit={handleSearch}
                            className="relative w-full mb-6"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={() => setSearchQuery('')}
                                placeholder={t.nav.search}
                                className="w-full pl-12 pr-4 py-3.5 bg-light-200 rounded-lg text-base text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:bg-white transition-all"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-700"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>

                        {/* Mobile Navigation Links */}
                        <nav className="space-y-0">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block py-4 text-dark-900 transition-all font-semibold text-xl border-b border-light-300 last:border-b-0 ${
                                        isActiveLink(link.gender)
                                            ? 'text-dark-900'
                                            : 'text-dark-600'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </nav>
    );
}
