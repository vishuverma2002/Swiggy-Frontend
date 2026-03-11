"use client";

import { StoreProvider } from "@/store/store";
import AuthGuard from "@/components/AuthGuard";

export default function ClientLayout({ children }) {
  return (
    <StoreProvider>
      <AuthGuard>{children}</AuthGuard>
    </StoreProvider>
  );
}
