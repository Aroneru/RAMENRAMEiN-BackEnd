import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles/AboutSection.module.css'; 

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        
        <div className={styles.leftColumn}>
          <h2>TENTANG KAMI</h2>
          <p>
            Ramen Ramein adalah sebuah kedai ramen autentik yang berlokasi
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
            width={600}
            height={400}
            className={styles.shopImage}
          />
        </div>

      </div>
    </section>
  );
}