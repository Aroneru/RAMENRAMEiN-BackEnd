// ============================================
// Storage Helper Functions for Supabase Storage
// ============================================
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Bucket name - all images stored in single bucket with folder structure
const BUCKET_NAME = 'images';

// Create admin client for storage operations (bypasses RLS)
function getStorageClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function uploadImage(
  file: File,
  folder: string = 'menu'
): Promise<string> {
  const supabase = getStorageClient();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  // Create file path for Supabase Storage
  const filePath = `${folder}/${fileName}`;
  
  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
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
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = getStorageClient();
  
  try {
    // Extract file path from Supabase URL
    const urlObj = new URL(url);
    // Match pattern: /storage/v1/object/public/{bucket}/{path}
    const pathMatch = urlObj.pathname.match(/\/object\/public\/[^/]+\/(.+)/);
    if (!pathMatch || pathMatch.length < 2) return;
    
    const filePath = pathMatch[1];
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
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
