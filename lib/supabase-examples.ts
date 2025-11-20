// Example: Using Supabase in your Next.js project
// This file demonstrates common Supabase operations

import { supabase } from './supabase';

// ============================================
// 1. AUTHENTICATION EXAMPLES
// ============================================

// Sign up with email and password
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
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

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ============================================
// 2. DATABASE EXAMPLES (CRUD Operations)
// ============================================

// Example: Fetch all berita from database
export async function fetchBeritaFromSupabase() {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Example: Fetch single berita by ID
export async function fetchBeritaByIdFromSupabase(id: string) {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Example: Insert new berita
export async function insertBerita(berita: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('berita')
    .insert(berita)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Example: Update berita
export async function updateBerita(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('berita')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Example: Delete berita
export async function deleteBerita(id: string) {
  const { error } = await supabase
    .from('berita')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ============================================
// 3. STORAGE EXAMPLES (File Upload)
// ============================================

// Upload image
export async function uploadImage(file: File, bucket: string = 'images') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { path: filePath, url: publicUrl };
}

// Delete file
export async function deleteFile(path: string, bucket: string = 'images') {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

// ============================================
// 4. REALTIME EXAMPLES (Subscribe to changes)
// ============================================

// Subscribe to table changes
export function subscribeToBerita(callback: (payload: unknown) => void) {
  const subscription = supabase
    .channel('berita-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'berita' },
      callback
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}
