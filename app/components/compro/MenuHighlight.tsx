import React from 'react';
import Image from 'next/image';
import styles from './styles/MenuHighlight.module.css';

export default function MenuHighlight() {
  return (
    <section className={styles.menuSection}>
      
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