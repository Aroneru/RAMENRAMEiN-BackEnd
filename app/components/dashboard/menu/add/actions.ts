'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { uploadImage } from '@/lib/storage';
import { insertMenu } from '@/lib/menu';
import type { MenuCategory } from '@/lib/types/database.types';

export async function addMenuItemAction(
  formData: FormData,
  category: MenuCategory
) {
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

  // Extract form data
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const imageFile = formData.get('image') as File;

  // Validation
  if (!name?.trim()) return { error: 'Name is required' };
  if (!description?.trim()) return { error: 'Description is required' };
  if (!price?.trim()) return { error: 'Price is required' };
  if (!imageFile || imageFile.size === 0) return { error: 'Image is required' };

  try {
    // Upload image to local public folder
    const imageUrl = await uploadImage(imageFile, category);

    // Create menu item - use the authenticated supabase client
    const { error: insertError } = await supabase
      .from('menu')
      .insert({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        image_url: imageUrl,
        is_available: true,
        created_by: user.id,
        updated_by: user.id
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error adding menu item:', err);
    return { error: err.message || 'Failed to add menu item' };
  }
}
