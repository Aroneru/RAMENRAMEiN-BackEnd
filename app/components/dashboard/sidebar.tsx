"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/(auth)/login/logout-action";

export default function Sidebar() {
  const pathname = usePathname() || "";
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      // Call server action to logout
      const result = await logoutAction();
      
      if (result?.error) {
        console.error('Logout error:', result.error);
        setLoggingOut(false);
        setShowLogoutModal(false);
        return;
      }

      // Clear client-side storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Force hard reload to clear all cached data and redirect
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1D1A1A] rounded-md text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile - dengan opacity yang lebih ringan */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`w-[256px] bg-[#1D1A1A] flex flex-col items-start text-white fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-[#2A2727] rounded transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo Section */}
        <Link href="/home" className="mt-10 flex flex-col items-center w-full cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src="/logo_ramenramein.svg"
            alt="RAMEiN Logo"
            width={160}
            height={60}
          />
        </Link>

        <div className="mt-[45px]" />
        
        {/* Navigation */}
        <nav className="flex flex-col w-full">
          <SidebarButton
            href="/dashboard-home"
            iconSrc="/dashboard/home.svg"
            label="Home"
            active={isActive("/dashboard-home")}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mt-0" />
          <SidebarButton
            href="/dashboard-menu"
            iconSrc="/dashboard/menu.svg"
            label="Menu"
            active={isActive("/dashboard-menu")}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mt-0" />
          <SidebarButton
            href="/dashboard-faq"
            iconSrc="/dashboard/faq.svg"
            label="FAQ"
            active={isActive("/dashboard-faq")}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="mt-0" />
          <SidebarButton
            href="/dashboard-news"
            iconSrc="/dashboard/news.svg"
            label="News"
            active={isActive("/dashboard-news")}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </nav>

        <div className="mt-[35px]" />

        {/* Logout Button - Posisi tetap seperti semula */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center w-full h-[60px] pl-[45px] pr-6 text-[18px] bg-transparent hover:bg-[#2A2727] transition-colors"
        >
          <span className="flex items-center gap-[15px]">
            <img src="/dashboard/logout.svg" alt="" width={24} height={24} />
            <span className="font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
              Logout
            </span>
          </span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleLogoutCancel}
        >
          <div
            className="bg-white rounded-lg shadow-xl animate-scale-in overflow-hidden w-full max-w-[400px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div
                className="rounded-full bg-yellow-100 flex items-center justify-center"
                style={{ width: "64px", height: "64px" }}
              >
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <h3 className="text-center mb-3" style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: "600", color: "#1D1A1A" }}>
              Logout Confirmation
            </h3>
            <p className="text-center mb-6" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", color: "#666", lineHeight: "1.5" }}>
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleLogoutCancel} 
                disabled={loggingOut} 
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50" 
                style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", minWidth: "120px" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogoutConfirm} 
                disabled={loggingOut} 
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50" 
                style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", minWidth: "120px" }}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

interface SidebarButtonProps {
  href: string;
  iconSrc: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarButton({ href, iconSrc, label, active, onClick }: SidebarButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
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