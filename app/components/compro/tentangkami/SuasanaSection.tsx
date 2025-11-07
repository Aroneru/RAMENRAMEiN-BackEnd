
"use client";
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useScrollReveal } from '../../../hooks/useScrollReveal';

export default function SuasanaSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const galleryImages = [
    'suasana_1.jpeg',
    'suasana_2.jpeg',
    'suasana_3.jpg',
    'suasana_4.jpg',
    'suasana_5.png',
    'suasana_6.jpeg'
  ];
  return (
    <div
      ref={ref}
      className={`container mx-auto px-4 py-16 transition-all duration-[1200ms] ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 delay-150'
          : 'opacity-0 translate-y-10'
      }`}
    >
      <h2 className="text-3xl font-bold mb-12 text-center">SUASANA KAMI</h2>
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-gray-300">
          Setiap sudut RAMENRAMEiN mencerminkan kehangatan sejak awal berdirinya. Tempat ini dibangun dengan penuh 
          semangat gotong royong bersama teman-teman Mas Ade yang ikut membantu mewujudkan impian sederhana ini — dari pemilihan 
          kayu jati asli Jepang, hingga proses pembangunan dan dekorasi interiornya.
        </p>
        <p className="text-gray-300">
          Nuansa street food Jepang terasa kuat, namun tetap berpadu harmonis dengan sentuhan lokal khas Indonesia. Dinding kayu, lampu 
          gantung hangat, dan lukisan mural karya sahabat-sahabat kami menciptakan atmosfer yang nyaman dan autentik.
        </p>
        <p className="text-gray-300 mb-12">
          Lebih dari sekadar tempat makan, RAMENRAMEiN adalah hasil karya bersama simbol persahabatan, kreativitas, dan cinta terhadap 
          kuliner Jepang yang tumbuh dari tangan-tangan orang terdekat.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {galleryImages.map((imageName, index) => (
            <div 
              key={imageName} 
              className="relative w-full aspect-square cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            >
              <Image
                src={`/images/tentangkami/${imageName}`}
                alt={`Suasana RamenRamein`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          index={photoIndex}
          slides={galleryImages.map(img => ({
            src: `/images/tentangkami/${img}`
          }))}
        />
      </div>
    </div>
  );
}
