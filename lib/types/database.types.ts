// ============================================
// Database Types for RamenRamein Supabase Tables
// ============================================

// Base timestamp fields
interface BaseTimestamps {
  created_at: string;
  updated_at: string;
}

// Base user tracking fields
interface BaseUserTracking {
  created_by: string | null;
  updated_by: string | null;
}

// ============================================
// MENU TYPES
// ============================================
export type MenuCategory = 'ramen' | 'nyemil' | 'minuman' | 'topping';

export interface Menu extends BaseTimestamps, BaseUserTracking {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
  is_special_ramen?: boolean;
  price_for_max_price?: number | null;
  image_for_max_price?: string | null;
}

export interface MenuInsert extends Partial<BaseTimestamps>, Partial<BaseUserTracking> {
  id?: string;
  name: string;
  description: string;
  category: MenuCategory;
  price?: number | null;
  image_url?: string | null;
  is_available?: boolean;
  is_special_ramen?: boolean;
  price_for_max_price?: number | null;
  image_for_max_price?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MenuUpdate extends Partial<MenuInsert> {}

// ============================================
// NEWS TYPES
// ============================================
export interface News extends BaseTimestamps, BaseUserTracking {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image_url: string;
  published_at: string | null;
  is_published: boolean;
  views_count: number;
}

export interface NewsInsert extends Partial<BaseTimestamps>, Partial<BaseUserTracking> {
  id?: string;
  title: string;
  slug?: string; // Will be auto-generated if not provided
  description: string;
  content: string;
  category: string;
  image_url: string;
  published_at?: string | null;
  is_published?: boolean;
  views_count?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NewsUpdate extends Partial<NewsInsert> {}

// For display purposes (matching your current Berita interface)
export interface Berita {
  id: string;
  kategori: string;
  judul: string;
  deskripsi: string;
  content: string;
  tanggal: string;
  gambar: string;
}

// Helper to convert News to Berita format (for list view - uses description/summary)
export function newsToBerita(news: News): Berita {
  return {
    id: news.id,
    kategori: news.category,
    judul: news.title,
    deskripsi: news.description,
    content: news.content,
    tanggal: new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    gambar: news.image_url
  };
}

// Helper to convert News to Berita format (for detail view - uses full content)
export function newsToBeritaDetail(news: News): Berita {
  return {
    id: news.id,
    kategori: news.category,
    judul: news.title,
    deskripsi: news.description, // Use description as summary
    content: news.content, // Full TipTap HTML content
    tanggal: new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    gambar: news.image_url
  };
}

// ============================================
// FAQ TYPES
// ============================================
export interface FAQ extends BaseTimestamps, BaseUserTracking {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  is_active: boolean;
}

export interface FAQInsert extends Partial<BaseTimestamps>, Partial<BaseUserTracking> {
  id?: string;
  question: string;
  answer: string;
  category?: string | null;
  display_order?: number;
  is_active?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FAQUpdate extends Partial<FAQInsert> {}

// For display purposes (matching your current FAQData interface)
export interface FAQData {
  id: string | number;
  pertanyaan: string;
  jawaban: string;
}

// Helper to convert FAQ to FAQData format
export function faqToFAQData(faq: FAQ): FAQData {
  return {
    id: faq.id,
    pertanyaan: faq.question,
    jawaban: faq.answer
  };
}

// ============================================
// HOMEPAGE TYPES
// ============================================
export type HomepageSection = 
  | 'hero' 
  | 'about' 
  | 'menu' 
  | 'location' 
  | 'access' 
  | 'gallery'
  | string; // Allow custom sections

export interface Homepage extends BaseTimestamps, BaseUserTracking {
  id: string;
  section: HomepageSection;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
  metadata: Record<string, unknown> | null; // JSONB field
}

export interface HomepageInsert extends Partial<BaseTimestamps>, Partial<BaseUserTracking> {
  id?: string;
  section: HomepageSection;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  display_order?: number;
  is_active?: boolean;
  metadata?: Record<string, unknown> | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HomepageUpdate extends Partial<HomepageInsert> {}

// ============================================
// DATABASE TYPE (for Supabase Client)
// ============================================
export interface Database {
  public: {
    Tables: {
      menu: {
        Row: Menu;
        Insert: MenuInsert;
        Update: MenuUpdate;
      };
      news: {
        Row: News;
        Insert: NewsInsert;
        Update: NewsUpdate;
      };
      faq: {
        Row: FAQ;
        Insert: FAQInsert;
        Update: FAQUpdate;
      };
      homepage: {
        Row: Homepage;
        Insert: HomepageInsert;
        Update: HomepageUpdate;
      };
    };
  };
}
