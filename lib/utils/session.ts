'use server';

import { getCurrentUser, createGuestSession } from '@/lib/auth/actions';

/**
 * Asegurar que existe una sesión (usuario o invitado)
 */
export async function ensureSession(): Promise<{
    isAuthenticated: boolean;
    hasSession: boolean;
}> {
    const user = await getCurrentUser();

    if (user) {
        return {
            isAuthenticated: true,
            hasSession: true,
        };
    }

    // Si no hay usuario, crear sesión de invitado
    const result = await createGuestSession();

    return {
        isAuthenticated: false,
        hasSession: result.success,
    };
}
