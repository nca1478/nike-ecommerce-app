import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/orders'];

// Rutas públicas que no requieren autenticación (excepciones)
const publicRoutes = ['/checkout/success'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verificar si es una ruta pública (excepción)
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // Si es una ruta pública, permitir acceso sin autenticación
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Verificar si la ruta requiere autenticación
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // Verificar si hay sesión de autenticación
    // Buscar todas las posibles variantes de cookies de sesión
    const allCookies = request.cookies.getAll();
    const authSession =
        request.cookies.get('auth_session') ||
        request.cookies.get('auth.session_token') ||
        request.cookies.get('better-auth.session_token') ||
        // En producción, better-auth puede usar el prefijo completo
        allCookies.find(
            (cookie) =>
                cookie.name.includes('session') && cookie.name.includes('auth'),
        );

    // Si es una ruta protegida y no hay sesión, redirigir a login
    if (isProtectedRoute && !authSession) {
        const url = new URL('/sign-in', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Si está autenticado y trata de acceder a signin/signup, redirigir a home
    if (authSession && (pathname === '/sign-in' || pathname === '/sign-up')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
