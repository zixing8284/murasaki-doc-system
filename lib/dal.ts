import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/prisma/client';

export const REJECT_ROUTE = '/dashboard/reject';

/**
 * dal alias for Data Access Layer
 */

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

// You can then invoke the verifySession() function in your data requests, Server Actions, Route Handlers
export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  const session = await decrypt(cookie);

  if (!session || !session?.id) {
    redirect('/login');
  }

  return {
    isAuth: true,
    userId: session.id as number,
    type: session.type as string,
  };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
    });
    return user;
  } catch (error) {
    return null;
  }
});

export const checkSuperAdmin = cache(async () => {
  const user = await getUser();

  if (user?.type === 'super_admin') {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } else {
    redirect(REJECT_ROUTE);
  }
});
