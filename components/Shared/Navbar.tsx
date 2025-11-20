'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/hooks';
import { signOut } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { CartIcon } from '@/components/Cart/CartIcon';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, loading, refresh } = useAuth();
    const router = useRouter();

    const navLinks = [
        { href: '/products?gender=men', label: 'Men' },
        { href: '/products?gender=women', label: 'Women' },
        { href: '/products?gender=kids', label: 'Kids' },
        { href: '/products?gender=unisex', label: 'Unisex' },
    ];

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
                    <div className="flex items-center justify-end h-9 text-xs">
                        <div className="flex items-center space-x-4">
                            {!loading && (
                                <>
                                    {user ? (
                                        <>
                                            <span className="text-dark-900 font-medium">
                                                Hi,{' '}
                                                {user.name ||
                                                    user.email?.split('@')[0]}
                                            </span>
                                            <button
                                                onClick={handleLogout}
                                                className="text-dark-900 hover:text-dark-700 transition-colors cursor-pointer"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/sign-in"
                                            className="text-dark-900 hover:text-dark-700 transition-colors"
                                        >
                                            Sign In
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
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="shrink-0">
                            <Image
                                src="/logo.svg"
                                alt="Nike Logo"
                                width={60}
                                height={22}
                                className="h-6 w-auto invert"
                                priority
                            />
                        </Link>

                        {/* Center Navigation - Desktop */}
                        <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
                            <div className="flex items-center space-x-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-dark-900 hover:text-dark-700 transition-colors text-base font-medium px-2 py-1 hover:border-b-2 hover:border-dark-900"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search"
                                        className="w-44 lg:w-52 pl-10 pr-4 py-2 bg-light-200 rounded-full text-sm text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 transition-all"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-700"
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

                            {/* Cart Icon */}
                            <CartIcon />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md text-dark-900 hover:bg-light-200"
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
                    <div className="px-4 pt-4 pb-4 space-y-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 bg-light-200 rounded-full text-sm text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-700"
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
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-dark-900 hover:text-dark-700 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile User Actions */}
                        <div className="pt-4 border-t border-light-300 space-y-3">
                            {!loading && (
                                <>
                                    {user ? (
                                        <>
                                            <div className="py-2 text-dark-900 text-sm font-medium">
                                                Hi,{' '}
                                                {user.name ||
                                                    user.email?.split('@')[0]}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="block w-full text-left py-2 text-dark-900 hover:text-dark-700 transition-colors cursor-pointer"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/sign-in"
                                            className="block w-full text-left py-2 text-dark-900 hover:text-dark-700 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                    )}
                                </>
                            )}
                            <div className="py-2">
                                <CartIcon />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
