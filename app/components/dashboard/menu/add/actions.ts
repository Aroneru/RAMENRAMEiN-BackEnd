"use server";

import { insertMenu } from "@/lib/menu";
import { uploadImage } from "@/lib/storage";

export async function addMenuItemAction(formData: FormData, category: string) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File;

    // Validasi
    if (!name || !description || !price || !imageFile) {
      return { error: "Semua field harus diisi" };
    }

    // Upload gambar ke folder public/images/menu
    const imageUrl = await uploadImage(imageFile, "menu");

    // Simpan data ke database
    const menuData = {
      name,
      description,
      price: parseFloat(price),
      image_url: imageUrl,
      category: category as any,
      is_available: true,
    };

    await insertMenu(menuData);

    return { success: true };
  } catch (error: any) {
    console.error("Error:", error);
    return { error: error.message || "Gagal menambahkan menu" };
  }
}