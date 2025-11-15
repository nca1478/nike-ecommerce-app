'use client';

import { useState } from 'react';
import { signUp } from '@/lib/auth/actions';
import { useRouter, useSearchParams } from 'next/navigation';

export function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

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
                setError(result.error || 'Error al crear la cuenta');
            }
        } catch {
            setError('Error inesperado al crear la cuenta');
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
                    Nombre (opcional)
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="Tu nombre"
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="tu@email.com"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                >
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Mínimo 8 caracteres, incluye mayúsculas, minúsculas y
                    números
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
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
        </form>
    );
}
