"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { fetchNewsById, insertNews, updateNews, deleteNews } from "@/lib/news";
import { uploadImage, deleteImage } from "@/lib/storage";

export async function getNewsItemAction(id: string) {
  try {
    const news = await fetchNewsById(id);
    return { data: news };
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return { error: error.message || "Failed to load news item" };
  }
}

export async function addNewsItemAction(formData: FormData) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to add news' };
  }

  try {
    const title = formData.get("title") as string;
    const content = formData.get("body") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string || "general";
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const isPublished = formData.get("isPublished") !== 'false';

    // Validation
    if (!title?.trim()) return { error: "Title is required" };
    if (!content?.trim()) return { error: "Content is required" };
    if (!description?.trim()) return { error: "Description is required" };
    if (!thumbnailFile || thumbnailFile.size === 0) return { error: "Thumbnail is required" };

    // Upload thumbnail to public/images/berita
    const thumbnailUrl = await uploadImage(thumbnailFile, "berita");

    // Save to database
    const newsData = {
      title: title.trim(),
      content: content.trim(),
      description: description.trim(),
      category: category.trim(),
      image_url: thumbnailUrl,
      is_published: isPublished,
      created_by: user.id,
      updated_by: user.id,
    };

    await insertNews(newsData);

    return { success: true };
  } catch (error: any) {
    console.error("Error adding news:", error);
    return { error: error.message || "Failed to add news" };
  }
}

export async function updateNewsItemAction(formData: FormData) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to update news' };
  }

  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("body") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const currentThumbnail = formData.get("currentThumbnail") as string;
    const isPublished = formData.get("isPublished") === 'true';

    // Validation
    if (!id) return { error: "News ID is required" };
    if (!title?.trim()) return { error: "Title is required" };
    if (!content?.trim()) return { error: "Content is required" };
    if (!description?.trim()) return { error: "Description is required" };

    let thumbnailUrl = currentThumbnail;

    // If new thumbnail uploaded, delete old and upload new one
    if (thumbnailFile && thumbnailFile.size > 0) {
      // Delete old thumbnail if exists
      if (currentThumbnail) {
        try {
          await deleteImage(currentThumbnail);
        } catch (err) {
          console.error("Error deleting old thumbnail:", err);
          // Continue even if delete fails
        }
      }

      // Upload new thumbnail
      thumbnailUrl = await uploadImage(thumbnailFile, "berita");
    }

    // Update database
    const updates = {
      title: title.trim(),
      content: content.trim(),
      description: description.trim(),
      category: category?.trim() || "general",
      image_url: thumbnailUrl,
      is_published: isPublished,
      updated_by: user.id,
    };

    await updateNews(id, updates);

    return { success: true };
  } catch (error: any) {
    console.error("Error updating news:", error);
    return { error: error.message || "Failed to update news" };
  }
}

export async function deleteNewsItemAction(id: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to delete news' };
  }

  try {
    // Get news item first to get thumbnail URL
    const news = await fetchNewsById(id);
    
    // Delete thumbnail if exists
    if (news.image_url) {
      try {
        await deleteImage(news.image_url);
      } catch (err) {
        console.error("Error deleting thumbnail:", err);
        // Continue even if delete fails
      }
    }

    // Delete from database
    await deleteNews(id);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting news:", error);
    return { error: error.message || "Failed to delete news" };
  }
}
