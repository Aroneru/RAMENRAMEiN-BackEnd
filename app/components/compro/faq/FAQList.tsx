"use client";

import FAQItem, { FAQData } from "./FAQItem";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

interface FAQListProps {
  faqList: FAQData[];
}

export default function FAQList({ faqList }: FAQListProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  if (faqList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Tidak ada FAQ yang ditemukan</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-0">
      {faqList.map((faq, idx) => (
        <div
          key={faq.id}
          style={{ 
            transitionDelay: isVisible ? `${idx * 100}ms` : "0ms"
          }}
          className={`transition-all duration-700 ease-out ${
            isVisible 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <FAQItem faq={faq} index={faq.id} />
        </div>
      ))}
    </div>
  );
}

