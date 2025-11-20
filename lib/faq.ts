// ============================================
// FAQ Helper Functions
// ============================================
import { supabase } from './supabase';
import type { FAQ, FAQData } from './types/database.types';
import { faqToFAQData } from './types/database.types';

// Fetch all active FAQs (for public display)
export async function fetchFAQList() {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data as FAQ[];
}

// Fetch all FAQs including inactive ones (for dashboard)
export async function fetchAllFAQList() {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .order('display_order');

  if (error) throw error;
  return data as FAQ[];
}

// Alias for consistency
export const getFAQ = fetchFAQList;

// Fetch FAQs in FAQData format (for compatibility)
export async function fetchFAQData(): Promise<FAQData[]> {
  const faqs = await fetchFAQList();
  return faqs.map(faqToFAQData);
}

// Fetch FAQ by ID
export async function fetchFAQById(id: string) {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as FAQ;
}

// Fetch FAQs by category
export async function fetchFAQByCategory(category: string) {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data as FAQ[];
}

// Insert new FAQ
export async function insertFAQ(faq: Partial<FAQ>) {
  const { data, error } = await supabase
    .from('faq')
    .insert(faq)
    .select()
    .single();

  if (error) throw error;
  return data as FAQ;
}

// Update FAQ
export async function updateFAQ(id: string, updates: Partial<FAQ>) {
  const { data, error } = await supabase
    .from('faq')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as FAQ;
}

// Delete FAQ
export async function deleteFAQ(id: string) {
  const { error } = await supabase
    .from('faq')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Search FAQs
export async function searchFAQ(query: string) {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('is_active', true)
    .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
    .order('display_order');

  if (error) throw error;
  return data as FAQ[];
}

// Update FAQ display order
export async function updateFAQOrder(id: string, newOrder: number) {
  return updateFAQ(id, { display_order: newOrder });
}
