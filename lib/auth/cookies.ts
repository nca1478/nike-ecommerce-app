import { cookies } from "next/headers";

const GUEST_SESSION_COOKIE = "guest_session";
const AUTH_SESSION_COOKIE = "auth_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  path: string;
  maxAge: number;
}

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export async function setGuestSessionCookie(sessionToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, sessionToken, defaultCookieOptions);
}

export async function getGuestSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_SESSION_COOKIE)?.value;
}

export async function deleteGuestSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_SESSION_COOKIE);
}

export async function getAuthSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE)?.value;
}

export { GUEST_SESSION_COOKIE, AUTH_SESSION_COOKIE };
