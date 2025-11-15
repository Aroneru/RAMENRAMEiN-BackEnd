"use client";

import React from 'react';
import Image from 'next/image';
import styles from './styles/MenuHighlight.module.css';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

export default function MenuHighlight() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  return (
    <section
      ref={ref}
      className={`${styles.menuSection} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      <h2 className={styles.title}>
        PILIH <span className={styles.highlight}>RAMENMU!</span>
      </h2>

      <div className={styles.cardContainer}>

        <div className={styles.card}>
          <Image
            src="/images/foto-ramen.png" 
            alt="Ramen Miso"
            width={400} 
            height={400} 
            className={styles.ramenImage}
          />
          <h3 className={styles.cardTitle} style={{ textDecoration: 'underline', fontFamily: 'Osnova Pro' }}>Ramen Miso</h3>
        </div>

        <div className={styles.card}>
          <Image
            src="/images/foto-ramen.png" 
            alt="Ramen Kari"
            width={400} 
            height={400} 
            className={styles.ramenImage}
          />
          <h3 className={styles.cardTitle} style={{ textDecoration: 'underline', fontFamily: 'Osnova Pro' }}>Ramen Kari</h3>
        </div>

      </div>
    </section>
  );
}