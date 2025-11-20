"use server";

import { supabase } from "@/lib/supabase";

export async function incrementNewsViewAction(newsId: string) {
  try {
    // Call the PostgreSQL function that bypasses RLS
    const { error } = await supabase.rpc('increment_news_view_count', {
      news_id: newsId
    });

    if (error) {
      console.error('Error incrementing view count:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in incrementNewsViewAction:', error);
    return { success: false, error: error.message };
  }
}
