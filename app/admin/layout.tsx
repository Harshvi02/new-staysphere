"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg ${
      pathname === path
        ? "bg-teal-600 text-white"
        : "hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-x-hidden">

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white border-r p-6 flex-col justify-between sticky top-0 h-screen">

        <div>
          <div className="flex items-center gap-3 mb-8">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <h2 className="font-bold text-lg text-teal-700">
              Staysphere
            </h2>
          </div>

          <nav className="space-y-2">
            <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
              Dashboard
            </Link>

            <Link href="/admin/cabins" className={linkClass("/admin/cabins")}>
              Cabins
            </Link>

            <Link href="/admin/bookings" className={linkClass("/admin/bookings")}>
              Bookings
            </Link>

            <Link href="/admin/users" className={linkClass("/admin/users")}>
              Users
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 rounded-lg"
        >
          Logout
        </button>

      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar (Mobile) */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 border-b sticky top-0 z-40">

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl"
          >
            ☰
          </button>

          <h2 className="font-semibold text-teal-700">
            Staysphere Admin
          </h2>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-b p-4 space-y-2">

            <Link href="/admin/dashboard" className="block">
              Dashboard
            </Link>

            <Link href="/admin/cabins" className="block">
              Cabins
            </Link>

            <Link href="/admin/bookings" className="block">
              Bookings
            </Link>

            <Link href="/admin/users" className="block">
              Users
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </button>

          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          {children}
        </main>

      </div>

    </div>
  );
}