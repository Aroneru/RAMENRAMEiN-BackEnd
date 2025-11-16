// ============================================
// Auth Types
// ============================================

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  role?: UserRole;
  avatar_url?: string | null;
  is_active?: boolean;
}

export interface UserProfileUpdate {
  full_name?: string | null;
  role?: UserRole;
  avatar_url?: string | null;
  is_active?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
}
