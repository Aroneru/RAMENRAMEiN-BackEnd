// ============================================
// Storage Helper Functions for Local Image Uploads
// ============================================
import fs from 'fs/promises';
import path from 'path';

export async function uploadImage(
  file: File,
  folder: string = 'menu'
): Promise<string> {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  // Create directory path
  const uploadDir = path.join(process.cwd(), 'public', 'images', folder);
  
  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });
  
  // Save file
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  // Return public URL path
  return `/images/${folder}/${fileName}`;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract file path from URL (remove leading slash)
    const filePath = path.join(process.cwd(), 'public', url);
    await fs.unlink(filePath);
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
