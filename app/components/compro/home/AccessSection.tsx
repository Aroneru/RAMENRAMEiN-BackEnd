import React from 'react';
import styles from './styles/AccessSection.module.css';

const accessData = [
  {
    title: "Dari Stasiun Bogor",
    subtitle: "(15-20 Menit)",
    description:
      "Dari Stasiun Bogor, ambil angkot 03 atau ojek online menuju Universitas Pakuan. Turun di Fakultas Teknik UNPAK. RAMENRAMEiN berada tepat di seberang fakultas, di area parkir sebelah Bigland Bogor. Alternatif lain bisa naik Grab/Gojek dengan estimasi biaya 25-35rb.",
    // TAUTAN RUTE DITAMBAHKAN:
    routeUrl: "https://www.google.com/maps/dir/Bogor+Station,+Cibogor,+Bogor+City,+West+Java,+Indonesia/RAMENRAMEiN,+Jalan+Ciheuleut,+Tegallega,+Kota+Bogor,+Jawa+Barat/@-6.5983148,106.8095806,20z/data=!4m14!4m13!1m5!1m1!1s0x2e69c5b6fad22d85:0x2f756cca1eb4c!2m2!1d106.7904324!2d-6.5955798!1m5!1m1!1s0x2e69c5b153de22f7:0xf7841790ffadb41d!2m2!1d106.8096967!2d-6.5982206!3e0?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D" 
  },
  {
    title: "Dari Botani Square",
    subtitle: "(10-15 Menit)",
    description:
      "Dari Botani Square, ambil jalan ke arah Jl. Raya Pajajaran, lalu belok kanan ke Jl. Pakuan. Lanjut lurus melewati kampus Universitas Pakuan hingga Fakultas Teknik. RAMENRAMEiN berada di kiri jalan, di area parkir sebelah Bigland Bogor. Tersedia angkot 03 atau ojek online.",
    // TAUTAN RUTE DITAMBAHKAN:
    routeUrl: "https://www.google.com/maps/dir/Botani+Square+Mall+Bogor,+Jalan+Raya+Pajajaran+No.40,+Tugu+Kujang,+Kota+Bogor,+Jawa+Barat,+Indonesia/RAMENRAMEiN,+Jalan+Ciheuleut,+Tegallega,+Kota+Bogor,+Jawa+Barat/@-6.6037224,106.8052012,16z/data=!4m14!4m13!1m5!1m1!1s0x2e69c5c5287d2ae7:0x9edb391e7c74be19!2m2!1d106.8071254!2d-6.6014221!1m5!1m1!1s0x2e69c5b153de22f7:0xf7841790ffadb41d!2m2!1d106.8096967!2d-6.5982206!3e0?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    title: "Dari Tol Jagorawi",
    subtitle: "(3-7 Menit dari Exit Tol Tanah Baru)",
    description:
      "Keluar di Tol Tanah Baru, ambil Jl. Padi, lalu belok kanan ke Jl. Pakuan melewati Universitas Pakuan. Setelah 200 meter, belok kiri ke Jl. Pakuan II lanjut ke Jl. Cihideuleut. RAMENRAMEiN berada di kanan jalan, area parkir sebelah Bigland Bogor.",
    routeUrl: "https://www.google.com/maps/dir/Tanah+Baru+Toll+Exit,+Jalan+Padi+Jalan+Pakuan+No.1a,+RT.02%2FRW.09,+Baranangsiang,+Kota+Bogor,+Jawa+Barat,+Indonesia/RAMENRAMEiN,+Jalan+Ciheuleut,+Tegallega,+Kota+Bogor,+Jawa+Barat/@-6.5993913,106.8100802,17z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x2e69c5df044b8341:0x77c37285a1fd5990!2m2!1d106.8156223!2d-6.5990681!1m5!1m1!1s0x2e69c5b153de22f7:0xf7841790ffadb41d!2m2!1d106.8096967!2d-6.5982206!3e0?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
];

export default function AccessSection() {
  return (
    <section className={styles.accessSection}>
      <h2 className={styles.mainTitle}>RUTE AKSES</h2>

      <div className={styles.cardContainer}>
        {accessData.map((item, index) => (
          <div key={index} className={styles.card}>
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
        ))}
      </div>
    </section>
  );
}