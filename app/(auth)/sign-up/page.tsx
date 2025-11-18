'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthForm, SocialProviders } from '@/components';
import { signUp } from '@/lib/auth/actions';
import { useState, Suspense } from 'react';

function SignUpContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const redirect = searchParams.get('redirect') || '/';
    const action = searchParams.get('action');

    // Mensaje personalizado si viene del checkout
    const isFromCheckout = action === 'checkout';

    const handleSignUp = async (data: {
        email: string;
        password: string;
        name?: string;
    }) => {
        const result = await signUp({
            email: data.email,
            password: data.password,
            name: data.name || 'Usuario',
        });

        if (result.success) {
            setIsRedirecting(true);
            // Redirigir después de registro exitoso
            router.push(redirect);
            router.refresh();
        }

        return result;
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <p className="text-caption text-dark-700">
                    Already have an account?{' '}
                    <Link
                        href={`/sign-in${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                        className="font-medium text-dark-900 underline hover:no-underline"
                    >
                        Sign In
                    </Link>
                </p>
                <h2 className="text-heading-3 font-bold text-dark-900">
                    {isFromCheckout
                        ? 'Create Account to Continue'
                        : 'Join Nike Today!'}
                </h2>
                <p className="text-body text-dark-700">
                    {isFromCheckout
                        ? 'Create your account to complete your purchase'
                        : 'Create your account to start your fitness journey'}
                </p>
            </div>

            <SocialProviders />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-light-300"></div>
                </div>
                <div className="relative flex justify-center text-caption">
                    <span className="bg-light-200 px-4 text-dark-700">
                        Or sign up with
                    </span>
                </div>
            </div>

            <AuthForm
                type="sign-up"
                onSubmit={handleSignUp}
                isLoading={isRedirecting}
            />
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpContent />
        </Suspense>
    );
}
