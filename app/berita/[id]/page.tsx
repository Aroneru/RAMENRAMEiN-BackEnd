import { notFound } from "next/navigation";
import BeritaDetailContent from "../../components/compro/berita/BeritaDetailContent";
import { fetchBeritaById } from "@/lib/news";

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

  return (
    <main className="min-h-screen bg-black text-white">
      <BeritaDetailContent berita={berita} />
    </main>
  );
}