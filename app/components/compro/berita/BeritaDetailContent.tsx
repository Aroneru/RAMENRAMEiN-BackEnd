"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export interface BeritaDetail {
  id: number;
  kategori: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  gambar: string;
}

interface BeritaDetailContentProps {
  berita: BeritaDetail;
}

export default function BeritaDetailContent({ berita }: BeritaDetailContentProps) {
  const router = useRouter();

  return (
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
  );
}

