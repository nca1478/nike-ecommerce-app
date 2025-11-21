import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

const jost = Jost({
    variable: '--font-jost',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Nike',
    description: 'An e-commerce platform for Nike Shoes',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${jost.className} antialiased`}>
                <I18nProvider>
                    {children}
                    <Toaster position="top-center" />
                </I18nProvider>
            </body>
        </html>
    );
}
