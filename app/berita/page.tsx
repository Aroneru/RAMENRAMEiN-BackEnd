import BeritaHeroSection from "../components/compro/berita/BeritaHeroSection";
import BeritaCardList from "../components/compro/berita/BeritaCardList";
import { fetchBeritaList } from "@/lib/news";

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This is now a Server Component for better performance
export default async function BeritaPage() {
  // Fetch data directly on the server
  const beritaList = await fetchBeritaList();

  return (
    <main className="min-h-screen bg-black text-white">
      <BeritaHeroSection />
      <BeritaCardList beritaList={beritaList} />
    </main>
  );
}
