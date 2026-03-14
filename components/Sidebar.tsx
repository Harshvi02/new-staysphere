"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {

  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-teal-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r p-6 flex flex-col justify-between">

      {/* Logo */}
      <div>

        <h2 className="text-xl font-bold text-teal-700 mb-8">
          Staysphere
        </h2>

        {/* Navigation */}
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

      {/* Logout */}
      <button className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
        Logout
      </button>

    </aside>
  );
}