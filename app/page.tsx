"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

type Cabin = {
  id: string;
  name: string;
  price: number;
  max_guests: number;
  image_url: string;
};

export default function HomePage() {
  const [cabins, setCabins] = useState<Cabin[]>([]);

  useEffect(() => {
    const fetchCabins = async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .limit(3);

      if (error) {
        console.error(error);
      } else {
        setCabins(data || []);
      }
    };

    fetchCabins();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      {/* HERO */}
      <section className="bg-[url('/hero.jpg')] bg-cover bg-center min-h-[80vh] flex items-center">
        <div className="bg-black/50 w-full py-20">
          <div className="max-w-6xl mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Cabin
            </h1>
            <p className="text-lg mb-6">
              Experience luxury resort living in nature.
            </p>
            {/* ✅ Book Now button REMOVED - sirf Explore Cabins raha */}
            <div className="flex gap-4">
              <Link href="/cabins" className="bg-teal-600 px-6 py-3 rounded-lg">
                Explore Cabins
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CABINS */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Cabins
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Handpicked cabins for your perfect getaway
            </p>
            <div className="w-16 h-1 bg-teal-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cabins.map((cabin) => (
              <div
                key={cabin.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={cabin.image_url || "/cabin.jpg"}
                    alt={cabin.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 right-3 bg-white/90 text-teal-700 font-bold text-sm px-3 py-1 rounded-full shadow">
                    ₹{cabin.price} / night
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800">
                    {cabin.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">👥</span>
                    <p className="text-gray-500 text-sm">
                      Up to {cabin.max_guests} Guests
                    </p>
                  </div>
                  <div className="border-t mt-4 mb-4" />
                  <Link
                    href={`/cabins/${cabin.id}`}
                    className="block text-center bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/cabins"
              className="border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-2.5 rounded-xl transition font-medium text-sm"
            >
              View All Cabins →
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
  <div className="max-w-6xl mx-auto px-4">
    
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      
      {/* Brand Column */}
      <div>
        <h3 className="text-white text-xl font-bold mb-3">StaySphere</h3>
        <p className="text-sm text-gray-400">
          Experience luxury resort living in nature. Book your perfect cabin getaway today.
        </p>
      </div>
      
      {/* Quick Links */}
      <div>
        <h4 className="text-white font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link href="/" className="text-gray-400 hover:text-teal-400 transition">Home</Link></li>
          <li><Link href="/cabins" className="text-gray-400 hover:text-teal-400 transition">Cabins</Link></li>
          <li><Link href="/about" className="text-gray-400 hover:text-teal-400 transition">About Us</Link></li>
          <li><Link href="/my-bookings" className="text-gray-400 hover:text-teal-400 transition">My Bookings</Link></li>
        </ul>
      </div>
      
      {/* Support */}
      <div>
        <h4 className="text-white font-semibold mb-3">Support</h4>
        <ul className="space-y-2 text-sm">
          <li className="text-gray-400">📞 +91 98765 43210</li>
          <li className="text-gray-400">✉️ support@staysphere.com</li>
          <li className="text-gray-400">📍 India</li>
        </ul>
      </div>
      
      {/* Hours */}
      <div>
        <h4 className="text-white font-semibold mb-3">Office Hours</h4>
        <ul className="space-y-2 text-sm">
          <li className="text-gray-400">Mon - Fri: 9AM - 7PM</li>
          <li className="text-gray-400">Saturday: 10AM - 5PM</li>
          <li className="text-gray-400">Sunday: Closed</li>
        </ul>
      </div>
      
    </div>
    
    {/* Divider */}
    <div className="border-t border-gray-600 pt-6 text-center text-xs text-gray-500">
      © 2026 StaySphere Resort Management. All rights reserved.
    </div>
    
  </div>
</footer>

    </div>
  );
}