"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#010101] text-[#a0a0a0] py-8 px-6 border-t border-[#333]">
      <div className="max-w-[1200px] mx-auto py-[60px] flex flex-col items-center gap-6">
        {/* Navigasi */}
        <nav className="flex gap-6 font-semibold text-[0.9rem] uppercase">
          <Link href="/" className="text-white hover:text-[#d4a373] transition-colors duration-200">
            HOME
          </Link>
          <Link href="/tentang-kami" className="text-white hover:text-[#d4a373] transition-colors duration-200">
            TENTANG KAMI
          </Link>
          <Link href="/menu" className="text-white hover:text-[#d4a373] transition-colors duration-200">
            MENU
          </Link>
          <Link href="/faq" className="text-white hover:text-[#d4a373] transition-colors duration-200">
            FAQ
          </Link>
          <Link href="/berita" className="text-white hover:text-[#d4a373] transition-colors duration-200">
            BERITA
          </Link>
        </nav>

        {/* Copyright */}
        <div>
          <p className="text-[0.8rem] text-[#a0a0a0]">
            © {new Date().getFullYear()} RAMENRAMEiN. All rights reserved.
          </p>
        </div>

        {/* Logo dan Tombol Login */}
        <div className="mt-4 flex items-center gap-4">
          <Image
            src="/logo_ramenramein.svg"
            alt="Ramein Ramen Logo"
            width={80}
            height={40}
          />
          <Link 
            href="/login" 
            className="px-4 py-2 border-2 border-white bg-transparent text-white text-sm font-semibold uppercase hover:bg-white hover:text-black transition-all duration-200 rounded"
          >
            Login Admin
          </Link>
        </div>
        
      </div>
    </footer>
  );
}