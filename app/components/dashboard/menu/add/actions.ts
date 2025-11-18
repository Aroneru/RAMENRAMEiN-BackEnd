"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { insertMenu } from "@/lib/menu";
import { uploadImage } from "@/lib/storage";

export async function addMenuItemAction(formData: FormData, category: string) {
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
    return { error: 'You must be logged in to add menu items' };
  }

  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File;
    const isAvailable = formData.get("isAvailable") !== 'false';

    // Validation
    if (!name?.trim()) return { error: "Name is required" };
    if (!description?.trim()) return { error: "Description is required" };
    if (!price || isNaN(parseFloat(price))) return { error: "Valid price is required" };
    if (!imageFile || imageFile.size === 0) return { error: "Image is required" };

    // Upload image to public/images/menu
    const imageUrl = await uploadImage(imageFile, "menu");

    // Save to database
    const menuData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image_url: imageUrl,
      category: category as any,
      is_available: isAvailable,
      created_by: user.id,
      updated_by: user.id,
    };

    await insertMenu(menuData);

    return { success: true };
  } catch (error: any) {
    console.error("Error adding menu:", error);
    return { error: error.message || "Failed to add menu item" };
  }
}