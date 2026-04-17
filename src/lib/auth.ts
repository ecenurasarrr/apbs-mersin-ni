import { cookies } from 'next/headers';

const SESSION_COOKIE = 'apbs_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

export async function createSession(userId: number) {
  const payload = JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }); // 7 gün
  const encoded = Buffer.from(payload).toString('base64');
  (await cookies()).set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function getSession(): Promise<{ userId: number } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}
