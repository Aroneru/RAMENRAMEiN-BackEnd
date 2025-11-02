import Image from "next/image";
import { ReactNode } from "react";

interface FAQHeroSectionProps {
  children?: ReactNode;
}

export default function FAQHeroSection({ children }: FAQHeroSectionProps) {
  return (
    <div className="relative h-[400px] w-full mb-8">
      <Image
        src="/images/faq/faq2.jpg"
        alt="Hero FAQ"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6">
          <span className="text-white">FAQ</span>
        </h1>
        {children}
      </div>
    </div>
  );
}

