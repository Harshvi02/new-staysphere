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

            <div className="flex gap-4">
              <Link href="/cabins" className="bg-teal-600 px-6 py-3 rounded-lg">
                Explore Cabins
              </Link>

              <Link href="/booking" className="bg-white text-black px-6 py-3 rounded-lg">
                Book Now
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED CABINS */}
      <section className="max-w-6xl mx-auto px-4 py-16">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Cabins
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {cabins.map((cabin) => (
            <div key={cabin.id} className="bg-white rounded-xl shadow overflow-hidden">

              <Image
                src={cabin.image_url || "/cabin.jpg"}
                alt={cabin.name}
                width={500}
                height={300}
                className="object-cover"
              />

              <div className="p-4">

                <h3 className="text-lg font-semibold">
                  {cabin.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  Capacity: {cabin.max_guests} Guests
                </p>

                <p className="text-teal-600 font-semibold mt-1">
                  ₹{cabin.price} / night
                </p>

                {/* ✅ FIXED LINK */}
                <Link
                  href={`/cabins/${cabin.id}`}
                  className="block mt-3 text-center bg-teal-600 text-white py-2 rounded-lg"
                >
                  View Details
                </Link>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-6 text-center">
        © 2026 StaySphere Resort
      </footer>

    </div>
  );
}