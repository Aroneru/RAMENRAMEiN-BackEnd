'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@/lib/types/auth.types';
import { getCurrentUserProfile } from '@/lib/auth';
import { logoutAction } from '@/app/(auth)/login/logout-action';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const loadUser = async () => {
    try {
      const profile = await getCurrentUserProfile();
      setUser(profile);
      setLoading(false);
    } catch {
      // Silently handle errors - user is just not logged in
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Initial load with delay to avoid hydration issues
    const timer = setTimeout(() => {
      loadUser();
    }, 0);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          await loadUser();
        } else if (!session) {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ==============================
  // Idle auto-logout (5 minutes)
  // ==============================
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      // Only set idle timer when a user is logged in
      if (user) {
        idleTimeoutRef.current = setTimeout(async () => {
          try {
            // Use server action to ensure httpOnly cookies are cleared
            await logoutAction();
          } catch {
            // Fallback: clear client session
            await handleSignOut();
            // Hard redirect to login to avoid any stale state
            if (typeof window !== 'undefined') window.location.href = '/login';
          }
        }, IDLE_LIMIT_MS);
      }
    };

    // Activity events that reset the idle timer
    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove',
      'keydown',
      'click',
      'touchstart',
      'scroll',
      'focus'
    ];

    activityEvents.forEach((evt) => window.addEventListener(evt, resetIdleTimer));
    // Start/refresh timer now
    resetIdleTimer();

    const handleVisibility = () => {
      // When user returns to the tab, reset timer
      if (document.visibilityState === 'visible') resetIdleTimer();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      document.removeEventListener('visibilitychange', handleVisibility);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [user, IDLE_LIMIT_MS]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: handleSignOut,
        refreshUser: loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
