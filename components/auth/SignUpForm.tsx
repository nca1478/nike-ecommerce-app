'use client';

import { useState } from 'react';
import { signUp } from '@/lib/auth/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';
    const { t } = useI18n();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signUp({ name, email, password });

            if (result.success) {
                router.push(redirectTo);
                router.refresh();
            } else {
                setError(result.error || t.auth.signUpError);
            }
        } catch {
            setError(t.auth.unexpectedError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                >
                    {t.auth.nameOptional}
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                    placeholder={t.auth.namePlaceholder}
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                >
                    {t.auth.email}
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                    placeholder={t.auth.emailPlaceholder}
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                >
                    {t.auth.password}
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                    placeholder={t.auth.passwordPlaceholder}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {t.auth.passwordRequirements}
                </p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? t.auth.creatingAccount : t.auth.createAccount}
            </button>
        </form>
    );
}
