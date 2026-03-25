"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  collapsed,
  setCollapsed,
  handleLogout,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  handleLogout: () => void;
}) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-teal-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside
  className={`${
    collapsed ? "w-20" : "w-64"
  } bg-white border-r p-4 flex flex-col justify-between h-screen sticky top-0 overflow-hidden transition-all duration-300`}
>
      {/* TOP */}
      <div>
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h2 className="text-xl font-bold text-teal-700">
              Staysphere
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            <span>📊</span>
            {!collapsed && "Dashboard"}
          </Link>

          <Link href="/admin/cabins" className={linkClass("/admin/cabins")}>
            <span>🏠</span>
            {!collapsed && "Cabins"}
          </Link>

          <Link href="/admin/bookings" className={linkClass("/admin/bookings")}>
            <span>📅</span>
            {!collapsed && "Bookings"}
          </Link>

          <Link href="/admin/users" className={linkClass("/admin/users")}>
            <span>👤</span>
            {!collapsed && "Users"}
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        {collapsed ? "🚪" : "Logout"}
      </button>
    </aside>
  );
}