'use client';

import { useAuth } from './AuthProvider';
import type { UserRole } from '@/lib/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole = 'user',
  fallback = <div>Access Denied</div>
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback;
  }

  // Check role hierarchy
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    admin: 2,
    superadmin: 3
  };

  const hasAccess = roleHierarchy[user.role] >= roleHierarchy[requiredRole];

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}
