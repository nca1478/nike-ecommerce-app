'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCurrentUser } from './actions';

interface User {
    id: string;
    name?: string | null;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        try {
            setLoading(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        refresh: loadUser,
    };
}
