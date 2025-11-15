"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ClientNavbar from "./ClientNavbar";
import SocialMediaBar from "./compro/SocialMediaBar";
import Footer from "./compro/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  // Hide social media bar and footer for dashboard pages.
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard-");

  return (
    <>
      <ClientNavbar />
      {!isDashboard && <SocialMediaBar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
