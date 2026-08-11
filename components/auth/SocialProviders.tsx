'use client';

import { Chrome, Apple } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { signInWithSocial } from '@/lib/auth/actions';
import { useTransition } from 'react';
import { toast } from 'react-hot-toast';

interface SocialProvidersProps {
    redirectTo?: string;
}

export default function SocialProviders({
    redirectTo = '/',
}: SocialProvidersProps) {
    const { t } = useI18n();
    const [isPending, startTransition] = useTransition();

    const handleGoogleSignIn = () => {
        startTransition(async () => {
            const result = await signInWithSocial('google', redirectTo);

            if (!result.success || !result.data?.url) {
                toast.error(
                    result.error || t.auth.unexpectedErrorTryAgain,
                );
                return;
            }

            window.location.assign(result.data.url);
        });
    };

    return (
        <div className="w-full space-y-3">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isPending}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-light-300 bg-light-100 px-4 py-3 text-body-medium font-medium text-dark-900 transition-all duration-200 hover:bg-light-200 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
                <Chrome className="h-5 w-5" />
                {isPending
                    ? t.auth.connectingWithGoogle
                    : t.auth.continueWithGoogle}
            </button>

            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-light-300 bg-light-100 px-4 py-3 text-body-medium font-medium text-dark-900 transition-all duration-200 hover:bg-light-200 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 active:scale-[0.98] cursor-pointer"
            >
                <Apple className="h-5 w-5" />
                {t.auth.continueWithApple}
            </button>
        </div>
    );
}