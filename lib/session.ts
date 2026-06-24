import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload, SafeUser } from '@/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: SafeUser) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ ...payload, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    // Prevents client-side JavaScript from accessing the cookie.
    httpOnly: true,
    // Use https to send the cookie.
    secure: false,
    // Specify whether the cookie can be sent with cross-site requests.
    sameSite: 'lax',
    // Delete the cookie after a certain period.
    expires: expiresAt,
    // Define the URL path for the cookie.
    path: '/',
  });
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

// TODO: we should define a type for the payload

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  // const session = cookies().get('session')?.value;
  const session = request.cookies.get('session')?.value;
  if (!session) return null;
  const payload = await decrypt(session);
  if (!payload) return null;

  // Refresh the session so that it doesn't expire
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires,
    path: '/',
  });

  return res;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
