import { cookies } from 'next/headers';
import { Locale } from './types';
import { LOCALE_COOKIE_NAME } from './context';

export async function getServerLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME);

    if (localeCookie?.value === 'en' || localeCookie?.value === 'es') {
        return localeCookie.value as Locale;
    }

    return 'es'; // Default a español
}
