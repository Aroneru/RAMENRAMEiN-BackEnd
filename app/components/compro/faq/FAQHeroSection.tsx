"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

interface FAQHeroSectionProps {
  children?: ReactNode;
}

export default function FAQHeroSection({ children }: FAQHeroSectionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  
  return (
    <div 
      ref={ref}
      className={`relative h-[400px] w-full mb-8 transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <Image
        src="/images/faq/faq2.jpg"
        alt="Hero FAQ"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className={`absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-1000 delay-300 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6">
          <span className="text-white">FAQ</span>
        </h1>
        {children}
      </div>
    </div>
  );
}

