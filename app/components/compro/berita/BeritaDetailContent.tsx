"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Berita } from "@/lib/types/database.types";

interface BeritaDetailContentProps {
  berita: Berita;
  prevNews?: Berita | null;
  nextNews?: Berita | null;
}

export default function BeritaDetailContent({ berita, prevNews, nextNews }: BeritaDetailContentProps) {
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

      {/* Content - TipTap HTML rendered */}
      <div 
        className="tiptap-content text-gray-300 text-base leading-relaxed max-w-none"
        dangerouslySetInnerHTML={{ __html: berita.content }}
      />

      {/* TipTap Content Styles */}
      <style jsx>{`
        .tiptap-content {
          text-align: justify;
        }
        
        /* Headings */
        .tiptap-content :global(h1) {
          font-size: 2em;
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          color: white;
        }
        
        .tiptap-content :global(h2) {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1.25em;
          margin-bottom: 0.5em;
          color: white;
        }
        
        .tiptap-content :global(h3) {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
          color: white;
        }
        
        /* Paragraphs */
        .tiptap-content :global(p) {
          margin-bottom: 1em;
          line-height: 1.75;
        }
        
        /* Text formatting */
        .tiptap-content :global(strong) {
          font-weight: bold;
          color: white;
        }
        
        .tiptap-content :global(em) {
          font-style: italic;
        }
        
        .tiptap-content :global(u) {
          text-decoration: underline;
        }
        
        .tiptap-content :global(s) {
          text-decoration: line-through;
        }
        
        /* Lists */
        .tiptap-content :global(ul) {
          list-style-type: disc;
          margin-left: 1.5em;
          margin-bottom: 1em;
          padding-left: 0.5em;
        }
        
        .tiptap-content :global(ol) {
          list-style-type: decimal;
          margin-left: 1.5em;
          margin-bottom: 1em;
          padding-left: 0.5em;
        }
        
        .tiptap-content :global(li) {
          margin-bottom: 0.5em;
          line-height: 1.75;
        }
        
        .tiptap-content :global(ul ul),
        .tiptap-content :global(ol ol),
        .tiptap-content :global(ul ol),
        .tiptap-content :global(ol ul) {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        
        /* Text alignment */
        .tiptap-content :global([style*="text-align: left"]) {
          text-align: left;
        }
        
        .tiptap-content :global([style*="text-align: center"]) {
          text-align: center;
        }
        
        .tiptap-content :global([style*="text-align: right"]) {
          text-align: right;
        }
        
        /* Links */
        .tiptap-content :global(a) {
          color: #F98582;
          text-decoration: underline;
          transition: color 0.2s;
        }
        
        .tiptap-content :global(a:hover) {
          color: #ff9d9b;
        }
        
        /* Code blocks (if used) */
        .tiptap-content :global(code) {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }
        
        .tiptap-content :global(pre) {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 1em;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1em;
        }
        
        .tiptap-content :global(pre code) {
          background-color: transparent;
          padding: 0;
        }
      `}</style>

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
    </article>
  );
}

