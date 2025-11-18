'use server';

import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', maxAge: 0, ...options });
        },
      },
    }
  );

  // Get current user before revocation so we can admin-revoke if available
  const { data: { user } } = await supabase.auth.getUser();

  // Revoke current session
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
  }

  // Manually delete all Supabase auth cookies
  const allCookies = cookieStore.getAll();
  const hdrs = await headers();
  const hostHeader = hdrs.get('host');
  const domainHost = hostHeader ? hostHeader.split(':')[0] : undefined;
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-') || cookie.name.includes('auth-token') || cookie.name.includes('refresh-token')) {
      // Ensure deletion across the entire site path
      cookieStore.set({ name: cookie.name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax' });
      if (domainHost) cookieStore.set({ name: cookie.name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax', domain: domainHost });
      // Also attempt secure variant (in case cookie was set as Secure)
      cookieStore.set({ name: cookie.name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax', secure: true });
      if (domainHost) cookieStore.set({ name: cookie.name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax', secure: true, domain: domainHost });
      // SameSite=None + Secure for symmetry
      cookieStore.set({ name: cookie.name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'none', secure: true });
      if (domainHost) cookieStore.set({ name: cookie.name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'none', secure: true, domain: domainHost });
    }
  }

  // Explicitly target standard Supabase cookie names for this project
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    const projectRef = url.hostname.split('.')[0];
    const targets = [
      `sb-${projectRef}-auth-token`,
      `sb-${projectRef}-refresh-token`,
    ];
    const domains: (string | undefined)[] = [undefined, domainHost, 'localhost', '127.0.0.1'];
    for (const name of targets) {
      for (const domain of domains) {
        cookieStore.set({ name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax', ...(domain ? { domain } : {}) });
        cookieStore.set({ name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'lax', secure: true, ...(domain ? { domain } : {}) });
        cookieStore.set({ name, value: '', path: '/', maxAge: 0, expires: new Date(0), sameSite: 'none', secure: true, ...(domain ? { domain } : {}) });
      }
    }
  } catch {}

  // Redirect to login page
  redirect('/login');
}
