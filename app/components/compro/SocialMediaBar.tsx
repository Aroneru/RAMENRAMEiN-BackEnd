"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaWhatsapp,
  FaGoogle,
  FaFacebookF,
  FaShareAlt,
} from "react-icons/fa";

import { MdContactPhone } from "react-icons/md";
import { RiContactsBook2Fill } from "react-icons/ri";

export default function SocialMediaBar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth <= 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Scroll hide effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Icon
  const icons = (
    <>
      <Link
        href="https://www.instagram.com/ramenramein/"
        target="_blank"
        aria-label="Instagram"
        className="text-white text-[1.5rem] transition-transform hover:scale-125"
      >
        <FaInstagram />
      </Link>

      <Link
        href="https://wa.me/681299771717"
        target="_blank"
        aria-label="Whatsapp"
        className="text-white text-[1.5rem] transition-transform hover:scale-125"
      >
        <FaWhatsapp />
      </Link>

      <Link
        href="mailto:ade_ternos@yahoo.co.id"
        target="_blank"
        aria-label="Google"
        className="text-white text-[1.5rem] transition-transform hover:scale-125"
      >
        <FaGoogle />
      </Link>

      <Link
        href="https://www.facebook.com/RAMENRAMEiN/?locale=id_ID"
        target="_blank"
        aria-label="Facebook"
        className="text-white text-[1.5rem] transition-transform hover:scale-125"
      >
        <FaFacebookF />
      </Link>
    </>
  );

  return (
    <>
      {/* Desktop */}
      {!isMobile && (
        <nav
          className={`fixed top-1/2 right-0 z-[1000] bg-[#8c5a2b] p-3 rounded-l-[10px] 
          flex flex-col gap-5 shadow-xl
          transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
          ${
            isScrolling
              ? "translate-y-[-50%] translate-x-[80%] opacity-50"
              : "translate-y-[-50%]"
          }`}
        >
          {icons}
        </nav>
      )}

      {/* Mobile */}
      {isMobile && (
        <div
          className={`fixed bottom-6 right-6 z-[1000] 
          transition-all duration-300
          ${isScrolling ? "opacity-50 translate-y-2" : "opacity-100 translate-y-0"}`}
        >
          <div
            className={`flex flex-col items-end mb-3 space-y-2 transition-all duration-300 ${
              open
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {[
              {
                link: "https://www.instagram.com/ramenramein/",
                icon: <FaInstagram size={18} />,
              },
              {
                link: "https://wa.me/681299771717",
                icon: <FaWhatsapp size={18} />,
              },
              {
                link: "mailto:ade_ternos@yahoo.co.id",
                icon: <FaGoogle size={18} />,
              },
              {
                link: "https://www.facebook.com/RAMENRAMEiN/?locale=id_ID",
                icon: <FaFacebookF size={18} />,
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.link}
                target="_blank"
                className="w-12 h-12 rounded-full bg-[#8c5a2b] shadow-lg flex items-center justify-center
                text-white hover:bg-[#724822] transition-all border border-white/10"
              >
                {item.icon}
              </Link>
            ))}
          </div>

          {/* Action button */}
          <button
            title="Share"
            onClick={() => setOpen(!open)}
            className="w-12 h-10 rounded-full bg-[#8c5a2b] shadow-xl 
            flex items-center justify-center text-white 
            hover:bg-[#724822] transition-all border"
          >
            <RiContactsBook2Fill
              className={`transition-transform duration-300 ${
                open ? "rotate-45 text-[#d49c35]" : "text-[white]"
              }`}
              size={18}
            />
          </button>
        </div>
      )}
    </>
  );
}
