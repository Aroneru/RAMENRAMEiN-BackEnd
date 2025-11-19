"use client"; 

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'TENTANG KAMI', href: '/tentang-kami' },
    { label: 'MENU', href: '/menu' },
    { label: 'FAQ', href: '/faq' },
    { label: 'BERITA', href: '/berita' },
  ];

  const pathname = usePathname(); 

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      {/* Desktop & Mobile Navbar */}
      <div className="flex justify-between items-center px-4 md:px-10 py-2 md:py-3">
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden z-50 p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo - Centered on Mobile, Left on Desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex items-center overflow-hidden h-16 md:h-[56px]">
          <Image
            src="/logo_ramenramein.svg"
            alt="Ramen Ramein Logo"
            width={56}
            height={56}
            className="w-[130px] h-[48px] md:w-[140px] md:h-[65px] overflow-hidden"
          />
        </div>

        {/* Spacer for mobile to balance layout */}
        <div className="md:hidden w-10"></div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-semibold">
          {navItems.map((item) => {
            const isActive = 
              item.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(item.href); 

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`
                    hover:text-yellow-600 transition-colors duration-200 font-osnova
                    ${isActive ? 'text-yellow-600' : ''} 
                  `}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-black z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col pt-20 px-6">
          <ul className="flex flex-col space-y-6">
            {navItems.map((item) => {
              const isActive = 
                item.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(item.href); 

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`
                      block text-sm font-semibold hover:text-yellow-600 transition-colors duration-200 font-osnova
                      ${isActive ? 'text-yellow-600' : ''} 
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}