"use client";
import { useState, useEffect } from "react";
import BeritaHeroSection from "../components/compro/berita/BeritaHeroSection";
import BeritaFilterSection from "../components/compro/berita/BeritaFilterSection";
import BeritaCardList, { Berita } from "../components/compro/berita/BeritaCardList";
import { fetchBeritaList } from "../../lib/berita";

const filterOptions = [
  { label: "SEMUA", value: "all" },
  { label: "EVENT", value: "event" },
];

export default function BeritaPage() {
  const [filter, setFilter] = useState("all");
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  
  // Fetch berita when component mounts
  useEffect(() => {
    fetchBeritaList().then(setBeritaList);
  }, []);

  const filteredBerita = filter === "all"
    ? beritaList
    : beritaList.filter((b: Berita) => b.kategori === filter);

  return (
    <main className="min-h-screen bg-black text-white">
      <BeritaHeroSection />
      <BeritaFilterSection 
        filter={filter}
        filterOptions={filterOptions}
        onFilterChange={setFilter}
      />
      <BeritaCardList beritaList={filteredBerita} />
    </main>
  );
}
