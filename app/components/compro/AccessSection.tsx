import React from 'react';
import Image from 'next/image';
import styles from './styles/AccessSection.module.css';

const accessData = {
  imageSrc: "/images/torii_gate.png", 
  title: "Keluar Tol Jagorawi",
  subtitle: "(3-7 Menit dari Keluar Tol Tanah Baru)",
  description: "Dari pintu Tol Tanah Baru, arahkan kendaraan ke Jl. Padi, lalu belok kanan ke Jl. Pakuan melewati Universitas Pakuan. Setelah sekitar 200 meter, belok kiri ke Jl. Pakuan II dan lanjutkan ke Jl. Cihideuleut. RamenRamein berada di area parkir sebelah Bigland Bogor, tepat di depan Fakultas Teknik Universitas Pakuan."
};

export default function AccessSection() {
  return (
    <section className={styles.accessSection}>
      
      <h2 className={styles.mainTitle}>AKSES</h2>

      <div className={styles.cardContainer}>

        <div className={styles.card}>
          <Image
            src={accessData.imageSrc}
            alt="tori gate"
            width={200} 
            height={150} 
            className={styles.cardImage}
          />
          <h3 className={styles.cardTitle}>{accessData.title}</h3>
          <p className={styles.cardSubtitle}>{accessData.subtitle}</p>
          <p className={styles.cardDescription}>{accessData.description}</p>
        </div>

        <div className={styles.card}>
          <Image
            src={accessData.imageSrc}
            alt="tori gate"
            width={200}
            height={150}
            className={styles.cardImage}
          />
          <h3 className={styles.cardTitle}>{accessData.title}</h3>
          <p className={styles.cardSubtitle}>{accessData.subtitle}</p>
          <p className={styles.cardDescription}>{accessData.description}</p>
        </div>

        <div className={styles.card}>
          <Image
            src={accessData.imageSrc}
            alt="tori gate"
            width={200}
            height={150}
            className={styles.cardImage}
          />
          <h3 className={styles.cardTitle}>{accessData.title}</h3>
          <p className={styles.cardSubtitle}>{accessData.subtitle}</p>
          <p className={styles.cardDescription}>{accessData.description}</p>
        </div>

      </div>
    </section>
  );
}