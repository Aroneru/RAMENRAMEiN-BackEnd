'use server';

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { uploadImage, deleteImage } from '@/lib/storage';

export async function getMenuItemAction(id: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in' };
  }

  try {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return { error: 'Menu item not found' };

    return { data };
  } catch (err: unknown) {
    return { error: (err as Error).message || 'Failed to load menu item' };
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
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
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

  // Extract form data
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const imageFile = formData.get('image') as File | null;
  const category = formData.get('category') as string;
  const isAvailable = formData.get('isAvailable') === 'true';
  
  // Special ramen fields
  const isSpecialRamen = formData.get('isSpecialRamen') === 'true';
  const priceForMaxPrice = formData.get('priceForMaxPrice') as string;
  const imageForMaxPriceFile = formData.get('imageForMaxPrice') as File | null;
  const clearPriceForMaxPrice = formData.get('clearPriceForMaxPrice') === 'true';
  const clearImageForMaxPrice = formData.get('clearImageForMaxPrice') === 'true';

  // Validation
  if (!name?.trim()) return { error: 'Name is required' };
  if (!description?.trim()) return { error: 'Description is required' };
  if (!price || isNaN(parseFloat(price))) return { error: 'Valid price is required' };
  
  // Validate max price if provided
  if (priceForMaxPrice && parseFloat(priceForMaxPrice) < parseFloat(price)) {
    return { error: 'Maximum price must be greater than or equal to base price' };
  }

  try {
    // Get current menu item to get old image URLs
    const { data: currentMenu, error: fetchError } = await supabase
      .from('menu')
      .select('image_url, image_for_max_price')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    let imageUrl = currentMenu?.image_url || null;

    // If new image uploaded, delete old and upload new
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (currentMenu?.image_url) {
        try {
          await deleteImage(currentMenu.image_url);
        } catch (err) {
          console.error('Error deleting old image:', err);
          // Continue even if delete fails
        }
      }

      // Upload new image
      imageUrl = await uploadImage(imageFile, 'menu');
    }

    // Handle max price image
    let imageForMaxPriceUrl = currentMenu?.image_for_max_price || null;
    
    if (clearImageForMaxPrice) {
      // Delete existing max price image if clearing
      if (currentMenu?.image_for_max_price) {
        try {
          await deleteImage(currentMenu.image_for_max_price);
        } catch (err) {
          console.error('Error deleting old max price image:', err);
        }
      }
      imageForMaxPriceUrl = null;
    } else if (imageForMaxPriceFile && imageForMaxPriceFile.size > 0) {
      // Delete old max price image if exists
      if (currentMenu?.image_for_max_price) {
        try {
          await deleteImage(currentMenu.image_for_max_price);
        } catch (err) {
          console.error('Error deleting old max price image:', err);
        }
      }
      // Upload new max price image
      imageForMaxPriceUrl = await uploadImage(imageForMaxPriceFile, 'menu');
    }

    // Prepare update data
    const updateData: any = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image_url: imageUrl,
      category: category?.trim() || null,
      is_available: isAvailable,
      updated_by: user.id
    };

    // Add special ramen fields only if category is ramen
    if (category === 'ramen') {
      updateData.is_special_ramen = isSpecialRamen;
      
      if (clearPriceForMaxPrice) {
        updateData.price_for_max_price = null;
      } else if (priceForMaxPrice) {
        updateData.price_for_max_price = parseFloat(priceForMaxPrice);
      }
      
      updateData.image_for_max_price = imageForMaxPriceUrl;
    } else {
      // If category changed from ramen to something else, clear special fields
      updateData.is_special_ramen = false;
      updateData.price_for_max_price = null;
      updateData.image_for_max_price = null;
    }

    // Update menu item
    const { error: updateError } = await supabase
      .from('menu')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Error updating menu item:', err);
    return { error: (err as Error).message || 'Failed to update menu item' };
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
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
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
    // Get menu item to get image URLs
    const { data: menu, error: fetchError } = await supabase
      .from('menu')
      .select('image_url, image_for_max_price')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Delete main image if exists
    if (menu?.image_url) {
      try {
        await deleteImage(menu.image_url);
      } catch (err) {
        console.error('Error deleting image:', err);
        // Continue even if delete fails
      }
    }

    // Delete max price image if exists
    if (menu?.image_for_max_price) {
      try {
        await deleteImage(menu.image_for_max_price);
      } catch (err) {
        console.error('Error deleting max price image:', err);
        // Continue even if delete fails
      }
    }

    // Delete menu item
    const { error: deleteError } = await supabase
      .from('menu')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Error deleting menu item:', err);
    return { error: (err as Error).message || 'Failed to delete menu item' };
  }
}