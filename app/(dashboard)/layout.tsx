import type { ReactNode } from "react";
import Sidebar from "../components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Middleware handles authentication and authorization
  // So we can just render the dashboard layout directly
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}