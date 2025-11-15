'use client';

import Link from 'next/link';
import { AuthForm, SocialProviders } from '@/components';
import { signIn } from '@/lib/auth/actions';

export default function SignInPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <p className="text-caption text-dark-700">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/sign-up"
                        className="font-medium text-dark-900 underline hover:no-underline"
                    >
                        Sign Up
                    </Link>
                </p>
                <h2 className="text-heading-3 font-bold text-dark-900">
                    Welcome Back!
                </h2>
                <p className="text-body text-dark-700">
                    Sign in to continue your fitness journey
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

            <AuthForm type="sign-in" onSubmit={signIn} />

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
