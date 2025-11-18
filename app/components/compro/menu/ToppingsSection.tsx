"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrollReveal } from "../../../hooks/useScrollReveal";
import { fetchMenuByCategory } from "@/lib/menu";
import type { Menu } from "@/lib/types/database.types";

export default function ToppingsSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const [toppings, setToppings] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadToppings();
  }, []);

  const loadToppings = async () => {
    try {
      setLoading(true);
      const data = await fetchMenuByCategory("topping");
      setToppings(data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading toppings:", err);
      setError(err.message || "Failed to load toppings");
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
                style={{ transitionDelay: isVisible ? `${200 + idx * 160}ms` : "0ms" }}
                className={`transition-all duration-1000 ease-out text-center ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="relative w-[150px] h-[150px] rounded-md overflow-hidden">
                  <Image
                    src={item.image_url || "/placeholder-topping.png"}
                    alt={`Foto ${item.name}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
                <h3 className="mt-4 font-semibold">{item.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}