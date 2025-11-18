"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ClientNavbar from "./ClientNavbar";
import SocialMediaBar from "./compro/SocialMediaBar";
import Footer from "./compro/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide social media bar and footer for dashboard and auth pages
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard-");
  const isAuthPage = pathname.startsWith("/login");
  const hideSocialMediaAndFooter = isDashboard || isAuthPage;

  // Render without conditional elements on server to prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <ClientNavbar />
        {children}
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      {!hideSocialMediaAndFooter && <SocialMediaBar />}
      {children}
      {!hideSocialMediaAndFooter && <Footer />}
    </>
  );
}