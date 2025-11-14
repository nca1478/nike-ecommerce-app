"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const footerSections = [
    {
      title: "Featured",
      links: [
        { label: "Air Force 1", href: "/products/air-force-1" },
        { label: "Huarache", href: "/products/huarache" },
        { label: "Air Max 90", href: "/products/air-max-90" },
        { label: "Air Max 95", href: "/products/air-max-95" },
      ],
    },
    {
      title: "Shoes",
      links: [
        { label: "All Shoes", href: "/shoes" },
        { label: "Custom Shoes", href: "/shoes/custom" },
        { label: "Jordan Shoes", href: "/shoes/jordan" },
        { label: "Running Shoes", href: "/shoes/running" },
      ],
    },
    {
      title: "Clothing",
      links: [
        { label: "All Clothing", href: "/clothing" },
        { label: "Modest Wear", href: "/clothing/modest" },
        { label: "Hoodies & Pullovers", href: "/clothing/hoodies" },
        { label: "Shirts & Tops", href: "/clothing/shirts" },
      ],
    },
    {
      title: "Kids'",
      links: [
        { label: "Infant & Toddler Shoes", href: "/kids/infant" },
        { label: "Kids' Shoes", href: "/kids/shoes" },
        { label: "Kids' Jordan Shoes", href: "/kids/jordan" },
        { label: "Kids' Basketball Shoes", href: "/kids/basketball" },
      ],
    },
  ];

  const socialLinks = [
    { icon: "/x.svg", href: "https://twitter.com/nike", label: "Twitter" },
    {
      icon: "/facebook.svg",
      href: "https://facebook.com/nike",
      label: "Facebook",
    },
    {
      icon: "/instagram.svg",
      href: "https://instagram.com/nike",
      label: "Instagram",
    },
  ];

  const legalLinks = [
    { label: "Guides", href: "/guides" },
    { label: "Terms of Sale", href: "/terms-of-sale" },
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Nike Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <footer className="bg-dark-900 text-light-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo Section */}
          <div className="lg:col-span-1">
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Location & Copyright */}
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
              <span>Croatia</span>
              <span className="ml-4">
                © 2025 Nike, Inc. All Rights Reserved
              </span>
            </div>

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
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 mt-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-caption text-dark-500 hover:text-light-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
