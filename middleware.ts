import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  // Create a Supabase client for server-side
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to login if not authenticated
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check user role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  console.log('Middleware - User:', session.user.email);
  console.log('Middleware - Profile:', profile);
  console.log('Middleware - Error:', profileError);

  // If table doesn't exist, redirect to login with warning
  if (profileError && (profileError.code === 'PGRST116' || profileError.code === '42P01')) {
    console.warn('user_profiles table not found. Please run supabase-auth-schema.sql');
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'setup_required');
    return NextResponse.redirect(redirectUrl);
  }

  // If profile doesn't exist for this user
  if (profileError || !profile) {
    console.error('No profile found for user:', session.user.email);
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'no_profile');
    return NextResponse.redirect(redirectUrl);
  }

  // Allow access only for admin and superadmin
  if (profile.role !== 'admin' && profile.role !== 'superadmin') {
    console.warn('User role not authorized:', profile.role);
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('Middleware - Access granted for:', session.user.email, 'Role:', profile.role);

  return response;
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
