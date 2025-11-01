import Image from 'next/image';

export default function HeroTentangKami() {
  return (
    <div className="relative h-[400px] w-full">
      <Image
        src="/images/tentangkami/hero_section2.png"
        alt="Tentang Kami Hero"
        fill
        className="object-cover brightness-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-wider">
          <span className="text-red-600">TENTANG</span>{' '}
          <span className="text-white">KAMI</span>
        </h1>
      </div>
    </div>
  );
}
