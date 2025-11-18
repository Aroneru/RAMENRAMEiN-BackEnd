"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface MenuPopup {
  isOpen: boolean;
  position: 'left' | 'right';
  name: string;
  description: string;
  image: string;
}

export default function MenuHighlight() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const [popup, setPopup] = useState<MenuPopup>({
    isOpen: false,
    position: 'left',
    name: '',
    description: '',
    image: ''
  });

  const openPopup = (position: 'left' | 'right', name: string, description: string, image: string) => {
    setPopup({ isOpen: true, position, name, description, image });
  };

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
  };

  return (
    <section
      ref={ref}
      className={`relative w-full py-16 px-8 bg-black transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      <h2 className="text-center text-4xl font-bold text-white mb-12">
        PILIH <span className="text-red-600">RAMENMU!</span>
      </h2>

      <div className="flex justify-center items-center gap-12 flex-wrap max-w-6xl mx-auto">

        {/* Left Menu Item */}
        <div 
          className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105"
          onClick={() => openPopup('left', 'Ramen Miso', 'Ramen dengan kuah miso yang kaya rasa, dilengkapi dengan irisan daging babi chashu, telur ramen, dan sayuran segar.', '/images/foto-ramen.png')}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/foto-ramen.png" 
              alt="Ramen Miso"
              width={400} 
              height={400} 
              className="w-full max-w-md h-auto object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <h3 className="text-white mt-6 text-xl font-semibold underline transition-colors duration-300 group-hover:text-red-500" style={{ fontFamily: 'Osnova Pro' }}>
            Ramen Miso
          </h3>
        </div>

        {/* Right Menu Item */}
        <div 
          className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105"
          onClick={() => openPopup('right', 'Ramen Kari', 'Ramen dengan kuah kari Jepang yang creamy dan pedas, disajikan dengan ayam goreng crispy, telur ramen, dan taburan daun bawang.', '/images/foto-ramen.png')}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/foto-ramen.png" 
              alt="Ramen Kari"
              width={400} 
              height={400} 
              className="w-full max-w-md h-auto object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <h3 className="text-white mt-6 text-xl font-semibold underline transition-colors duration-300 group-hover:text-red-500" style={{ fontFamily: 'Osnova Pro' }}>
            Ramen Kari
          </h3>
        </div>

      </div>

      {/* View Full Menu Button */}
      <div className="flex justify-center mt-16">
        <Link 
          href="/menu"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
        >
          Lihat Menu Selengkapnya
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Comic-style Popup */}
      {popup.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center bg-black/70 backdrop-blur-sm"
          onClick={closePopup}
          style={{
            justifyContent: popup.position === 'left' ? 'flex-start' : 'flex-end'
          }}
        >
          <div 
            className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${
              popup.position === 'left' 
                ? 'animate-slideInLeft origin-left ml-8' 
                : 'animate-slideInRight origin-right mr-8'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '6px solid #000',
              boxShadow: '12px 12px 0px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Comic speech bubble pointer */}
            <div 
              className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 ${
                popup.position === 'left'
                  ? '-right-8 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[32px] border-l-white'
                  : '-left-8 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-r-[32px] border-r-white'
              }`}
              style={{
                filter: 'drop-shadow(-2px 0px 0px #000)',
              }}
            />

            {/* Content */}
            <div className="space-y-4">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-black">
                <Image
                  src={popup.image}
                  alt={popup.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="text-3xl font-bold text-black" style={{ fontFamily: 'Osnova Pro' }}>
                {popup.name}
              </h3>
              
              <p className="text-gray-700 text-base leading-relaxed">
                {popup.description}
              </p>
              
              <div className="pt-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Lihat Harga
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-200%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(200%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </section>
  );
}