"use client"; // penting agar bisa interaktif nanti

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-black text-white">
      {/* Kiri - Logo */}
      <div className="flex items-center space-x-3">
        <Image 
          src="/logo_ramenramein.svg" 
          alt="Ramen Ramein Logo" 
          width={100} 
          height={100} 
        />
      </div>

      {/* Kanan - Menu */}
      <ul className="flex space-x-8 font-semibold">
        {["HOME", "TENTANG KAMI", "MENU", "FAQ", "BERITA"].map((item) => (
          <li key={item}>
            <Link
              href="#"
              className="hover:text-yellow-600 transition-colors duration-200"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
