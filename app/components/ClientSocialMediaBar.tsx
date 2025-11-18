"use client";

import { usePathname } from "next/navigation";
import SocialMediaBar from "./compro/SocialMediaBar";

export default function ClientSocialMediaBar() {
  const pathname = usePathname();
  const hideOn = ["/login", "/dashboard-home", "/dashboard-about", "/dashboard-menu", "/dashboard-faq", "/dashboard-news"];

  if (hideOn.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }
  return <SocialMediaBar />;
}