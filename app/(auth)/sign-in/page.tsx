'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthForm, SocialProviders } from '@/components';
import { signIn } from '@/lib/auth/actions';
import { useState, Suspense } from 'react';
import { useI18n } from '@/lib/i18n';

function SignInContent() {
    const { t } = useI18n();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const redirect = searchParams.get('redirect') || '/';
    const action = searchParams.get('action');

    // Mensaje personalizado si viene del checkout
    const isFromCheckout = action === 'checkout';

    const handleSignIn = async (data: { email: string; password: string }) => {
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
                    {t.auth.dontHaveAccount}{' '}
                    <Link
                        href={`/sign-up${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                        className="font-medium text-dark-900 underline hover:no-underline"
                    >
                        {t.auth.signUp}
                    </Link>
                </p>
                <h2 className="text-heading-3 font-bold text-dark-900">
                    {isFromCheckout
                        ? t.auth.signInToContinue
                        : t.auth.welcomeBack}
                </h2>
                <p className="text-body text-dark-700">
                    {isFromCheckout
                        ? t.auth.signInToCompletePurchase
                        : t.auth.signInToContinueJourney}
                </p>
            </div>

            <SocialProviders redirectTo={redirect} />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-light-300"></div>
                </div>
                <div className="relative flex justify-center text-caption">
                    <span className="bg-light-200 px-4 text-dark-700">
                        {t.auth.orSignInWith}
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
                    {t.auth.forgotPassword}
                </Link>
            </div>
        </div>
    );
}

function LoadingFallback() {
    const { t } = useI18n();
    return <div>{t.common.loading}</div>;
}

export default function SignInPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <SignInContent />
        </Suspense>
    );
}
