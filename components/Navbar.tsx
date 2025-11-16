'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/products?gender=men', label: 'Men' },
        { href: '/products?gender=women', label: 'Women' },
        { href: '/products?gender=kids', label: 'Kids' },
        { href: '/collections', label: 'Collections' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="bg-light-100 border-b border-light-300 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-dark-900 hover:text-dark-700 transition-colors text-body font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            className="text-dark-900 hover:text-dark-700 transition-colors"
                            aria-label="Search"
                        >
                            Search
                        </button>
                        <Link
                            href="/cart"
                            className="text-dark-900 hover:text-dark-700 transition-colors"
                        >
                            My Cart (2)
                        </Link>
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

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-light-300 bg-light-100">
                    <div className="px-4 pt-2 pb-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-dark-900 hover:text-dark-700 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-light-300 space-y-3">
                            <button className="block w-full text-left py-2 text-dark-900">
                                Search
                            </button>
                            <Link
                                href="/cart"
                                className="block py-2 text-dark-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                My Cart (2)
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
