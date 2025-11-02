"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import BeritaDetailContent, { BeritaDetail } from "../../components/compro/berita/BeritaDetailContent";
import { fetchBeritaById } from "../../../lib/berita";

export default function BeritaDetailPage() {
  const params = useParams();
  const [berita, setBerita] = useState<BeritaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBerita = async () => {
      if (params.id) {
        const data = await fetchBeritaById(params.id as string);
        setBerita(data);
        setLoading(false);
      }
    };

    loadBerita();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Memuat berita...</div>
      </main>
    );
  }

  if (!berita) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Berita tidak ditemukan</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <BeritaDetailContent berita={berita} />
    </main>
  );
}