"use client";

import Image from "next/image";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

interface ToppingProps {
  toppings: { name: string; img: string }[];
}

export default function ToppingsSection({ toppings }: ToppingProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
          {toppings.map((item, idx) => (
            <div
              key={idx}
              style={{ transitionDelay: isVisible ? `${200 + idx * 160}ms` : "0ms" }}
              className={`transition-all duration-1000 ease-out text-center ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Image
                src={item.img}
                alt={`Foto ${item.name}`}
                width={150}
                height={150}
                className="rounded-md object-cover aspect-square"
              />
              <h3 className="mt-4 font-semibold">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
