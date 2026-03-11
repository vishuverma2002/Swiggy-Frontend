"use client";

import { useContext } from "react";
import { usePathname } from "next/navigation";
import LoginPage from "@/components/LoginPage";
import { Context } from "@/store/store";

const PUBLIC_PATHS = ["/login", "/signUp", "/signIn"];

export default function AuthGuard({ children }) {
  const { user, isHydrated } = useContext(Context);
  const pathname = usePathname();
  const isPublicPath = pathname ? PUBLIC_PATHS.includes(pathname) : false;

  if (!isHydrated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff9f5 0%, #fff5eb 100%)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #fcd5b8",
            borderTopColor: "#fc8019",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!user && !isPublicPath) {
    return <LoginPage />;
  }

  return children;
}
