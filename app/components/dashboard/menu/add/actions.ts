"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { insertMenu } from "@/lib/menu";
import { uploadImage } from "@/lib/storage";

export async function addMenuItemAction(formData: FormData) {
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
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const isAvailable = formData.get("isAvailable") !== 'false';
    
    // Special ramen fields
    const isSpecialRamen = formData.get("isSpecialRamen") === 'true';
    const priceForMaxPrice = formData.get("priceForMaxPrice") as string;
    const imageForMaxPriceFile = formData.get("imageForMaxPrice") as File | null;

    // Validation
    if (!name?.trim()) return { error: "Name is required" };
    if (!description?.trim()) return { error: "Description is required" };
    if (!price || isNaN(parseFloat(price))) return { error: "Valid price is required" };
    if (!category?.trim()) return { error: "Category is required" };
    if (!imageFile || imageFile.size === 0) return { error: "Image is required" };
    
    // Validate max price if provided
    if (priceForMaxPrice && parseFloat(priceForMaxPrice) < parseFloat(price)) {
      return { error: "Maximum price must be greater than or equal to base price" };
    }
    
    if (priceForMaxPrice && (!imageForMaxPriceFile || imageForMaxPriceFile.size === 0)) {
      return { error: "Image for maximum price variant is required" };
    }

    // Upload image to public/images/menu
    const imageUrl = await uploadImage(imageFile, "menu");
    
    // Upload max price image if provided
    let imageForMaxPriceUrl = null;
    if (imageForMaxPriceFile && imageForMaxPriceFile.size > 0) {
      imageForMaxPriceUrl = await uploadImage(imageForMaxPriceFile, "menu");
    }

    // Save to database using authenticated client
    const menuData: any = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image_url: imageUrl,
      category: category as any,
      is_available: isAvailable,
      created_by: user.id,
      updated_by: user.id,
    };
    
    // Add special ramen fields only if category is ramen
    if (category === 'ramen') {
      menuData.is_special_ramen = isSpecialRamen;
      if (priceForMaxPrice) {
        menuData.price_for_max_price = parseFloat(priceForMaxPrice);
      }
      if (imageForMaxPriceUrl) {
        menuData.image_for_max_price = imageForMaxPriceUrl;
      }
    }

    const { data, error: insertError } = await supabase
      .from('menu')
      .insert(menuData)
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error adding menu:", error);
    return { error: error.message || "Failed to add menu item" };
  }
}