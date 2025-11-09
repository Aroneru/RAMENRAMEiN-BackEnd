"use client";
import { useState, useEffect } from "react";
import BeritaHeroSection from "../components/compro/berita/BeritaHeroSection";
import BeritaCardList, { Berita } from "../components/compro/berita/BeritaCardList";
import { fetchBeritaList } from "../../lib/berita";

export default function BeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  
  // Fetch berita when component mounts
  useEffect(() => {
    fetchBeritaList().then(setBeritaList);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <BeritaHeroSection />
      <BeritaCardList beritaList={beritaList} />
    </main>
  );
}
