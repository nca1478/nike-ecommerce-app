'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthForm, SocialProviders } from '@/components';
import { signUp } from '@/lib/auth/actions';
import { useState, Suspense } from 'react';
import { useI18n } from '@/lib/i18n';

function SignUpContent() {
    const { t } = useI18n();
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
                    {t.auth.alreadyHaveAccount}{' '}
                    <Link
                        href={`/sign-in${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                        className="font-medium text-dark-900 underline hover:no-underline"
                    >
                        {t.auth.signIn}
                    </Link>
                </p>
                <h2 className="text-heading-3 font-bold text-dark-900">
                    {isFromCheckout
                        ? t.auth.createAccountToContinue
                        : t.auth.joinNikeToday}
                </h2>
                <p className="text-body text-dark-700">
                    {isFromCheckout
                        ? t.auth.createAccountToCompletePurchase
                        : t.auth.createAccountToStart}
                </p>
            </div>

            <SocialProviders redirectTo={redirect} />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-light-300"></div>
                </div>
                <div className="relative flex justify-center text-caption">
                    <span className="bg-light-200 px-4 text-dark-700">
                        {t.auth.orSignUpWith}
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

function LoadingFallback() {
    const { t } = useI18n();
    return <div>{t.common.loading}</div>;
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <SignUpContent />
        </Suspense>
    );
}
