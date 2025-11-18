import { notFound } from "next/navigation";
import BeritaDetailContent from "../../components/compro/berita/BeritaDetailContent";
import { fetchBeritaById, fetchNewsById, fetchPrevNextNews } from "@/lib/news";

// This is now a Server Component
export default async function BeritaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const berita = await fetchBeritaById(params.id);

  if (!berita) {
    notFound();
  }

  // Get the full news data to access created_at
  const newsData = await fetchNewsById(params.id);
  const { prev, next } = await fetchPrevNextNews(params.id, newsData.created_at);

  return (
    <main className="min-h-screen bg-black text-white">
      <BeritaDetailContent berita={berita} prevNews={prev} nextNews={next} />
    </main>
  );
}