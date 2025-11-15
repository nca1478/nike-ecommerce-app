import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Nike - Authentication",
    description: "Sign in or create your Nike account",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Brand section */}
            <div className="hidden w-1/2 bg-dark-900 p-12 lg:flex lg:flex-col lg:justify-between">
                <div>
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Nike Logo"
                            width={60}
                            height={60}
                            className="mb-16"
                        />
                    </Link>
                    <h1 className="mb-6 text-heading-2 font-bold leading-tight text-light-100">
                        Just Do It
                    </h1>
                    <p className="max-w-md text-lead text-light-300">
                        Join millions of athletes and fitness enthusiasts who trust Nike for their
                        performance needs.
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-light-100"></div>
                    <div className="h-2 w-2 rounded-full bg-light-400"></div>
                    <div className="h-2 w-2 rounded-full bg-light-400"></div>
                </div>

                <p className="text-caption text-light-400">© 2024 Nike. All rights reserved.</p>
            </div>

            {/* Right side - Form section */}
            <div className="flex w-full flex-col items-center justify-center bg-light-200 px-6 py-12 lg:w-1/2 lg:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="mb-8 flex justify-center lg:hidden">
                        <Image src="/logo.svg" alt="Nike Logo" width={50} height={50} />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
