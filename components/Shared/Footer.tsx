import Image from 'next/image';
import Link from 'next/link';
import { getFooterProducts, type FooterSection } from '@/lib/actions/product';
import { FooterClient } from './FooterClient';
import { FooterLegalLinks } from './FooterLegalLinks';

export async function Footer() {
    const footerSections: FooterSection[] = await getFooterProducts();

    const socialLinks = [
        { icon: '/x.svg', href: 'https://twitter.com/nike', label: 'Twitter' },
        {
            icon: '/facebook.svg',
            href: 'https://facebook.com/nike',
            label: 'Facebook',
        },
        {
            icon: '/instagram.svg',
            href: 'https://instagram.com/nike',
            label: 'Instagram',
        },
    ];

    return (
        <footer className="bg-dark-900 text-light-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Logo Section */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/logo.svg"
                                alt="Nike Logo"
                                width={60}
                                height={22}
                                className="h-6 w-auto brightness-0 invert"
                            />
                        </Link>
                    </div>

                    {/* Footer Links Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-body-medium font-medium mb-4 text-light-100">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-caption text-dark-500 hover:text-light-100 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-dark-700 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                        {/* Location & Copyright */}
                        <FooterClient />

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-dark-700 hover:bg-dark-500 flex items-center justify-center transition-colors"
                                    aria-label={social.label}
                                >
                                    <Image
                                        src={social.icon}
                                        alt={social.label}
                                        width={16}
                                        height={16}
                                        className="brightness-0 invert"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
                        <FooterLegalLinks />
                    </div>
                </div>
            </div>
        </footer>
    );
}
