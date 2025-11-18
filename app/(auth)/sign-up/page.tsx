'use client';

import Link from 'next/link';
import { AuthForm, SocialProviders } from '@/components';
import { signUp } from '@/lib/auth/actions';

export default function SignUpPage() {
    const handleSignUp = async (data: {
        email: string;
        password: string;
        name?: string;
    }) => {
        return signUp({
            email: data.email,
            password: data.password,
            name: data.name || 'Usuario',
        });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <p className="text-caption text-dark-700">
                    Already have an account?{' '}
                    <Link
                        href="/sign-in"
                        className="font-medium text-dark-900 underline hover:no-underline"
                    >
                        Sign In
                    </Link>
                </p>
                <h2 className="text-heading-3 font-bold text-dark-900">
                    Join Nike Today!
                </h2>
                <p className="text-body text-dark-700">
                    Create your account to start your fitness journey
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

            <AuthForm type="sign-up" onSubmit={handleSignUp} />
        </div>
    );
}
