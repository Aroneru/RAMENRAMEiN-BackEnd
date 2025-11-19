"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

export default function AboutSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  return (
    <section
      ref={ref}
      className="relative w-full py-12 md:py-20 px-4 bg-black overflow-hidden"
    >

      <div 
        className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-6 lg:pr-8">
            <div className="inline-block">
              <span className="text-red-500 font-semibold text-xs md:text-sm tracking-wider uppercase mb-2 block">
                Discover Our Story
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                TENTANG
                <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mt-2">KAMI</span>
              </h2>
            </div>
            
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              RAMENRAMEiN adalah sebuah kedai ramen Jepang yang berlokasi
              di jantung kota Bogor. Kami menyajikan gabungan cita rasa Jepang
              dengan sentuhan lokal yang hangat.
            </p>
            
            <Link 
              href="/tentang-kami"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/60 hover:scale-105"
            >
              <span>Lihat Lebih Lanjut</span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Right Column - Image with Overlay */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/bangunan_ramen_upscaled.png" 
                alt="Foto Kedai Ramein Ramen"
                width={800}
                height={600}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {/* Overlay Pattern */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-left-6 md:-bottom-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 group-hover:scale-110 transition-transform duration-300 max-w-[90%] md:max-w-none">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl md:text-2xl">🍜</span>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold text-gray-900 whitespace-nowrap">Affordable</p>
                  <p className="text-xs md:text-sm text-gray-600 whitespace-nowrap">Japanese-Indonesian Ramen</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}