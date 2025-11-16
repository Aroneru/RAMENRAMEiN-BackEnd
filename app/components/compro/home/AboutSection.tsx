"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles/AboutSection.module.css'; 
import { useScrollReveal } from '../../../hooks/useScrollReveal';

export default function AboutSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  return (
    <section
      ref={ref}
      className={`${styles.aboutSection} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className={styles.container}>
        
        <div className={styles.leftColumn}>
          <h2>TENTANG KAMI</h2>
          <p>
            RAMENRAMEiN adalah sebuah kedai ramen autentik yang berlokasi
            di jantung kota Bogor. Kami menyajikan cita rasa asli Jepang
            dengan sentuhan lokal yang hangat.
          </p>
          <Link href="/tentang-kami" className={styles.button}>
            Lihat Lebih
          </Link>
        </div>

        <div className={styles.rightColumn}>
<Image
  src="/images/bangunan_ramen.png"
  alt="Foto Kedai Ramein Ramen"
  width={0}
  height={0}
  sizes="100vw"
  className={styles.shopImage}
/>
        </div>

      </div>
    </section>
  );
}