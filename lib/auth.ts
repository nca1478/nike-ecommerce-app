import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import * as schema from './db/schema';
import { GUEST_SESSION_COOKIE } from './auth/cookies';

// Extraer el valor de una cookie desde un encabezado Cookie
function getCookieValue(cookieHeader: string, name: string): string | undefined {
    const match = new RegExp(`(?:^|;)\\s*${name}=([^;]+)`).exec(cookieHeader);
    return match?.[1];
}

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // MVP: sin verificación
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    databaseHooks: {
        session: {
            create: {
                // Migrar el carrito de invitado también en el login por OAuth
                // (el callback de Google es un request HTTP real)
                after: async (session, context) => {
                    const cookieHeader =
                        context?.request?.headers.get('cookie') ?? '';
                    const guestToken = getCookieValue(
                        cookieHeader,
                        GUEST_SESSION_COOKIE,
                    );

                    if (!guestToken) return;

                    const { mergeGuestCartWithUserCart } = await import(
                        './auth/actions'
                    );
                    await mergeGuestCartWithUserCart(
                        guestToken,
                        session.userId,
                    );
                },
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7, // 7 días
        },
    },
    advanced: {
        cookiePrefix: 'auth',
        useSecureCookies: process.env.NODE_ENV === 'production',

        cookies: {
            session_token: {
                name: 'auth_session',
                attributes: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax', // Cambiado de 'strict' a 'lax' para producción
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                },
            },
        },

        database: {
            generateId: () => uuidv4(),
        },
    },
    plugins: [nextCookies()],

    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});

export type Session = typeof auth.$Infer.Session;
