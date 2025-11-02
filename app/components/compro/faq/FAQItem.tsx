"use client";

import { useState } from "react";

export interface FAQData {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

interface FAQItemProps {
  faq: FAQData;
  index: number;
}

export default function FAQItem({ faq, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-700 py-4">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-white text-lg font-medium pr-4">
          {index}. {faq.pertanyaan}
        </span>
        <svg
          className={`w-5 h-5 text-white transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-300 leading-relaxed">
          {faq.jawaban}
        </div>
      )}
    </div>
  );
}

