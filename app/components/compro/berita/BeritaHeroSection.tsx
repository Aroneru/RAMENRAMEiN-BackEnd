import Image from "next/image";

export default function BeritaHeroSection() {
  return (
    <div className="relative h-[400px] w-full mb-8">
      <Image
        src="/images/berita/buatberita.png"
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
  );
}

