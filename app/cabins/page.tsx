"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CabinCard from "@/components/CabinCard";

type Cabin = {
  id: string;
  name: string;
  price: number;
  max_guests: number;
  image_url: string;
};

export default function CabinsPage() {
  const [cabins, setCabins] = useState<Cabin[]>([]);

  useEffect(() => {
    const fetchCabins = async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*");

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      setCabins(data || []);
    };

    fetchCabins();
  }, []);

  return (
    <div className="min-h-screen">

      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-12">

        <h1 className="text-3xl font-bold mb-8">
          Available Cabins
        </h1>

        {/* 🔥 THIS IS THE FIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {cabins.map((cabin) => (
            <CabinCard key={cabin.id} cabin={cabin} />
          ))}

        </div>

      </section>

    </div>
  );
}