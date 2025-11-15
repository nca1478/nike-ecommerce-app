import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/checkout', '/profile', '/orders'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verificar si la ruta requiere autenticación
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // Verificar si hay sesión de autenticación
    const authSession = request.cookies.get('auth_session');

    // Si es una ruta protegida y no hay sesión, redirigir a login
    if (isProtectedRoute && !authSession) {
        const url = new URL('/auth/signin', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Si está autenticado y trata de acceder a signin/signup, redirigir a home
    if (
        authSession &&
        (pathname === '/auth/signin' || pathname === '/auth/signup')
    ) {
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
