"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cabin = {
  id: string;
  name: string;
  price: number;
  max_guests: number;
  image_url: string;
};

export default function CabinCard({ cabin }: { cabin: Cabin }) {
  const [status, setStatus] = useState<"available" | "partially_booked">("available");

  // ✅ NEW - Check bookings for this cabin
  useEffect(() => {
    const checkBookings = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data } = await supabase
        .from("bookings")
        .select("id")
        .eq("cabin_id", cabin.id)
        .eq("status", "confirmed")
        .gte("end_date", today); // future bookings

      if (data && data.length > 0) {
        setStatus("partially_booked");
      } else {
        setStatus("available");
      }
    };

    checkBookings();
  }, [cabin.id]);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">

      {/* IMAGE */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={cabin.image_url || "/cabin.jpg"}
          alt={cabin.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-teal-700 font-bold text-sm px-3 py-1 rounded-full shadow">
          ₹{cabin.price} / night
        </div>

        {/* ✅ NEW - Status Badge */}
        <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
          status === "available"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {status === "available" ? "✅ Available" : "🟡 Partially Booked"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <h3 className="font-bold text-gray-800 text-lg">
          {cabin.name}
        </h3>

        <div className="flex items-center gap-1 mt-2">
          <span className="text-gray-400 text-sm">👥</span>
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
  );
}