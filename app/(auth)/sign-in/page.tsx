'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthForm, SocialProviders } from '@/components';
import { signIn } from '@/lib/auth/actions';
import { useEffect, useState } from 'react';

export default function SignInPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const redirect = searchParams.get('redirect') || '/';
    const action = searchParams.get('action');

    // Mensaje personalizado si viene del checkout
    const isFromCheckout = action === 'checkout';

    const handleSignIn = async (data: any) => {
        const result = await signIn(data);

        if (result.success) {
            setIsRedirecting(true);
            // Redirigir después de login exitoso
            router.push(redirect);
            router.refresh();
        }

        return result;
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <p className="text-caption text-dark-700">
                    Don&apos;t have an account?{' '}
                    <Link
                        href={`/sign-up${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                        className="font-medium text-dark-900 underline hover:no-underline"
                    >
                        Sign Up
                    </Link>
                </p>
                <h2 className="text-heading-3 font-bold text-dark-900">
                    {isFromCheckout ? 'Sign in to Continue' : 'Welcome Back!'}
                </h2>
                <p className="text-body text-dark-700">
                    {isFromCheckout
                        ? 'Please sign in to complete your purchase'
                        : 'Sign in to continue your fitness journey'}
                </p>
            </div>

            <SocialProviders />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-light-300"></div>
                </div>
                <div className="relative flex justify-center text-caption">
                    <span className="bg-light-200 px-4 text-dark-700">
                        Or sign in with
                    </span>
                </div>
            </div>

            <AuthForm
                type="sign-in"
                onSubmit={handleSignIn}
                isLoading={isRedirecting}
            />

            <div className="text-center">
                <Link
                    href="#"
                    className="text-caption text-dark-900 underline hover:no-underline"
                >
                    Forgot your password?
                </Link>
            </div>
        </div>
    );
}
