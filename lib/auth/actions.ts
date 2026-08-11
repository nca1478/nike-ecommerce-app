'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { guest } from '@/lib/db/schema';
import {
    signUpSchema,
    signInSchema,
    type SignUpInput,
    type SignInInput,
} from './validation';
import {
    setGuestSessionCookie,
    getGuestSessionCookie,
    deleteGuestSessionCookie,
} from './cookies';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

type ActionResult<T = void> = {
    success: boolean;
    error?: string;
    data?: T;
};

/**
 * Registrar un nuevo usuario
 */
export async function signUp(
    input: SignUpInput,
): Promise<ActionResult<{ userId: string }>> {
    try {
        // Validar entrada
        const validated = signUpSchema.parse(input);

        // Crear usuario con Better Auth
        const result = await auth.api.signUpEmail({
            body: {
                email: validated.email,
                password: validated.password,
                name: validated.name,
            },
        });

        if (!result || !result.user) {
            return {
                success: false,
                error: 'Error al crear la cuenta',
            };
        }

        // Obtener sesión de invitado si existe
        const guestSessionToken = await getGuestSessionCookie();

        // Si hay sesión de invitado, migrar datos
        if (guestSessionToken) {
            await mergeGuestCartWithUserCart(guestSessionToken, result.user.id);
        }

        return {
            success: true,
            data: { userId: result.user.id },
        };
    } catch (error) {
        console.error('Error en signUp:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al crear la cuenta',
        };
    }
}

/**
 * Iniciar sesión
 */
export async function signIn(
    input: SignInInput,
): Promise<ActionResult<{ userId: string }>> {
    try {
        // Validar entrada
        const validated = signInSchema.parse(input);

        // Iniciar sesión con Better Auth
        const result = await auth.api.signInEmail({
            body: {
                email: validated.email,
                password: validated.password,
            },
        });

        if (!result || !result.user) {
            return {
                success: false,
                error: 'Credenciales inválidas',
            };
        }

        // Obtener sesión de invitado si existe
        const guestSessionToken = await getGuestSessionCookie();

        // Si hay sesión de invitado, migrar datos
        if (guestSessionToken) {
            await mergeGuestCartWithUserCart(guestSessionToken, result.user.id);
        }

        return {
            success: true,
            data: { userId: result.user.id },
        };
    } catch (error) {
        console.error('Error en signIn:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al iniciar sesión',
        };
    }
}

/**
 * Cerrar sesión
 */
export async function signOut(): Promise<ActionResult> {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error('Error en signOut:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al cerrar sesión',
        };
    }
}

/**
 * Sanitizar callbackURL para aceptar solo rutas relativas internas
 * (evita open redirect)
 */
function sanitizeCallbackURL(callbackURL: string): string {
    if (!callbackURL) return '/';
    // Rechazar protocolos (http/https/javascript/data) y URLs absolutas/protocol-relative
    if (
        callbackURL.startsWith('//') ||
        /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(callbackURL)
    ) {
        return '/';
    }
    // Asegurar que empiece con '/' (ruta interna)
    return callbackURL.startsWith('/') ? callbackURL : `/${callbackURL}`;
}

/**
 * Iniciar sesión con proveedor social (Google)
 */
export async function signInWithSocial(
    provider: 'google',
    callbackURL = '/',
): Promise<ActionResult<{ url: string }>> {
    try {
        const sanitizedURL = sanitizeCallbackURL(callbackURL);

        const result = await auth.api.signInSocial({
            body: {
                provider,
                callbackURL: sanitizedURL,
            },
        });

        if (!result || !result.url) {
            return {
                success: false,
                error: 'Error al iniciar sesión con Google',
            };
        }

        return {
            success: true,
            data: { url: result.url },
        };
    } catch (error) {
        console.error('Error en signInWithSocial:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al iniciar sesión con Google',
        };
    }
}

/**
 * Crear sesión de invitado
 */
export async function createGuestSession(): Promise<
    ActionResult<{ sessionToken: string; guestId: string }>
> {
    try {
        // Verificar si ya existe una sesión de invitado
        const existingToken = await getGuestSessionCookie();
        if (existingToken) {
            // Verificar si la sesión es válida
            const existingGuest = await db.query.guest.findFirst({
                where: eq(guest.sessionToken, existingToken),
            });

            if (existingGuest && existingGuest.expiresAt > new Date()) {
                return {
                    success: true,
                    data: {
                        sessionToken: existingToken,
                        guestId: existingGuest.id,
                    },
                };
            }
        }

        // Crear nueva sesión de invitado
        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

        const [newGuest] = await db
            .insert(guest)
            .values({
                sessionToken,
                expiresAt,
            })
            .returning();

        // Establecer cookie
        await setGuestSessionCookie(sessionToken);

        return {
            success: true,
            data: {
                sessionToken,
                guestId: newGuest.id,
            },
        };
    } catch (error) {
        console.error('Error en createGuestSession:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al crear sesión de invitado',
        };
    }
}

/**
 * Obtener sesión de invitado actual
 */
export async function getGuestSession(): Promise<
    ActionResult<{ sessionToken: string | null }>
> {
    try {
        const sessionToken = await getGuestSessionCookie();

        if (!sessionToken) {
            return {
                success: true,
                data: { sessionToken: null },
            };
        }

        // Verificar si la sesión es válida
        const guestSession = await db.query.guest.findFirst({
            where: eq(guest.sessionToken, sessionToken),
        });

        if (!guestSession || guestSession.expiresAt < new Date()) {
            await deleteGuestSessionCookie();
            return {
                success: true,
                data: { sessionToken: null },
            };
        }

        return {
            success: true,
            data: { sessionToken },
        };
    } catch (error) {
        console.error('Error en getGuestSession:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al obtener sesión de invitado',
        };
    }
}

/**
 * Migrar carrito de invitado a usuario autenticado
 * Esta función debe ser llamada después de un login/registro exitoso
 */
export async function mergeGuestCartWithUserCart(
    guestSessionToken: string,
    userId: string,
): Promise<ActionResult> {
    try {
        // Buscar invitado por sessionToken
        const guestRecord = await db.query.guest.findFirst({
            where: eq(guest.sessionToken, guestSessionToken),
        });

        if (!guestRecord) {
            await deleteGuestSessionCookie();
            return {
                success: true,
            };
        }

        // Importar función de migración de carrito
        const { mergeGuestCartToUser } = await import('@/lib/actions/cart');

        // Migrar carrito
        await mergeGuestCartToUser(guestRecord.id, userId);

        // Eliminar sesión de invitado de la BD
        await db.delete(guest).where(eq(guest.id, guestRecord.id));

        // Eliminar cookie de invitado
        await deleteGuestSessionCookie();

        return {
            success: true,
        };
    } catch (error) {
        console.error('Error en mergeGuestCartWithUserCart:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al migrar el carrito',
        };
    }
}

/**
 * Obtener usuario actual
 */
export async function getCurrentUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        return session?.user ?? null;
    } catch (error) {
        console.error('Error en getCurrentUser:', error);
        return null;
    }
}

/**
 * Verificar si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user;
}

/**
 * Proteger ruta - redirigir a login si no está autenticado
 */
export async function requireAuth(redirectTo = '/auth/signin') {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect(redirectTo);
    }
}
