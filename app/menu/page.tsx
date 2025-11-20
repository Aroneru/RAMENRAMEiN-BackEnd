"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MenuHeader from "../components/compro/menu/MenuHeroSection";
import MenuTabs from "../components/compro/menu/MenuTabs";
import MenuList from "../components/compro/menu/MenuList";
import ToppingsSection from "../components/compro/menu/ToppingsSection";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("ramen");
  const searchParams = useSearchParams();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const menuId = searchParams.get('open');
    if (menuId) {
      setOpenMenuId(menuId);
      setActiveTab("ramen"); // Ensure ramen tab is active since special items are always ramen
    }
  }, [searchParams]);

  return (
    <main className="bg-black text-white min-h-screen pb-20">
      <MenuHeader />
      <MenuTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "ramen" && (
        <>
          <MenuList category="ramen" openMenuId={openMenuId} />
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