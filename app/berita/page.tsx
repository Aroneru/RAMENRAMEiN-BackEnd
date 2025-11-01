
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Berita {
  id: number;
  kategori: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  gambar: string;
}

// This will be replaced with an API call in the future
const fetchBeritaList = async (): Promise<Berita[]> => {
  // Simulating API call with dummy data
  return [
    {
      id: 1,
      kategori: "general",
      judul: "Hampers Lebaran Spesial dari RAMENRAMEiN!!!",
      deskripsi:
        "Edisi hampers lebaran tahun ini masih sama, tidak kurang, tidak lebih tapi pas di kantong.",
      tanggal: "1 Oktober 2025",
      gambar: "/images/berita/hampers-lebaran.jpg",
    },
    {
      id: 2,
      kategori: "event",
      judul: "Grand Opening Cabang Baru RAMENRAMEiN",
      deskripsi:
        "Kami dengan bangga mengumumkan pembukaan cabang baru RAMENRAMEiN di lokasi strategis.",
      tanggal: "15 Oktober 2025",
      gambar: "/images/berita/hampers-lebaran.jpg",
    },
  ];
};

const filterOptions = [
  { label: "SEMUA", value: "all" },
  { label: "EVENT", value: "event" },
];

export default function BeritaPage() {
  const [filter, setFilter] = useState("all");
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  
  // Fetch berita when component mounts
  useEffect(() => {
    fetchBeritaList().then(setBeritaList);
  }, []);

  const filteredBerita = filter === "all"
    ? beritaList
    : beritaList.filter((b: Berita) => b.kategori === filter);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <div className="relative h-[400px] w-full mb-8">
        <Image
          src="/images/berita/hero-berita.jpg"
          alt="Hero Berita"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold tracking-wider">
            <span className="text-white">BERITA</span>
          </h1>
        </div>
      </div>

      {/* Filter Navigation */}
      <div className="flex justify-center gap-8 mb-10">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`text-lg font-semibold pb-1 border-b-2 transition-colors duration-200 ${
              filter === opt.value
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-yellow-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Card List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-20">
        {filteredBerita.map((berita: Berita) => (
          <Link
            key={berita.id}
            href={`/berita/${berita.id}`}
            className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="relative w-full aspect-3/4">
              <Image
                src={berita.gambar}
                alt={berita.judul}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-bold mb-1 leading-tight line-clamp-2">
                {berita.judul}
              </h2>
              <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                {berita.deskripsi}
              </p>
              <span className="text-xs text-gray-400 mt-auto block">
                {berita.tanggal}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
