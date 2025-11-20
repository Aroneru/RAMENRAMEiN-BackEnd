// ============================================
// News Helper Functions
// ============================================
import { supabase } from './supabase';
import type { News, Berita } from './types/database.types';
import { newsToBerita, newsToBeritaDetail } from './types/database.types';

// Fetch all active news (published only - for public view)
export async function fetchNewsList() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as News[];
}

// Fetch all news (for dashboard - includes unpublished)
export async function fetchAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as News[];
}

// Alias for consistency
export const getNews = fetchNewsList;

// Fetch all published news in Berita format (for compatibility)
export async function fetchBeritaList(): Promise<Berita[]> {
  const news = await fetchNewsList();
  return news.map(newsToBerita);
}

// Fetch single news by ID
export async function fetchNewsById(id: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data as News;
}

// Fetch single news by slug
export async function fetchNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) throw error;

  return data as News;
}

// Fetch news by Berita ID (for compatibility - detail view with full content)
export async function fetchBeritaById(id: string): Promise<Berita | null> {
  try {
    const news = await fetchNewsById(id);
    return newsToBeritaDetail(news); // Use detail version with full content
  } catch (error) {
    console.error('Error fetching berita by id:', error);
    return null;
  }
}

// Fetch previous and next news
export async function fetchPrevNextNews(currentId: string, currentDate: string) {
  try {
    // Get previous news (older than current)
    const { data: prevData } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lt('created_at', currentDate)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get next news (newer than current)
    const { data: nextData } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .gt('created_at', currentDate)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    return {
      prev: prevData ? newsToBerita(prevData as News) : null,
      next: nextData ? newsToBerita(nextData as News) : null,
    };
  } catch (error) {
    console.error('Error fetching prev/next news:', error);
    return { prev: null, next: null };
  }
}

// Insert new news
export async function insertNews(news: any) {
  const { data, error } = await supabase
    .from('news')
    .insert(news)
    .select()
    .single();

  if (error) throw error;
  return data as News;
}

// Update news
export async function updateNews(id: string, updates: any) {
  const { data, error } = await supabase
    .from('news')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as News;
}

// Delete news
export async function deleteNews(id: string) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Increment news views
async function incrementNewsViews(id: string) {
  // Manual increment
  const { data } = await supabase
    .from('news')
    .select('views_count')
    .eq('id', id)
    .single();

  if (data) {
    const newsData = data as News;
    await supabase
      .from('news')
      .update({ views_count: (newsData.views_count || 0) + 1 })
      .eq('id', id);
  }
}

// Fetch news by category
export async function fetchNewsByCategory(category: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as News[];
}

// Search news by title or content
export async function searchNews(query: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as News[];
}

// Publish news
export async function publishNews(id: string) {
  return updateNews(id, {
    is_published: true,
    published_at: new Date().toISOString()
  });
}

// Unpublish news
export async function unpublishNews(id: string) {
  return updateNews(id, {
    is_published: false
  });
}
