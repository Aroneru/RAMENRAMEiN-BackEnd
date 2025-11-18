"use client";
import { useState } from "react";
import MenuHeader from "../components/compro/menu/MenuHeroSection";
import MenuTabs from "../components/compro/menu/MenuTabs";
import MenuList from "../components/compro/menu/MenuList";
import ToppingsSection from "../components/compro/menu/ToppingsSection";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("ramen");

  return (
    <main className="bg-black text-white min-h-screen pb-20">
      <MenuHeader />
      <MenuTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "ramen" && (
        <>
          <MenuList category="ramen" />
          <ToppingsSection />
        </>
      )}
      
      {activeTab === "nyemil" && (
        <MenuList category="nyemil" />
      )}
      
      {activeTab === "minuman" && (
        <MenuList category="minuman" />
      )}
    </main>
  );
}