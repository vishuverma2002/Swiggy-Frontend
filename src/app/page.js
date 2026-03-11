"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/page";
import Categories from "@/components/Categories/page";
import Footer from "@/components/Footer/page";
import Toast from "@/components/toast/Toast";

export default function Home() {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (searchParams.get("login") === "success") {
      setToast({ message: "Login successful", title: "Success", success: true });
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.delete("login");
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [searchParams]);

  return (
    <>
      {toast && (
        <div style={{ position: "fixed", right: 20, top: 20, zIndex: 5000 }}>
          <Toast
            message={toast.message}
            title={toast.title}
            success={toast.success}
            unloader={() => setToast(null)}
          />
        </div>
      )}
      <Header />
      <Categories />
      <Footer />
    </>
  );
}
