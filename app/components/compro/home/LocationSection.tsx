"use client";

import React from 'react';
import styles from './styles/LocationSection.module.css';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

export default function LocationSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  return (
    <section
      ref={ref}
      className={`${styles.mapSection} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ minHeight: '500px' }} // Testing height
    >
      
      <div className={styles.mapContainer} style={{ height: '400px' }}> {/* Testing height */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.391126203791!2d106.80965309999999!3d-6.5982172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5b153de22f7%3A0xf7841790ffadb41d!2sRAMENRAMEiN!5e0!3m2!1sid!2sid!4v1761551852718!5m2!1sid!2sid"
          className={styles.mapIframe}
          style={{ width: '100%', height: '100%', border: 0 }} // Testing
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className={styles.addressBar}>
        <h2>Jl. Cihideuleut, Tegallega, Kecamatan Bogor Tengah, Kota Bogor</h2>
      </div>

    </section>
  );
}