import React from 'react';
import styles from './styles/LocationSection.module.css';

export default function LocationSection() {
  return (
    <section className={styles.mapSection}>
      
      <div className={styles.mapContainer}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.391126203791!2d106.80965309999999!3d-6.5982172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5b153de22f7%3A0xf7841790ffadb41d!2sRAMENRAMEiN!5e0!3m2!1sid!2sid!4v1761551852718!5m2!1sid!2sid"
          width="600"
          height="450"
          style={{ border: '0' }}
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