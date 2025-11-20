"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrollReveal } from "../../../hooks/useScrollReveal";
import { fetchMenuByCategory } from "@/lib/menu";
import type { Menu, MenuCategory } from "@/lib/types/database.types";

interface MenuListProps {
  category: MenuCategory;
}

interface ExtendedMenu extends Menu {
  selectedToppings?: string[];
}

export default function MenuList({ category }: MenuListProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ExtendedMenu | null>(null);
  const [toppings, setToppings] = useState<Menu[]>([]);
  const [popupEnabled, setPopupEnabled] = useState<boolean | null>(null);
  const [showPrice, setShowPrice] = useState<boolean | null>(null);

  useEffect(() => {
    loadMenuItems();
    loadToppings();
    loadPopupSetting();
    loadShowPriceSetting();
  }, [category]);

  const loadPopupSetting = async () => {
    try {
      const response = await fetch('/api/settings/menu-popup');
      const data = await response.json();
      console.log('Popup setting loaded:', data);
      setPopupEnabled(data.enabled === true);
    } catch (err: any) {
      console.error('Error loading popup setting:', err);
      setPopupEnabled(true);
    }
  };

  const loadShowPriceSetting = async () => {
    try {
      const response = await fetch('/api/settings/menu-show-price');
      const data = await response.json();
      setShowPrice(data.showPrice === true);
    } catch (err: any) {
      console.error('Error loading show price setting:', err);
      setShowPrice(true);
    }
  };

  const loadToppings = async () => {
    try {
      const data = await fetchMenuByCategory('topping');
      setToppings(data);
    } catch (err: any) {
      console.error('Error loading toppings:', err);
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await fetchMenuByCategory(category);
      
      const sortedData = data.sort((a, b) => {
        if (a.is_special_ramen && !b.is_special_ramen) return -1;
        if (!a.is_special_ramen && b.is_special_ramen) return 1;
        
        const aStartsWithRamen = a.name.toLowerCase().startsWith('ramen');
        const bStartsWithRamen = b.name.toLowerCase().startsWith('ramen');
        
        if (aStartsWithRamen && !bStartsWithRamen) return -1;
        if (!aStartsWithRamen && bStartsWithRamen) return 1;
        return 0;
      });
      
      setMenuItems(sortedData);
      setError(null);
    } catch (err: any) {
      console.error(`Error loading ${category} menu:`, err);
      setError(err.message || `Failed to load ${category} menu`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        ref={ref}
        className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-12 px-6 justify-items-center"
      >
        {loading && (
          <div className={`col-span-full text-center py-8 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 delay-250ms"
              : "opacity-0 translate-y-12"
          }`}>
            <p className="text-gray-400">Loading menu...</p>
          </div>
        )}

        {error && (
          <div className={`col-span-full text-center py-8 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 delay-250ms"
              : "opacity-0 translate-y-12"
          }`}>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && menuItems.length === 0 && (
          <div className={`col-span-full text-center py-8 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 delay-250ms"
              : "opacity-0 translate-y-12"
          }`}>
            <p className="text-gray-400">No items available in this category.</p>
          </div>
        )}

        {!loading && !error && menuItems.length > 0 && menuItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => popupEnabled === true && setSelectedItem({ ...item, selectedToppings: [] })}
            style={{ transitionDelay: isVisible ? `${200 + idx * 220}ms` : "0ms" }}
            className={`p-6 rounded-2xl shadow-xl text-left w-full max-w-md transition-all duration-1000 ease-out ${
              popupEnabled === true ? 'cursor-pointer hover:scale-105' : ''
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="bg-[url('/images/wood-texture.jpg')] bg-cover bg-center rounded-xl overflow-hidden relative">
              <Image
                src={item.image_for_max_price || item.image_url || "/placeholder-menu.png"}
                alt={`Foto ${item.name}`}
                width={500}
                height={350}
                className="object-cover w-full h-auto"
                priority={idx < 2}
                loading={idx < 2 ? "eager" : "lazy"}
                onError={(e) => {
                  console.error(`Failed to load image for ${item.name}:`, item.image_for_max_price || item.image_url);
                  e.currentTarget.src = "/placeholder-menu.png";
                }}
                quality={85}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={false}
              />
              {item.is_special_ramen && (
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  SPECIAL
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold mt-4">{item.name}</h2>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}

        {/* Detail Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative custom-scrollbar-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="sticky top-4 float-right mr-4 mt-4 z-20 bg-black bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 transition-all hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative w-full h-80 bg-[url('/images/wood-texture.jpg')] bg-cover bg-center">
                <Image
                  src={selectedItem.image_for_max_price || selectedItem.image_url || "/placeholder-menu.png"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                  onError={(e) => {
                    console.error(`Failed to load modal image for ${selectedItem.name}`);
                    e.currentTarget.src = "/placeholder-menu.png";
                  }}
                />
                {selectedItem.is_special_ramen && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ SPECIAL RAMEN
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedItem.name}</h2>
                
                {/* Price Section */}
                {showPrice === true && (
                  <div className="mb-6">
                    {selectedItem.price && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-300">
                          Rp {selectedItem.price.toLocaleString('id-ID')}
                        </span>
                        {selectedItem.price_for_max_price && (
                          <span className="text-lg text-gray-400">
                            - Rp {selectedItem.price_for_max_price.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedItem.description}</p>
                </div>

                {/* Additional Images for Special Ramen */}
                {selectedItem.is_special_ramen && selectedItem.image_url && selectedItem.image_for_max_price && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Variants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:border-r border-gray-700 md:pr-4">
                        <p className="text-sm text-gray-400 mb-2">Base Variant</p>
                        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-[url('/images/wood-texture.jpg')] bg-cover">
                          <Image
                            src={selectedItem.image_url}
                            alt={`${selectedItem.name} - Base`}
                            fill
                            className="object-contain"
                            priority
                            quality={85}
                            onError={(e) => {
                              console.error(`Failed to load base variant image for ${selectedItem.name}`);
                              e.currentTarget.src = "/placeholder-menu.png";
                            }}
                          />
                        </div>
                        {showPrice === true && selectedItem.price && (
                          <p className="text-sm text-white font-semibold mt-2">
                            Rp {selectedItem.price.toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                      <div className="md:pl-4">
                        <p className="text-sm text-gray-400 mb-2">Premium Variant</p>
                        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-[url('/images/wood-texture.jpg')] bg-cover">
                          <Image
                            src={selectedItem.image_for_max_price}
                            alt={`${selectedItem.name} - Premium`}
                            fill
                            className="object-contain"
                            priority
                            quality={85}
                            onError={(e) => {
                              console.error(`Failed to load premium variant image for ${selectedItem.name}`);
                              e.currentTarget.src = "/placeholder-menu.png";
                            }}
                          />
                        </div>
                        {showPrice === true && selectedItem.price_for_max_price && (
                          <p className="text-sm text-white font-semibold mt-2">
                            Rp {selectedItem.price_for_max_price.toLocaleString('id-ID')}
                          </p>
                        )}
                        {toppings.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Includes all toppings:</p>
                            <div className="flex flex-wrap gap-1">
                              {toppings.map((topping) => (
                                <span
                                  key={topping.id}
                                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                                >
                                  {topping.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Topping Calculator for Special Ramen */}
                {selectedItem.is_special_ramen && toppings.length > 0 && showPrice === true && (
                  <div className="mb-6 border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Customize Your Ramen</h3>
                    <p className="text-sm text-gray-400 mb-4">Select toppings to calculate your custom price</p>
                    
                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto custom-scrollbar-topping pr-2">
                      {toppings.map((topping) => {
                        const isSelected = selectedItem.selectedToppings?.includes(topping.id) || false;
                        return (
                          <label
                            key={topping.id}
                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentSelected = selectedItem.selectedToppings || [];
                                  const newSelected = e.target.checked
                                    ? [...currentSelected, topping.id]
                                    : currentSelected.filter((id: string) => id !== topping.id);
                                  setSelectedItem({
                                    ...selectedItem,
                                    selectedToppings: newSelected
                                  });
                                }}
                                className="w-4 h-4 accent-gray-500"
                              />
                              <span className="text-white">{topping.name}</span>
                            </div>
                            <span className="text-white text-sm font-semibold">
                              +Rp {(topping.price || 0).toLocaleString('id-ID')}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Custom Order Summary */}
                    {(selectedItem.selectedToppings || []).length > 0 && (
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h4 className="text-white font-semibold mb-2">Your Custom Order</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-300">
                            <span>{selectedItem.name} (Base)</span>
                            <span>Rp {(selectedItem.price || 0).toLocaleString('id-ID')}</span>
                          </div>
                          
                          <div className="border-t border-gray-700 pt-2">
                            <p className="text-gray-400 mb-1">Selected Toppings:</p>
                            {(selectedItem.selectedToppings || []).map((toppingId: string) => {
                              const topping = toppings.find(t => t.id === toppingId);
                              return topping ? (
                                <div key={topping.id} className="flex justify-between text-gray-300 pl-2">
                                  <span>+ {topping.name}</span>
                                  <span>Rp {(topping.price || 0).toLocaleString('id-ID')}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                          
                          <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold text-base">
                            <span>Total Price</span>
                            <span className="text-white">
                              Rp {(
                                (selectedItem.price || 0) +
                                (selectedItem.selectedToppings || []).reduce((sum: number, toppingId: string) => {
                                  const topping = toppings.find(t => t.id === toppingId);
                                  return sum + (topping?.price || 0);
                                }, 0)
                              ).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Availability Status */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedItem.is_available 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {selectedItem.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Modal Scrollbar - White Color */
        .custom-scrollbar-modal {
          scrollbar-width: thin;
          scrollbar-color: #ffffff #2d2d2d;
        }

        .custom-scrollbar-modal::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar-modal::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 10px;
          margin: 10px;
        }

        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: #ffffff;
          border-radius: 10px;
          border: 2px solid #2d2d2d;
          transition: all 0.3s ease;
        }

        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background: #e5e5e5;
          border: 2px solid #1a1a1a;
        }

        .custom-scrollbar-modal::-webkit-scrollbar-thumb:active {
          background: #d4d4d4;
        }

        /* Topping List Scrollbar - White Color */
        .custom-scrollbar-topping {
          scrollbar-width: thin;
          scrollbar-color: #ffffff #374151;
        }

        .custom-scrollbar-topping::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar-topping::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 8px;
        }

        .custom-scrollbar-topping::-webkit-scrollbar-thumb {
          background: #ffffff;
          border-radius: 8px;
          border: 2px solid #374151;
          transition: all 0.3s ease;
        }

        .custom-scrollbar-topping::-webkit-scrollbar-thumb:hover {
          background: #e5e5e5;
        }

        .custom-scrollbar-topping::-webkit-scrollbar-thumb:active {
          background: #d4d4d4;
        }

        /* Smooth scrolling */
        .custom-scrollbar-modal,
        .custom-scrollbar-topping {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}