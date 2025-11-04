"use client";
import { useState } from "react";
import MenuHeader from "../components/compro/menu/MenuHeroSection";
import MenuTabs from "../components/compro/menu/MenuTabs";
import MenuList from "../components/compro/menu/MenuList";
import ToppingsSection from "../components/compro/menu/ToppingsSection";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("ramen");
  const ramenMenu = [
    {
      name: "Ramen Curry",
      desc: "Mie ramen dengan kuah curry Jepang yang kental dan gurih, dilengkapi dengan potongan ayam tender, wortel, dan kentang dalam bumbu curry autentik",
      img: "/images/menu/RAMEN/Curry.png",
    },
    {
      name: "Ramen Miso",
      desc: "Ramen klasik dengan kuah berbahan dasar miso fermentasi, dihidangkan dengan chashu babi/ayam, jagung manis, daun bawang, dan tauge segar",
      img: "/images/menu/RAMEN/Miso.png",
    },
    {
      name: "Chicken Katsu Egg Curryaki",
      desc: "Inovasi unik yang menggabungkan chicken katsu renyah dengan saus curry Kalimantan, telur ajitama, dan saus teriyaki, disajikan dengan sayuran segar",
      img: "/images/menu/RAMEN/Chicken Katsu Egg Curryaki.png",
    },
    {
      name: "Karage Bento",
      desc: "Set bento lengkap dengan ayam karage renyah yang digoreng sempurna, disajikan dengan nasi Jepang pulen, sayuran acar, dan tambahan telur ajitama",
      img: "/images/menu/RAMEN/Karage Bento.png",
    },
    {
      name: "Katsu Bento",
      desc: "Chicken katsu yang renyah di luar dan juicy di dalam, disajikan dalam set bento dengan nasi putih, saus tonkatsu special, dan sayuran segar pilihan",
      img: "/images/menu/RAMEN/Katsu Bento.png",
    },
  ];

  const nyemilMenu = [
    {
      name: "Chicken Katsu",
      desc: "Fillet dada ayam dibalut dengan tepung panko premium dan digoreng sempurna hingga golden crispy, disajikan dengan saus tonkatsu homemade",
      img: "/images/menu/NYEMIL/Chicken Katsu.png",
    },
    {
      name: "Ekaido",
      desc: "Camilan khas Jepang dengan isian udang dan sayuran, dibungkus kulit yang tipis dan renyah, disajikan dengan saus sambal special",
      img: "/images/menu/NYEMIL/Ekaido.png",
    },
    {
      name: "Karage",
      desc: "Potongan ayam yang dimarinasi dengan jahe dan kecap asin, digoreng garing dengan tepung khusus hingga golden brown dan tetap juicy di dalam",
      img: "/images/menu/NYEMIL/Karage.png",
    },
    {
      name: "Miso Soup",
      desc: "Sup tradisional Jepang dengan kaldu dashi dan pasta miso pilihan, ditambah dengan tahu sutra, wakame, dan daun bawang segar",
      img: "/images/menu/NYEMIL/Miso Soup.png",
    },
  ];

  const minumanMenu = [
    {
      name: "Mango Yogurt",
      desc: "Smoothie segar dengan mangga pilihan dan yogurt creamy, diblender dengan es batu hingga lembut, menciptakan minuman yang menyegarkan dan sehat",
      img: "/images/menu/DRINKS/Mango Yogurt.png",
    },
    {
      name: "Soda Pecah",
      desc: "Minuman soda kreatif dengan campuran sirup buah segar dan soda yang 'pecah' dengan sensasi fizzy yang menyegarkan, perfect untuk cuaca panas",
      img: "/images/menu/DRINKS/Soda Pecah.png",
    },
    {
      name: "Ganbatte Lychee",
      desc: "Minuman signature dengan kelembutan buah leci premium, dipadukan dengan soda segar dan sentuhan mint yang memberikan semangat 'Ganbatte' khas Jepang",
      img: "/images/menu/DRINKS/Ganbatte Lychee.png",
    },
  ];

  const toppings = [
    { name: "SMOKE BEEF", img: "/images/menu/RAMEN/sides/Smoke Beef.png" },
    { name: "TELUR AJITAMA", img: "/images/menu/RAMEN/sides/Ajitama Egg.png" },
    { name: "NORI SEAWEED", img: "/images/menu/RAMEN/sides/Nori Seaweed.png" },
    { name: "DIMSUM", img: "/images/menu/RAMEN/sides/Dimsum.png" },
    { name: "GYOZA", img: "/images/menu/RAMEN/sides/Gyoza.png" },
  ];

  const getActiveMenu = () => {
    switch (activeTab) {
      case "nyemil":
        return nyemilMenu;
      case "minuman":
        return minumanMenu;
      default:
        return ramenMenu;
    }
  };

  return (
    <main className="bg-black text-white min-h-screen pb-20">
      <MenuHeader />
      <MenuTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <MenuList items={getActiveMenu()} />
      {activeTab === "ramen" && <ToppingsSection toppings={toppings} />}
    </main>
  );
}
