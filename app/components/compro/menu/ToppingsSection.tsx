"use client";

import { useState, useEffect } from "react";
import { useScrollReveal } from "../../../hooks/useScrollReveal";
import { fetchMenuByCategory } from "@/lib/menu";
import type { Menu } from "@/lib/types/database.types";

export default function ToppingsSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const [toppings, setToppings] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopping, setSelectedTopping] = useState<Menu | null>(null);
  const [popupEnabled, setPopupEnabled] = useState<boolean | null>(null);
  const [showPrice, setShowPrice] = useState<boolean | null>(null);

  useEffect(() => {
    loadToppings();
    loadPopupSetting();
    loadShowPriceSetting();
  }, []);

  const loadPopupSetting = async () => {
    try {
      const response = await fetch('/api/settings/menu-popup');
      const data = await response.json();
      setPopupEnabled(data.enabled === true);
    } catch (err: unknown) {
      console.error('Error loading popup setting:', err);
      setPopupEnabled(true);
    }
  };

  const loadShowPriceSetting = async () => {
    try {
      const response = await fetch('/api/settings/menu-show-price');
      const data = await response.json();
      setShowPrice(data.showPrice === true);
    } catch (err: unknown) {
      console.error('Error loading show price setting:', err);
      setShowPrice(true);
    }
  };

  const loadToppings = async () => {
    try {
      setLoading(true);
      const data = await fetchMenuByCategory("topping");
      setToppings(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error loading toppings:", err);
      setError((err as Error).message || "Failed to load toppings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-16">
        <div
          className="h-px bg-[#F98582]"
          style={{ width: "1284px", maxWidth: "90%" }}
        ></div>
      </div>

      <div
        ref={ref}
        className="max-w-6xl mx-auto mt-20 px-6"
      >
        <h2 className="text-center text-2xl font-bold mb-10">TAMBAH TOPPING</h2>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading toppings...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && toppings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No toppings available at the moment.</p>
          </div>
        )}

        {!loading && !error && toppings.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
            {toppings.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => popupEnabled === true && setSelectedTopping(item)}
                style={{ transitionDelay: isVisible ? `${200 + idx * 160}ms` : "0ms" }}
                className={`transition-all duration-1000 ease-out text-center ${
                  popupEnabled === true ? 'cursor-pointer hover:scale-105' : ''
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="relative w-[150px] h-[150px] rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url || "/placeholder-topping.png"}
                    alt={`Foto ${item.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-4 font-semibold">{item.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Topping Detail Modal */}
      {selectedTopping && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedTopping(null)}
        >
          <div
            className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTopping(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative w-full h-80 bg-[url('/images/wood-texture.jpg')] bg-cover bg-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedTopping.image_url || "/placeholder-topping.png"}
                alt={selectedTopping.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedTopping.name}</h2>
              
              {/* Price Section */}
              {showPrice === true && selectedTopping.price && (
                <div className="mb-6">
                  <span className="text-2xl font-bold text-red-300">
                    Rp {selectedTopping.price.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{selectedTopping.description}</p>
              </div>

              {/* Availability Status */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTopping.is_available 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {selectedTopping.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}