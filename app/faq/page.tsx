"use client";

import { useState, useMemo } from "react";
import FAQHeroSection from "../components/compro/faq/FAQHeroSection";
import FAQSearchBar from "../components/compro/faq/FAQSearchBar";
import FAQList from "../components/compro/faq/FAQList";
import { FAQData } from "../components/compro/faq/FAQItem";

// Contoh data sementara — nanti bisa diambil dari API
const faqData: FAQData[] = [
  {
    id: 1,
    pertanyaan: "Ramen Ramein buka jam berapa?",
    jawaban:
      "Ramen Ramein buka setiap hari dari pukul 11:00 WIB sampai 22:00 WIB. Kami tutup pada hari libur nasional tertentu.",
  },
  {
    id: 2,
    pertanyaan: "Apakah menerima pesanan online?",
    jawaban: "Ya, kami menerima pesanan lewat telepon dan aplikasi delivery mitra.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQ = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    const q = searchQuery.toLowerCase();
    return faqData.filter(
      (f) => f.pertanyaan.toLowerCase().includes(q) || f.jawaban.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-black text-white">
      <FAQHeroSection>
        <FAQSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </FAQHeroSection>

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <FAQList faqList={filteredFAQ} />
      </div>
    </main>
  );
}
