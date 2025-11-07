"use client";

import Image from 'next/image';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

export default function HeroTentangKami() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  return (
    <div
      ref={ref}
      className={`relative h-[400px] w-full transition-all duration-[1200ms] ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 delay-150'
          : 'opacity-0 translate-y-10'
      }`}
    >
      <Image
        src="/images/tentangkami/hero_section2.png"
        alt="Tentang Kami Hero"
        fill
        className="object-cover brightness-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-wider">
          <span className="text-red-600">TENTANG</span>{' '}
          <span className="text-white">KAMI</span>
        </h1>
      </div>
    </div>
  );
}
