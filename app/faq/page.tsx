"use client";

import { useState, useMemo, useEffect } from "react";
import FAQHeroSection from "../components/compro/faq/FAQHeroSection";
import FAQSearchBar from "../components/compro/faq/FAQSearchBar";
import FAQList from "../components/compro/faq/FAQList";
import { FAQData } from "../components/compro/faq/FAQItem";
import { fetchFAQList } from "@/lib/faq";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqData, setFaqData] = useState<FAQData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const data = await fetchFAQList();
        // Map database FAQ to component format
        const mappedData: FAQData[] = data.map((faq, index) => ({
          id: index + 1,
          pertanyaan: faq.question,
          jawaban: faq.answer,
        }));
        setFaqData(mappedData);
      } catch (error) {
        console.error("Failed to load FAQ:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFAQ();
  }, []);

  const filteredFAQ = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    const q = searchQuery.toLowerCase();
    return faqData.filter(
      (f) => f.pertanyaan.toLowerCase().includes(q) || f.jawaban.toLowerCase().includes(q)
    );
  }, [searchQuery, faqData]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading FAQ...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <FAQHeroSection>
        <FAQSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </FAQHeroSection>

      <div className="max-w-3xl mx-auto px-4 pb-16">
        {faqData.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No FAQ available</div>
        ) : (
          <FAQList faqList={filteredFAQ} />
        )}
      </div>
    </main>
  );
}
