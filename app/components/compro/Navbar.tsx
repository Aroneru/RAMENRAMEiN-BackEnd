"use client"; 

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'TENTANG KAMI', href: '/tentang-kami' },
    { label: 'MENU', href: '/menu' },
    { label: 'FAQ', href: '/faq' },
    { label: 'BERITA', href: '/berita' },
  ];

  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-black text-white">
      <div className="flex items-center space-x-3">
        <Image
          src="/logo_ramenramein.svg"
          alt="Ramen Ramein Logo"
          width={100}
          height={100}
        />
      </div>

      <ul className="flex space-x-8 font-semibold">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="hover:text-yellow-600 transition-colors duration-200 font-osnova"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
