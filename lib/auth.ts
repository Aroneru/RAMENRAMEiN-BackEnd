// ============================================
// Auth Helper Functions
// ============================================
import { supabase } from './supabase';
import type { UserProfile, UserRole, AuthUser } from './types/auth.types';

// ============================================
// Authentication Functions
// ============================================

// Sign up with email and password
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || ''
      }
    }
  });
  
  if (error) throw error;
  return data;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// Sign out with cache clearing
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  // Clear all local storage and session storage
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }
}

// Get current session
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session) return null;
    
    // Return user from session instead of calling getUser() which throws error
    return session.user;
  } catch (error) {
    // Silently return null if there's no session
    return null;
  }
}

// ============================================
// User Profile Functions
// ============================================

// Get current user profile with role
export async function getCurrentUserProfile(): Promise<AuthUser | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // Log detailed error info for debugging
      console.error('Error fetching user profile:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });

      // If table doesn't exist
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn('user_profiles table not found. Please run supabase-auth-schema.sql');
      }
      // If no rows returned (profile doesn't exist for this user)
      else if (error.code === 'PGRST116') {
        console.warn(`No profile found for user ${user.id}. Profile should have been created automatically.`);
      }
      
      // Return basic user info from auth without role
      return {
        id: user.id,
        email: user.email || '',
        role: 'user', // Default role
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null
      };
    }
    
    const profile = data as UserProfile;
    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url
    };
  } catch (error) {
    // Silently return null on any error
    return null;
  }
}

// Get user profile by ID
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// Get all user profiles (admin/superadmin only)
export async function getAllUserProfiles() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserProfile[];
}

// Update user profile
export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// Update user role (superadmin only)
export async function updateUserRole(userId: string, role: UserRole) {
  return updateUserProfile(userId, { role });
}

// Delete user profile (superadmin only)
export async function deleteUserProfile(userId: string) {
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}

// ============================================
// Authorization Functions
// ============================================

// Check if user has required role
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) return false;

    // Role hierarchy: superadmin > admin > user
    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      admin: 2,
      superadmin: 3
    };

    return roleHierarchy[profile.role] >= roleHierarchy[requiredRole];
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
}

// Check if user is admin or superadmin
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

// Check if user is superadmin
export async function isSuperAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'superadmin';
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return !!session;
  } catch {
    return false;
  }
}

// ============================================
// Password Reset
// ============================================

// Request password reset
export async function resetPasswordRequest(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });
  
  if (error) throw error;
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) throw error;
}