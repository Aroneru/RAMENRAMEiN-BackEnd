// ============================================
// Homepage Helper Functions
// ============================================
import { supabase } from './supabase';
import type { Homepage, HomepageSection } from './types/database.types';

// Fetch all active homepage sections
export async function fetchHomepageSections() {
  const { data, error } = await supabase
    .from('homepage')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data as Homepage[];
}

// Fetch homepage section by section name
export async function fetchHomepageBySection(section: HomepageSection) {
  const { data, error } = await supabase
    .from('homepage')
    .select('*')
    .eq('section', section)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as Homepage;
}

// Fetch homepage section by ID
export async function fetchHomepageById(id: string) {
  const { data, error } = await supabase
    .from('homepage')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Homepage;
}

// Insert new homepage section
export async function insertHomepage(homepage: Partial<Homepage>) {
  const { data, error } = await supabase
    .from('homepage')
    .insert(homepage)
    .select()
    .single();

  if (error) throw error;
  return data as Homepage;
}

// Update homepage section
export async function updateHomepage(id: string, updates: Partial<Homepage>) {
  const { data, error } = await supabase
    .from('homepage')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Homepage;
}

// Update homepage section by section name
export async function updateHomepageBySection(section: HomepageSection, updates: Partial<Homepage>) {
  const { data, error } = await supabase
    .from('homepage')
    .update(updates)
    .eq('section', section)
    .select()
    .single();

  if (error) throw error;
  return data as Homepage;
}

// Delete homepage section
export async function deleteHomepage(id: string) {
  const { error } = await supabase
    .from('homepage')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get all homepage data organized by section
export async function fetchHomepageData() {
  const sections = await fetchHomepageSections();
  
  // Convert array to object keyed by section name
  const organized = sections.reduce((acc, section) => {
    acc[section.section] = section;
    return acc;
  }, {} as Record<string, Homepage>);

  return organized;
}

// Update homepage display order
export async function updateHomepageOrder(id: string, newOrder: number) {
  return updateHomepage(id, { display_order: newOrder });
}
