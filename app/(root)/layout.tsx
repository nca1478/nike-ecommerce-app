import { Footer, Navbar } from '@/components';
import { Suspense } from 'react';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Suspense fallback={<div className="h-20" />}>
                <Navbar />
            </Suspense>

            {children}

            <Footer />
        </>
    );
}
