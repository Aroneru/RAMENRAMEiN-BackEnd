"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { fetchMenuById, updateMenu, deleteMenu } from "@/lib/menu";
import { uploadImage, deleteImage } from "@/lib/storage";

export async function getMenuItemAction(id: string) {
  try {
    const menu = await fetchMenuById(id);
    return { data: menu };
  } catch (error: any) {
    console.error("Error fetching menu:", error);
    return { error: error.message || "Failed to load menu item" };
  }
}

export async function updateMenuItemAction(id: string, formData: FormData) {
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
    return { error: 'You must be logged in to update menu items' };
  }

  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File | null;
    const currentImageUrl = formData.get("currentImageUrl") as string;
    const isAvailable = formData.get("isAvailable") === 'true';

    // Validation
    if (!name?.trim()) return { error: "Name is required" };
    if (!description?.trim()) return { error: "Description is required" };
    if (!price || isNaN(parseFloat(price))) return { error: "Valid price is required" };

    let imageUrl = currentImageUrl;

    // If new image uploaded, delete old image and upload new one
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (currentImageUrl) {
        try {
          await deleteImage(currentImageUrl);
        } catch (err) {
          console.error("Error deleting old image:", err);
          // Continue even if delete fails
        }
      }

      // Upload new image
      imageUrl = await uploadImage(imageFile, "menu");
    }

    // Update database
    const updates = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image_url: imageUrl,
      is_available: isAvailable,
      updated_by: user.id,
    };

    await updateMenu(id, updates);

    return { success: true };
  } catch (error: any) {
    console.error("Error updating menu:", error);
    return { error: error.message || "Failed to update menu item" };
  }
}

export async function deleteMenuItemAction(id: string) {
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
    return { error: 'You must be logged in to delete menu items' };
  }

  try {
    // Get menu item first to get image URL
    const menu = await fetchMenuById(id);
    
    // Delete image if exists
    if (menu.image_url) {
      try {
        await deleteImage(menu.image_url);
      } catch (err) {
        console.error("Error deleting image:", err);
        // Continue even if delete fails
      }
    }

    // Delete from database
    await deleteMenu(id);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting menu:", error);
    return { error: error.message || "Failed to delete menu item" };
  }
}
