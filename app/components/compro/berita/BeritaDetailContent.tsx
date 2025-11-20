"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Berita } from "@/lib/types/database.types";
import { incrementNewsViewAction } from "./increment-view-action";

interface BeritaDetailContentProps {
  berita: Berita;
  prevNews?: Berita | null;
  nextNews?: Berita | null;
}

export default function BeritaDetailContent({ berita, prevNews, nextNews }: BeritaDetailContentProps) {
  const router = useRouter();

  useEffect(() => {
    // Increment view count when component mounts
    incrementNewsViewAction(berita.id);
  }, [berita.id]);

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

      {/* Content - Display formatted HTML */}
      <div 
        className="prose prose-invert max-w-none text-gray-300 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: berita.deskripsi }}
      />

      {/* Previous & Next Navigation */}
      {(prevNews || nextNews) && (
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous News */}
            <div>
              {prevNews ? (
                <Link href={`/berita/${prevNews.id}`} className="block group">
                  <p className="text-sm text-gray-400 mb-2">← Previous</p>
                  <div className="flex gap-4 p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                    <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
                      <Image
                        src={prevNews.gambar}
                        alt={prevNews.judul}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#F98582] transition-colors">
                        {prevNews.judul}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{prevNews.tanggal}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="opacity-50">
                  <p className="text-sm text-gray-400 mb-2">← Previous</p>
                  <div className="p-4 bg-zinc-900 rounded-lg">
                    <p className="text-gray-500 text-sm">No previous news</p>
                  </div>
                </div>
              )}
            </div>

            {/* Next News */}
            <div>
              {nextNews ? (
                <Link href={`/berita/${nextNews.id}`} className="block group">
                  <p className="text-sm text-gray-400 mb-2 text-right">Next →</p>
                  <div className="flex gap-4 p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                    <div className="flex-1 min-w-0 text-right">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#F98582] transition-colors">
                        {nextNews.judul}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{nextNews.tanggal}</p>
                    </div>
                    <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
                      <Image
                        src={nextNews.gambar}
                        alt={nextNews.judul}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="opacity-50">
                  <p className="text-sm text-gray-400 mb-2 text-right">Next →</p>
                  <div className="p-4 bg-zinc-900 rounded-lg">
                    <p className="text-gray-500 text-sm text-right">No next news</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .prose-invert p {
          color: #d1d5db;
          margin-bottom: 1em;
        }
        
        .prose-invert h1 {
          color: #ffffff;
          font-size: 2em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        .prose-invert h2 {
          color: #ffffff;
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        .prose-invert h3 {
          color: #ffffff;
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        .prose-invert strong {
          color: #ffffff;
          font-weight: bold;
        }
        
        .prose-invert em {
          color: #d1d5db;
          font-style: italic;
        }
        
        .prose-invert u {
          color: #d1d5db;
          text-decoration: underline;
        }
        
        .prose-invert s {
          color: #d1d5db;
          text-decoration: line-through;
        }
        
        .prose-invert ul,
        .prose-invert ol {
          color: #d1d5db;
          padding-left: 2em;
          margin-bottom: 1em;
        }
        
        .prose-invert li {
          color: #d1d5db;
          margin-bottom: 0.5em;
        }
      `}</style>
    </article>
  );
}