// ============================================
// Storage Helper Functions for Supabase Storage
// ============================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(
  file: File,
  folder: string = 'menu'
): Promise<string> {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  // Create file path for Supabase Storage
  const filePath = `${folder}/${fileName}`;
  
  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from('menu-images')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error('Error uploading to Supabase:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data } = supabase.storage
    .from('menu-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract file path from Supabase URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/menu-images/');
    if (pathParts.length < 2) return;
    
    const filePath = pathParts[1];
    
    const { error } = await supabase.storage
      .from('menu-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting from Supabase:', error);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - file might already be deleted
  }
}

export async function updateImage(
  oldUrl: string | null,
  newFile: File,
  folder: string = 'menu'
): Promise<string> {
  // Delete old image if exists
  if (oldUrl) {
    await deleteImage(oldUrl);
  }

  // Upload new image
  return uploadImage(newFile, folder);
}
