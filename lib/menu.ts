// ============================================
// Menu Helper Functions
// ============================================
import { supabase } from './supabase';
import type { Menu, MenuInsert, MenuUpdate, MenuCategory } from './types/database.types';

// Fetch all available menu items (for public)
export async function fetchMenuItems() {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('is_available', true)
    .order('name');

  if (error) throw error;
  return data as Menu[];
}

// Fetch all menu items including unavailable (for dashboard)
export async function fetchAllMenuItems() {
  const { data, error} = await supabase
    .from('menu')
    .select('*')
    .order('category')
    .order('name');

  if (error) throw error;
  return data as Menu[];
}

// Alias for consistency
export const getMenu = fetchMenuItems;

// Fetch menu items by category
export async function fetchMenuByCategory(category: MenuCategory) {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('category', category)
    .eq('is_available', true)
    .order('name');

  if (error) throw error;
  return data as Menu[];
}

// Fetch single menu item by ID
export async function fetchMenuById(id: string) {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Menu;
}

// Insert new menu item
export async function insertMenu(menu: MenuInsert) {
  const { data, error } = await supabase
    .from('menu')
    .insert(menu)
    .select()
    .single();

  if (error) throw error;
  return data as Menu;
}

// Update menu item
export async function updateMenu(id: string, updates: MenuUpdate) {
  const { data, error } = await supabase
    .from('menu')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Menu;
}

// Delete menu item
export async function deleteMenu(id: string) {
  const { error } = await supabase
    .from('menu')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get all menu grouped by category
export async function fetchMenuGroupedByCategory() {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('is_available', true)
    .order('category')
    .order('name');

  if (error) throw error;

  // Group by category
  const grouped = (data as Menu[]).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MenuCategory, Menu[]>);

  return grouped;
}
