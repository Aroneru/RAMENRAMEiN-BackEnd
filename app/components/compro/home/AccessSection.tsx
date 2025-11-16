import React from "react";
import styles from "./styles/AccessSection.module.css";

const accessData = [
  {
    title: "Dari Stasiun Bogor",
    subtitle: "(15-20 Menit)",
    description:
      "Dari Stasiun Bogor, ambil angkot 03 atau ojek online menuju Universitas Pakuan. Turun di Fakultas Teknik UNPAK. RAMENRAMEiN berada tepat di seberang fakultas, di area parkir sebelah Bigland Bogor. Alternatif lain bisa naik Grab/Gojek dengan estimasi biaya 25-35rb.",
    routeUrl:
      "https://www.google.com/maps/dir/Bogor+Station,+Cibogor,+Bogor+City,+West+Java,+Indonesia/RAMENRAMEiN...",
  },
  {
    title: "Dari Botani Square",
    subtitle: "(10-15 Menit)",
    description:
      "Dari Botani Square, ambil jalan ke arah Jl. Raya Pajajaran, lalu belok kanan ke Jl. Pakuan. Lanjut lurus melewati kampus Universitas Pakuan hingga Fakultas Teknik. RAMENRAMEiN berada di kiri jalan, di area parkir sebelah Bigland Bogor.",
    routeUrl:
      "https://www.google.com/maps/dir/Botani+Square+Mall+Bogor...",
  },
  {
    title: "Dari Tol Jagorawi",
    subtitle: "(3-7 Menit dari Exit Tol Tanah Baru)",
    description:
      "Keluar di Tol Tanah Baru, ambil Jl. Padi, lalu belok kanan ke Jl. Pakuan melewati Universitas Pakuan. Setelah 200 meter, belok kiri ke Jl. Pakuan II lanjut ke Jl. Cihideuleut. RAMENRAMEiN berada di kanan jalan.",
    routeUrl:
      "https://www.google.com/maps/dir/Tanah+Baru+Toll+Exit...",
  },
];

export default function AccessSection() {
  return (
    <section className={styles.accessSection}>
      <h2 className={styles.mainTitle}>AKSES</h2>

      <div className={styles.cardContainer}>
        {accessData.map((item, index) => (
          <div key={index} className={styles.cardWrapper}>

            <img 
              alt="Torii" 
              src="/images/home/torii.svg" 
              className={styles.torii} 
            />

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardSubtitle}>{item.subtitle}</p>

              <a
                href={item.routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardButton}
              >
                Lihat Rute Peta
              </a>

              <p className={styles.cardDescription}>{item.description}</p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
