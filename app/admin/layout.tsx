"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ AUTH GUARD (HOOK ALWAYS TOP LEVEL)
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();

      // 👉 agar user login nahi hai → login page bhejo
      if (!data.user && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    };

    checkAdmin();
  }, [router, pathname]); // ✅ dependency fix

  // ✅ LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login"); // ✅ correct redirect
  };

  // ✅ LOGIN PAGE PE SIDEBAR HIDE
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          handleLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-64 bg-white h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 border-b sticky top-0 z-40">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-xl"
          >
            ☰
          </button>

          <h2 className="font-semibold text-teal-700">
            Staysphere Admin
          </h2>
        </div>

        {/* Content */}
        <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}