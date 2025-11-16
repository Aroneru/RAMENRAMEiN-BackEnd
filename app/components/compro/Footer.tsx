"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#010101] text-[#a0a0a0] py-10 px-6 border-t border-[#333]">
      <div className="max-w-[1200px] mx-auto py-[40px] flex flex-col items-center gap-8">

        <nav
          className="
            flex flex-col md:flex-row 
            items-center md:items-center
            gap-3 md:gap-6 
            font-semibold text-[0.85rem] md:text-[0.9rem] uppercase text-white
          "
        >
          <Link href="/" className="hover:text-[#d4a373] transition">HOME</Link>
          <Link href="/tentang-kami" className="hover:text-[#d4a373] transition">TENTANG KAMI</Link>
          <Link href="/menu" className="hover:text-[#d4a373] transition">MENU</Link>
          <Link href="/faq" className="hover:text-[#d4a373] transition">FAQ</Link>
          <Link href="/berita" className="hover:text-[#d4a373] transition">BERITA</Link>
        </nav>

        <p className="text-[0.75rem] md:text-[0.8rem] text-center px-4 text-[#a0a0a0]">
          © {new Date().getFullYear()} Ramein Ramen. All rights reserved.
        </p>

        <div className="mt-2">
          <Image
            src="/logo_ramenramein.svg"
            alt="Ramein Ramen Logo"
            width={80}
            height={40}
            className="opacity-90"
          />
        </div>
      </div>
    </footer>
  );
}
