'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n';

interface AuthFormProps {
    type: 'sign-in' | 'sign-up';
    onSubmit: (data: {
        email: string;
        password: string;
        name?: string;
    }) => Promise<{
        success: boolean;
        data?: { userId: string };
        error?: string;
    }>;
    isLoading?: boolean;
}

export default function AuthForm({
    type,
    onSubmit,
    isLoading = false,
}: AuthFormProps) {
    const { t } = useI18n();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSignUp = type === 'sign-up';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('fullName') as string;

        setIsSubmitting(true);

        try {
            const result = await onSubmit({
                email,
                password,
                ...(isSignUp && { name }),
            });

            if (result?.success) {
                // La redirección se maneja en la página padre
                toast.success(
                    isSignUp
                        ? t.auth.accountCreatedSuccess
                        : t.auth.signedInSuccess,
                );
            } else if (result?.error) {
                // Traducir mensajes de error comunes
                let errorMessage = result.error;

                if (
                    errorMessage
                        .toLowerCase()
                        .includes('invalid email or password') ||
                    errorMessage
                        .toLowerCase()
                        .includes('invalid credentials') ||
                    errorMessage
                        .toLowerCase()
                        .includes('credenciales inválidas')
                ) {
                    errorMessage = t.auth.invalidCredentials;
                } else if (
                    errorMessage
                        .toLowerCase()
                        .includes('email already exists') ||
                    errorMessage.toLowerCase().includes('user already exists')
                ) {
                    errorMessage = t.auth.emailAlreadyExists;
                } else if (isSignUp) {
                    errorMessage = t.auth.errorRegisteringUser;
                }

                toast.error(errorMessage);
                setIsSubmitting(false);
            }
        } catch (e) {
            console.log('error', e);
            toast.error(t.auth.unexpectedErrorTryAgain);
            setIsSubmitting(false);
        }
    };

    return (
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
                <div className="space-y-2">
                    <label
                        htmlFor="fullName"
                        className="block text-caption font-medium text-dark-900"
                    >
                        {t.auth.name}
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder={t.auth.enterYourName}
                        className="w-full rounded-lg border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-500 focus:border-dark-900 focus:outline-none focus:ring-1 focus:ring-dark-900"
                        required
                    />
                </div>
            )}

            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="block text-caption font-medium text-dark-900"
                >
                    {t.auth.email}
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t.auth.emailPlaceholder}
                    className="w-full rounded-lg border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-500 focus:border-dark-900 focus:outline-none focus:ring-1 focus:ring-dark-900"
                    required
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="block text-caption font-medium text-dark-900"
                >
                    {t.auth.password}
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder={t.auth.minimumCharacters}
                        className="w-full rounded-lg border border-light-300 bg-light-100 px-4 py-3 pr-12 text-body text-dark-900 placeholder:text-dark-500 focus:border-dark-900 focus:outline-none focus:ring-1 focus:ring-dark-900"
                        required
                        minLength={8}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-700 hover:text-dark-900"
                        aria-label={
                            showPassword
                                ? t.auth.hidePassword
                                : t.auth.showPassword
                        }
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full rounded-full bg-dark-900 py-3.5 text-body-medium font-medium text-light-100 transition-colors hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {isSubmitting || isLoading
                    ? t.auth.processing
                    : isSignUp
                      ? t.auth.signUp
                      : t.auth.signIn}
            </button>

            {isSignUp && (
                <p className="text-center text-footnote text-dark-700">
                    {t.auth.bySigningUpAgree}{' '}
                    <a
                        href="#"
                        className="text-dark-900 underline hover:no-underline"
                    >
                        {t.auth.termsOfService}
                    </a>{' '}
                    {t.auth.and}{' '}
                    <a
                        href="#"
                        className="text-dark-900 underline hover:no-underline"
                    >
                        {t.auth.privacyPolicy}
                    </a>
                </p>
            )}
        </form>
    );
}
