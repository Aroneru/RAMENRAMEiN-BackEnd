import { Berita } from "../app/components/compro/berita/BeritaCardList";
import { BeritaDetail } from "../app/components/compro/berita/BeritaDetailContent";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Fetch semua berita
export async function fetchBeritaList(): Promise<Berita[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/berita`, {
      cache: "no-store", // Untuk mendapatkan data terbaru
    });

    if (!response.ok) {
      throw new Error("Failed to fetch berita");
    }

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to fetch berita");
    }
  } catch (error) {
    console.error("Error fetching berita list:", error);
    // Return empty array jika error
    return [];
  }
}

// Fetch berita by ID
export async function fetchBeritaById(id: string): Promise<BeritaDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/berita/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch berita");
    }

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching berita by id:", error);
    return null;
  }
}
