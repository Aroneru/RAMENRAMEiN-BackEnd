"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Berita } from "@/lib/types/database.types";

interface BeritaCardListProps {
  beritaList: Berita[];
}

export default function BeritaCardList({ beritaList }: BeritaCardListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const filteredBerita = selectedCategory === "all" 
    ? beritaList 
    : beritaList.filter(berita => berita.kategori === selectedCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBerita.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBerita = filteredBerita.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mt-12 pb-20">
      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedCategory === "all"
              ? "bg-white text-black font-semibold"
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryChange("general")}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedCategory === "general"
              ? "bg-white text-black font-semibold"
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
          }`}
        >
          General
        </button>
        <button
          onClick={() => handleCategoryChange("event")}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        {paginatedBerita.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No news found in this category.
          </div>
        ) : (
          paginatedBerita.map((berita: Berita) => (
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
              priority={false}
              unoptimized={true}
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
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredBerita.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === 1
                ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg transition-all ${
                  currentPage === page
                    ? "bg-white text-black font-semibold"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

