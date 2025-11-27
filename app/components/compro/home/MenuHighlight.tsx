"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { fetchMenuByCategory } from '@/lib/menu';
import type { Menu } from '@/lib/types/database.types';

interface MenuPopup {
  isOpen: boolean;
  position: 'left' | 'right';
  name: string;
  description: string;
  image: string;
  menuId: string;
}

export default function MenuHighlight() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const [popup, setPopup] = useState<MenuPopup>({
    isOpen: false,
    position: 'left',
    name: '',
    description: '',
    image: '',
    menuId: ''
  });
  const [specialRamen, setSpecialRamen] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecialRamen();
  }, []);

  const loadSpecialRamen = async () => {
    try {
      setLoading(true);
      const data = await fetchMenuByCategory('ramen');
      // Filter only special ramen and limit to 2
      const special = data.filter(item => item.is_special_ramen).slice(0, 2);
      setSpecialRamen(special);
    } catch (error) {
      console.error('Error loading special ramen:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPopup = (position: 'left' | 'right', name: string, description: string, image: string, menuId: string) => {
    setPopup({ isOpen: true, position, name, description, image, menuId });
  };

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
  };

  return (
    <section
      ref={ref}
      className={`relative w-full py-12 md:py-16 px-4 md:px-8 bg-black overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

      <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-8 md:mb-12">
        PILIH <span className="text-red-600">RAMENMU!</span>
      </h2>

      <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap max-w-6xl mx-auto">

        {loading ? (
          <div className="text-white text-center py-8">Loading...</div>
        ) : specialRamen.length === 0 ? (
          <div className="text-white text-center py-8">No special ramen available</div>
        ) : (
          specialRamen.map((item, index) => (
            <div 
              key={item.id}
              className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105 w-full sm:w-auto"
              onClick={() => openPopup(
                index === 0 ? 'left' : 'right', 
                item.name, 
                item.description || '', 
                item.image_for_max_price || item.image_url || '/images/foto-ramen.png',
                item.id
              )}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl max-w-sm mx-auto">
                <Image
                  src={item.image_for_max_price || item.image_url || '/images/foto-ramen.png'}
                  alt={item.name}
                  width={400} 
                  height={400} 
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-white mt-4 md:mt-6 text-lg md:text-xl font-semibold transition-colors duration-300 group-hover:text-red-500" style={{ fontFamily: 'Osnova Pro' }}>
                {item.name}
              </h3>
            </div>
          ))
        )}

      </div>

      {/* View Full Menu Button */}
      <div className="flex justify-center mt-12 md:mt-16">
        <Link 
          href="/menu"
          className="group inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
        >
          Lihat Menu Selengkapnya
          <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Comic-style Popup */}
      {popup.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={closePopup}
        >
          <div 
            className={`relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ${
              popup.position === 'left' 
                ? 'animate-slideInLeft origin-left' 
                : 'animate-slideInRight origin-right'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '4px solid #000',
              boxShadow: '12px 12px 0px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Content */}
            <div className="space-y-4">
              <div className="relative w-full h-64 md:h-64 rounded-2xl overflow-hidden border-3 md:border-4 border-black">
                <Image
                  src={popup.image}
                  alt={popup.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-black" style={{ fontFamily: 'Osnova Pro' }}>
                {popup.name}
              </h3>
              
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {popup.description}
              </p>
              
              <div className="pt-2 md:pt-4 pb-4">
                <Link
                  href={`/menu?open=${popup.menuId}`}
                  className="inline-flex items-center justify-center w-full gap-2 px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Lihat Detail
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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