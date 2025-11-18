import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const dashboardRoutes = [
  '/dashboard-home',
  '/dashboard-menu',
  '/dashboard-news',
  '/dashboard-faq'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is a dashboard route
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  // Lightweight auth check using JWT cookie only (avoid Supabase refresh here)
  let isAuthenticated = false;
  try {
    const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0];
    const accessCookieName = `sb-${projectRef}-auth-token`;
    // Presence-only check to avoid any runtime incompatibilities
    isAuthenticated = !!request.cookies.get(accessCookieName)?.value;
  } catch {}

  if (!isAuthenticated) {
    // Redirect to login if not authenticated and scrub sb-* cookies on the response
    console.log('Middleware - No valid session, redirecting to login');
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    const res = NextResponse.redirect(redirectUrl);

    try {
      const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
      const projectRef = url.hostname.split('.')[0];
      const targets = [
        `sb-${projectRef}-auth-token`,
        `sb-${projectRef}-refresh-token`,
      ];
      const domainHost = request.nextUrl.hostname;
      const domains: (string | undefined)[] = [undefined, domainHost, 'localhost', '127.0.0.1'];
      for (const name of targets) {
        for (const domain of domains) {
          // Lax + non-secure and secure
          res.cookies.set({ name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax', ...(domain ? { domain } : {}) });
          res.cookies.set({ name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax', secure: true, ...(domain ? { domain } : {}) });
          // None (some browsers may require this for deletion symmetry)
          res.cookies.set({ name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'none', secure: true, ...(domain ? { domain } : {}) });
          // Raw header with Partitioned attribute for CHIPS (best-effort)
          const base = `${name}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          const dm = domain ? `; Domain=${domain}` : '';
          res.headers.append('Set-Cookie', `${base}${dm}; SameSite=None; Secure; Partitioned`);
        }
      }
    } catch {}

    return res;
  }

  // Auth looks okay; role checks are enforced server-side in layout
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard-home/:path*',
    '/dashboard-menu/:path*',
    '/dashboard-news/:path*',
    '/dashboard-faq/:path*'
  ]
};
