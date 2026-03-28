"use client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  // 🔥 CHECK USER LOGIN
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    // 🔥 auto update on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={35} height={35}/>
          <span className="font-bold text-lg text-teal-700">
            StaySphere
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <Link href="/cabins" className="hover:text-teal-600">Cabins</Link>
          <Link href="/my-bookings" className="hover:text-teal-600">My Bookings</Link>

          {/* 🔥 CONDITIONAL */}
          {!user ? (
            <Link href="/login" className="text-teal-600">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t p-4 space-y-3">
          <Link href="/" className="block">Home</Link>
          <Link href="/cabins" className="block">Cabins</Link>
          <Link href="/my-bookings" className="block">My Bookings</Link>

          {!user ? (
            <Link href="/login" className="block text-teal-600">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}

    </nav>
  );
}