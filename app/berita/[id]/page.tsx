"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

// Temporary data - will be replaced with API call
const getBeritaById = (id: string) => {
  return {
    id: parseInt(id),
    kategori: "general",
    judul: "Hampers Lebaran Spesial dari RAMENRAMEiN!!!",
    deskripsi: `Lebaran tahun ini, RamenRamein menghadirkan sesuatu yang istimewa. Kami meracik Hampers Lebaran berisi kehangatan dan cita rasa ramen Jepang yang dapat dibagikan untuk keluarga, teman, atau rekan terdekat.

Dalam satu paket hampers, pelanggan akan mendapatkan:
• 3 porsi ramen spesial dengan pilihan kuah Miso, Curry, atau kombinasi keduanya
• Kartu ucapan personal yang dapat disesuaikan dengan nama penerima
• Bonus berupa aksesoris makan yang dapat digunakan kembali
• Kemasan besek bambu yang ramah lingkungan dan menampilkan sentuhan elegan khas RamenRamein

Seluruh bahan diolah dengan standar higienis tinggi serta dari Miso Aka dan Mie yang juga cita rasa dan kualitas yang menjadi ciri khas kami.

Hampers ini ditawarkan dengan harga Rp 98.000 (belum termasuk ongkos kirim). Pilihan yang tepat untuk berbagi momen hangat dan unik di hari raya.`,
    tanggal: "1 Oktober 2025",
    gambar: "/images/berita/poster_hampers.jpeg",
  };
};

export default function BeritaDetailPage() {
  const params = useParams();
  const berita = getBeritaById(params.id as string);

  if (!berita) return <div>Berita tidak ditemukan</div>;

  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-4xl mx-auto px-4 pb-20">
        {/* Back + Date row */}
        <div className="flex items-center gap-3 mb-2">
          <button
            aria-label="Kembali"
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white transition text-lg font-medium"
          >
            &lt;
          </button>

          <p className="text-sm text-gray-400 text-left m-0">{berita.tanggal}</p>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-left text-white mb-3 leading-tight">
          {berita.judul}
        </h1>

        {/* Divider (pink) */}
        <div className="w-24 h-0.5 bg-[#F98582] mb-6" />

        {/* Cover Image */}
        <div className="relative max-w-[400px] h-full mb-8 overflow-hidden rounded-lg">
          <Image
            src={berita.gambar}
            alt={berita.judul}
            width={1080}
            height={720}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Content - paragraphs justified */}
        <div className="text-gray-300 text-base leading-relaxed text-justify">
          {berita.deskripsi.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}