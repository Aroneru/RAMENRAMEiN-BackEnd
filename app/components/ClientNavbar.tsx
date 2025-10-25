"use client";

import { usePathname } from "next/navigation";
import Navbar from "./compro/Navbar";

export default function ClientNavbar() {
  const pathname = usePathname();
  const hideOn = ["/login"]; // tambah rute lain jika perlu

  if (hideOn.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }
  return <Navbar />;
}