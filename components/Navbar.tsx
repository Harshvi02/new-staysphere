"use client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cabinDropdown, setCabinDropdown] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  };

  const linkClass = (href: string) =>
    `transition text-sm font-medium ${
      pathname === href
        ? "text-teal-600 border-b-2 border-teal-600 pb-0.5"
        : "text-gray-600 hover:text-teal-600"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logostaysphere.png" alt="logo" width={100} height={100} />
          <span className="font-bold text-xl text-teal-700 tracking-tight">
            StaySphere
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkClass("/")}>Home</Link>

          {/* Cabin Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCabinDropdown(true)}
            onMouseLeave={() => setCabinDropdown(false)}
          >
            <button className={`flex items-center gap-1 transition text-sm font-medium ${
              pathname.startsWith("/cabins")
                ? "text-teal-600 border-b-2 border-teal-600 pb-0.5"
                : "text-gray-600 hover:text-teal-600"
            }`}>
              Cabins ▾
            </button>

            {cabinDropdown && (
              <div className="absolute top-5 left-0 pt-2 z-50 w-52">
                <div className="bg-white border rounded-xl shadow-lg py-2">
                  <Link href="/cabins" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    🏕️ All Cabins
                  </Link>
                  <Link href="/cabins?type=Mountain Cabin" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    ⛰️ Mountain Cabin
                  </Link>
                  <Link href="/cabins?type=Beach Cabin" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    🏖️ Beach Cabin
                  </Link>
                  <Link href="/cabins?type=Luxury Cabin" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    ✨ Luxury Cabin
                  </Link>
                  <Link href="/cabins?type=Lakeside Cabin" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    🌊 Lakeside Cabin
                  </Link>
                  <Link href="/cabins?type=Standard Cabin" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    🏠 Standard Cabin
                  </Link>
                  <Link href="/cabins?type=Ocean View Cabin" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    🌅 Ocean View Cabin
                  </Link>
                  <Link href="/cabins?type=Forest Retreat Cabin" onClick={() => setCabinDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">
                    🌲 Forest Retreat Cabin
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/my-bookings" className={linkClass("/my-bookings")}>My Bookings</Link>
          <Link href="/about" className={linkClass("/about")}>About</Link>
          {/* ✅ CONTACT LINK ADDED */}
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>

        {/* Right Side - Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link href="/login"
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-xl transition shadow-sm">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-1.5">
                {user.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="avatar" width={28} height={28} className="rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <button onClick={handleLogout}
                className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button className="md:hidden text-2xl text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 shadow-md">
          <Link href="/" onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 hover:text-teal-600 font-medium">Home</Link>
          <Link href="/cabins" onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 hover:text-teal-600 font-medium">Cabins</Link>
          <Link href="/my-bookings" onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 hover:text-teal-600 font-medium">My Bookings</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 hover:text-teal-600 font-medium">About</Link>
          {/* ✅ CONTACT LINK ADDED IN MOBILE MENU */}
          <Link href="/contact" onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 hover:text-teal-600 font-medium">Contact</Link>
          <div className="pt-2 border-t">
            {!user ? (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block bg-teal-600 text-white text-center py-2 rounded-xl text-sm">Login</Link>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <button onClick={handleLogout}
                  className="w-full text-sm text-red-500 border border-red-200 py-2 rounded-xl hover:bg-red-50 transition">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}