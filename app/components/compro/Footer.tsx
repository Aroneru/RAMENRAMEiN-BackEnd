import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerContainer} >
      <div className={styles.footerContent} >
        
        <nav className={styles.footerNav}>
          <Link href="/">HOME</Link>
          <Link href="/tentang-kami">TENTANG KAMI</Link>
          <Link href="/menu">MENU</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/berita">BERITA</Link>
        </nav>

        <div>
          <p className={styles.copyright}>© {new Date().getFullYear()} Ramein Ramen. All rights reserved.</p>
        </div>

        <div className={styles.footerLogo}>
          <Image 
            src="/logo_ramenramein.svg" 
            alt="Ramein Ramen Logo"
            width={80} 
            height={40}
          />
        </div>
        
      </div>
    </footer>
  );
}