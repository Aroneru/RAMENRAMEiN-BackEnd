import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Auth",
  description: "Authentication pages",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Nested layout jangan pakai <html>/<body>
  return <div className={poppins.className}>{children}</div>;
}