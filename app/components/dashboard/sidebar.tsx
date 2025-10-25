"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname() || "";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="w-[256px] h-screen bg-[#1D1A1A] flex flex-col items-start text-white">
      {/* Logo Section */}
      <div className="mt-[40px] flex flex-col items-center w-full">
        <Image
          src="/logo_ramenramein.svg"
          alt="RAMEiN Logo"
          width={160}
          height={60}
        />
      </div>

      <div className="mt-[45px]" />
      <nav className="flex flex-col w-full">
        <SidebarButton
          href="/dashboard-home"
          iconSrc="/dashboard/home.svg"
          label="Home"
          active={isActive("/dashboard-home")}
        />

        <div className="mt-[0px]" />
        <SidebarButton
          href="/dashboard-about"
          iconSrc="/dashboard/about.svg"
          label="About"
          active={isActive("/dashboard-about")}
        />

        <div className="mt-[0px]" />
        <SidebarButton
          href="/dashboard-menu"
          iconSrc="/dashboard/menu.svg"
          label="Menu"
          active={isActive("/dashboard-menu")}
        />

        <div className="mt-[0px]" />
        <SidebarButton
          href="/dashboard-faq"
          iconSrc="/dashboard/faq.svg"
          label="FAQ"
          active={isActive("/dashboard-faq")}
        />

        <div className="mt-[0px]" />
        <SidebarButton
          href="/dashboard-news"
          iconSrc="/dashboard/news.svg"
          label="News"
          active={isActive("/dashboard-news")}
        />
      </nav>

      <div className="mt-[35px]" />

      <SidebarButton
        href="/login"
        iconSrc="/dashboard/logout.svg"
        label="Logout"
      />
    </div>
  );
}

interface SidebarButtonProps {
  href: string;
  iconSrc: string;
  label: string;
  active?: boolean;
}

function SidebarButton({ href, iconSrc, label, active }: SidebarButtonProps) {
  return (
    <Link
      href={href}
      className={`flex items-center w-full h-[60px] pl-[45px] pr-6 text-[18px] ${
        active ? "bg-[#3A3737]" : "bg-transparent hover:bg-[#2A2727]"
      } transition-colors`}
    >
      <span className="flex items-center gap-[15px]">
        <img src={iconSrc} alt="" width={24} height={24} />
        <span className="font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
          {label}
        </span>
      </span>
    </Link>
  );
}