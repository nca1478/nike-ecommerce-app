'use client';

import { signOut } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserMenuProps {
    user: {
        id: string;
        name?: string | null;
        email: string;
        image?: string | null;
    };
}

export function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        await signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm">
                Hola, {user.name || user.email.split('@')[0]}
            </span>
            <button
                onClick={handleSignOut}
                disabled={loading}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
                {loading ? 'Cerrando...' : 'Cerrar Sesión'}
            </button>
        </div>
    );
}
