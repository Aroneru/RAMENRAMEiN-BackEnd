"use server";

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { uploadImage, deleteImage } from "@/lib/storage";

export async function getHeroSectionAction() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from('homepage')
      .select('*')
      .eq('section', 'hero')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { data };
  } catch (error: unknown) {
    console.error("Error fetching hero section:", error);
    return { error: (error as Error).message || "Failed to load hero section" };
  }
}

export async function updateHeroSectionAction(formData: FormData) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to update hero section' };
  }

  const heroImageFile = formData.get("heroImage") as File | null;
  const currentHeroUrl = formData.get("currentHeroUrl") as string;

  if (!heroImageFile || heroImageFile.size === 0) {
    return { error: "Hero image is required" };
  }

  try {
    if (currentHeroUrl) {
      try {
        await deleteImage(currentHeroUrl);
      } catch (err) {
        console.error("Error deleting old hero image:", err);
      }
    }

    const heroImageUrl = await uploadImage(heroImageFile, "hero");

    const { data: existing } = await supabase
      .from('homepage')
      .select('id')
      .eq('section', 'hero')
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from('homepage')
        .update({
          image_url: heroImageUrl,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) throw new Error(updateError.message);
    } else {
      const { error: insertError } = await supabase
        .from('homepage')
        .insert({
          section: 'hero',
          image_url: heroImageUrl,
          is_active: true,
          display_order: 1,
          created_by: user.id,
          updated_by: user.id,
        });

      if (insertError) throw new Error(insertError.message);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating hero section:", error);
    return { error: (error as Error).message || "Failed to update hero section" };
  }
}

export async function deleteHeroSectionAction(currentHeroUrl: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to delete hero section' };
  }

  try {
    const { data: existing } = await supabase
      .from('homepage')
      .select('id')
      .eq('section', 'hero')
      .single();

    if (!existing) {
      return { error: "Hero section not found" };
    }

    if (currentHeroUrl) {
      try {
        await deleteImage(currentHeroUrl);
      } catch (err) {
        console.error("Error deleting hero image from storage:", err);
      }
    }

    const { error: deleteError } = await supabase
      .from('homepage')
      .delete()
      .eq('id', existing.id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting hero section:", error);
    return { error: (error as Error).message || "Failed to delete hero section" };
  }
}