import Image from "next/image";
import Link from "next/link";

export interface Berita {
  id: number;
  kategori: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  gambar: string;
}

interface BeritaCardListProps {
  beritaList: Berita[];
}

export default function BeritaCardList({ beritaList }: BeritaCardListProps) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-20">
      {beritaList.map((berita: Berita) => (
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
  );
}

