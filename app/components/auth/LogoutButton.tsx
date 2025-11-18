'use client';

import { supabase } from '@/lib/supabase';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

// Use a form with server action so redirect and cookie clearing work reliably
export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const preLogout = () => {
    // Best-effort: clear client-side session immediately
    try {
      supabase.auth.signOut();
      // Remove any persisted tokens in storage
      if (typeof window !== 'undefined') {
        const toDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth-token') || key.includes('refresh-token')) {
            toDelete.push(key);
          }
        }
        toDelete.forEach(k => localStorage.removeItem(k));
      }
    } catch {}
  };

  return (
    <form action="/api/auth/logout" method="post">
      <button type="submit" onClick={preLogout} className={className}>
        {children || 'Logout'}
      </button>
    </form>
  );
}
