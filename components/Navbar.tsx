"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link href="/login" className="text-teal-600">Login</Link>
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
          <Link href="/login" className="block text-teal-600">Login</Link>
        </div>
      )}

    </nav>
  );
}