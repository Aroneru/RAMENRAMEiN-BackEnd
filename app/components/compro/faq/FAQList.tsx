"use client";

import FAQItem, { FAQData } from "./FAQItem";

interface FAQListProps {
  faqList: FAQData[];
}

export default function FAQList({ faqList }: FAQListProps) {
  if (faqList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Tidak ada FAQ yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {faqList.map((faq) => (
        <FAQItem key={faq.id} faq={faq} index={faq.id} />
      ))}
    </div>
  );
}

