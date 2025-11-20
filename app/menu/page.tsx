"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MenuHeader from "../components/compro/menu/MenuHeroSection";
import MenuTabs from "../components/compro/menu/MenuTabs";
import MenuList from "../components/compro/menu/MenuList";
import ToppingsSection from "../components/compro/menu/ToppingsSection";

function MenuContent() {
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
    <>
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
    </>
  );
}

export default function MenuPage() {
  return (
    <main className="bg-black text-white min-h-screen pb-20">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <MenuContent />
      </Suspense>
    </main>
  );
}