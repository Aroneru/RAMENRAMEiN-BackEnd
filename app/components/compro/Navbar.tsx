"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "TENTANG KAMI", href: "/tentang-kami" },
    { label: "MENU", href: "/menu" },
    { label: "FAQ", href: "/faq" },
    { label: "BERITA", href: "/berita" },
  ];

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center relative">
      
      <div className="flex items-center">
        <Image src="/logo_ramenramein.svg" alt="Logo" width={90} height={90} />
      </div>

      <ul className="hidden md:flex space-x-8 font-semibold">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`hover:text-yellow-600 transition duration-200 font-osnova ${
                  isActive ? "text-yellow-600" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        className="md:hidden text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={32} /> : <Menu size={32} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full bg-black text-white flex flex-col px-6 py-4 space-y-4 md:hidden z-50 shadow-lg">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-2 border-b border-gray-700 font-osnova text-lg ${
                  isActive ? "text-yellow-600" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
