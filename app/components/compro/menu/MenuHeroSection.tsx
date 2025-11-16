"use client";

import Image from "next/image";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

export default function MenuHeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  return (
    <div
      ref={ref}
      className={`relative h-[400px] w-full mb-8 transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 delay-[250ms]"
          : "opacity-0 translate-y-12"
      }`}
    >
      <Image
        src="/images/menu/banner_menu.png"
        alt="Hero Menu"
        fill
        className="object-cover brightness-40"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-wider">
          <span className="text-white">MENU</span>
        </h1>
      </div>
    </div>
  );
}

