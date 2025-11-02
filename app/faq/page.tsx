"use client";

import { useState, useMemo } from "react";
import FAQHeroSection from "../components/compro/faq/FAQHeroSection";
import FAQSearchBar from "../components/compro/faq/FAQSearchBar";
import FAQList from "../components/compro/faq/FAQList";
import { FAQData } from "../components/compro/faq/FAQItem";

// Temporary data - will be replaced with API call
const faqData: FAQData[] = [
  {
    id: 1,
    pertanyaan: "RAMENRAMEİN buka jam berapa?",
    jawaban: "RAMENRAMEiN buka setiap hari dari pukul 11:00 WIB hingga 22:00 WIB. Kami tutup hanya pada hari libur nasional tertentu.",
  },
  {
    id: 2,
    pertanyaan: "RAMENRAMEİN buka jam berapa?",
    jawaban: "RAMENRAMEiN buka setiap hari dari pukul 11:00 WIB hingga 22:00 WIB. Kami tutup hanya pada hari libur nasional tertentu.",
  },
  {
    id: 3,
    pertanyaan: "RAMENRAMEİN buka jam berapa?",
    jawaban: "RAMENRAMEiN buka setiap hari dari pukul 11:00 WIB hingga 22:00 WIB. Kami tutup hanya pada hari libur nasional tertentu.",
  },
  {
    id: 4,
    pertanyaan: "RAMENRAMEİN buka jam berapa?",
    jawaban: "RAMENRAMEiN buka setiap hari dari pukul 11:00 WIB hingga 22:00 WIB. Kami tutup hanya pada hari libur nasional tertentu.",
  },
  {
    id: 5,
    pertanyaan: "RAMENRAMEİN buka jam berapa?",
    jawaban: "RAMENRAMEiN buka setiap hari dari pukul 11:00 WIB hingga 22:00 WIB. Kami tutup hanya pada hari libur nasional tertentu.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQ berdasarkan search query
  const filteredFAQ = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqData;
    }

    const query = searchQuery.toLowerCase();
    return faqData.filter(
      (faq) =>
        faq.pertanyaan.toLowerCase().includes(query) ||
        faq.jawaban.toLowerCase().includes(query)
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
