"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaGoogle, FaFacebookF } from "react-icons/fa";

export default function SocialMediaBar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <nav
      className={`fixed top-1/2 right-0 z-[1000] bg-[#8c5a2b] p-3 rounded-l-[10px] flex flex-col gap-5 
      transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] 
      ${isScrolling ? "translate-y-[-50%] translate-x-[80%] opacity-50" : "translate-y-[-50%]"}`}
    >
      <Link
        href="https://www.instagram.com/ramenramein/"
        target="_blank"
        aria-label="Instagram"
        className="text-white text-[1.5rem] transition-transform duration-200 hover:scale-125"
      >
        <FaInstagram />
      </Link>
      <Link
        href="https://wa.me/+6281219420430"
        target="_blank"
        aria-label="Whatsapp"
        className="text-white text-[1.5rem] transition-transform duration-200 hover:scale-125"
      >
        <FaWhatsapp />
      </Link>
      <Link
        href="mailto:ade_ternos@yahoo.co.id"
        target="_blank"
        aria-label="Google"
        className="text-white text-[1.5rem] transition-transform duration-200 hover:scale-125"
      >
        <FaGoogle />
      </Link>
      <Link
        href="https://www.facebook.com/RAMENRAMEiN/?locale=id_ID"
        target="_blank"
        aria-label="Facebook"
        className="text-white text-[1.5rem] transition-transform duration-200 hover:scale-125"
      >
        <FaFacebookF />
      </Link>
    </nav>
  );
}
