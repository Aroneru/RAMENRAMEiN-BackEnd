"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrollReveal } from "../../../hooks/useScrollReveal";
import { fetchMenuByCategory } from "@/lib/menu";
import type { Menu, MenuCategory } from "@/lib/types/database.types";

interface MenuListProps {
  category: MenuCategory;
}

export default function MenuList({ category }: MenuListProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenuItems();
  }, [category]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await fetchMenuByCategory(category);
      setMenuItems(data);
      setError(null);
    } catch (err: any) {
      console.error(`Error loading ${category} menu:`, err);
      setError(err.message || `Failed to load ${category} menu`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={ref}
      className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-12 px-6 justify-items-center"
    >
      {loading && (
        <div className={`col-span-full text-center py-8 transition-all duration-1000 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 delay-[250ms]"
            : "opacity-0 translate-y-12"
        }`}>
          <p className="text-gray-400">Loading menu...</p>
        </div>
      )}

      {error && (
        <div className={`col-span-full text-center py-8 transition-all duration-1000 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 delay-[250ms]"
            : "opacity-0 translate-y-12"
        }`}>
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && menuItems.length === 0 && (
        <div className={`col-span-full text-center py-8 transition-all duration-1000 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 delay-[250ms]"
            : "opacity-0 translate-y-12"
        }`}>
          <p className="text-gray-400">No items available in this category.</p>
        </div>
      )}

      {!loading && !error && menuItems.length > 0 && menuItems.map((item, idx) => (
        <div
          key={item.id}
          style={{ transitionDelay: isVisible ? `${200 + idx * 220}ms` : "0ms" }}
          className={`p-6 rounded-2xl shadow-xl text-left w-full max-w-md transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-[url('/images/wood-texture.jpg')] bg-cover bg-center rounded-xl overflow-hidden">
            <Image
              src={item.image_url || "/placeholder-menu.png"}
              alt={`Foto ${item.name}`}
              width={500}
              height={350}
              className="object-cover w-full h-auto"
            />
          </div>
          <h2 className="text-xl font-bold mt-4">{item.name}</h2>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}