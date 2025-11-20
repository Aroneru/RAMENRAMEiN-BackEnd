"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Berita } from "@/lib/types/database.types";

interface BeritaCardListProps {
  beritaList: Berita[];
}

export default function BeritaCardList({ beritaList }: BeritaCardListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredBerita = selectedCategory === "all" 
    ? beritaList 
    : beritaList.filter(berita => berita.kategori === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-6 mt-12 pb-20">
      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedCategory === "all"
              ? "bg-white text-black font-semibold"
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedCategory("general")}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedCategory === "general"
              ? "bg-white text-black font-semibold"
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setSelectedCategory("event")}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedCategory === "event"
              ? "bg-white text-black font-semibold"
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
          }`}
        >
          Event
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredBerita.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No news found in this category.
          </div>
        ) : (
          filteredBerita.map((berita: Berita) => (
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
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400">
                {berita.tanggal}
              </span>
              {berita.views_count !== undefined && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{berita.views_count.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
          ))
        )}
      </div>
    </div>
  );
}

