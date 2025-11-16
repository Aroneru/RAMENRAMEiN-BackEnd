'use client';

import { AuthProvider } from "./auth/AuthProvider";
import LayoutWrapper from "./LayoutWrapper";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </AuthProvider>
  );
}
