"use client"; 

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './styles/SocialMediaBar.module.css';

import { FaInstagram, FaWhatsapp, FaGoogle, FaFacebookF } from 'react-icons/fa';

export default function SocialBar() {
  const [isScrolling, setIsScrolling] = useState(false);
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []); 

  return (
    <nav className={`${styles.socialBar} ${isScrolling ? styles.scrolling : ''}`}>
      <Link href="http://google.com/9" target="_blank" aria-label="Instagram">
        <FaInstagram />
      </Link>
      <Link href="http://google.com/10" target="_blank" aria-label="Whatsapp">
        <FaWhatsapp />
      </Link>
      <Link href="http://google.com/11" target="_blank" aria-label="Google">
        <FaGoogle />
      </Link>
      <Link href="http://google.com/12" target="_blank" aria-label="Facebook">
        <FaFacebookF />
      </Link>
    </nav>
  );
}