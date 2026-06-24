import { NextResponse, NextRequest } from 'next/server';
import { decrypt } from './lib/session';

/*
 * *: zero or more
 * +: one or more
 * ?: zero or one
 * {n}: exactly n
 * {n,}: at least n
 * {n,m}: at least n but no more than m
 * ^: start of string
 * $: end of string
 * (): group
 * []: character class
 * |: or
 * \d: digit
 * \w: word character
 * \s: whitespace
 * \D: not digit
 * \W: not word character
 * \S: not whitespace
 */

// pesudo code
// const adminOnlyPathRegex = [
// new RegExp('^/admin/.*$'),
// ]
// if no valid:
// if (adminOnlyPathRegex.some((regex) => regex.test(pathname))) {
//   return NextResponse.rewrite(new URL('/403', req.url))
// }

const routeMatcher = (protectedRoutes: string[], pathname: string): boolean =>
  protectedRoutes.some((route) => pathname.startsWith(route));

const redirectRoutes = ['/', '/login'];
const rejectRoutes = '/dashboard/reject';
const superAdminRoutes = ['/dashboard/admin'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isRedirectRoute = redirectRoutes.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const user = await decrypt(cookie);
  const isSuperAdmin = user?.type === 'super_admin';

  // Redirect to /login if the user is not authenticated
  if (isOnDashboard && !user?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to /dashboard if the user is authenticated
  if (isRedirectRoute && user?.id && !isOnDashboard) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Redirect to /dashboard/reject if the user type is not 'super_admin' when accessing protected routes
  if (routeMatcher(superAdminRoutes, req.nextUrl.pathname) && !isSuperAdmin) {
    return NextResponse.redirect(new URL(rejectRoutes, req.nextUrl));
  }

  // unauthorized user can't access /public/file
  if (!user?.id && path.startsWith('/file')) {
    console.log("unauthorized user can't access /public/file");
    return NextResponse.error();
  }
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
