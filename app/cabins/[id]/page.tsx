"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Cabin = {
  id: string;
  name: string;
  description: string;
  price: number;
  max_guests: number;
  image_url: string;
};

export default function CabinDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [cabin, setCabin] = useState<Cabin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCabin = async () => {
      console.log("Cabin ID:", id); // 🔍 debug

      const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .eq("id", id)
        .maybeSingle(); // ✅ safe

      if (error) {
        console.error("Supabase Error:", error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        console.warn("No cabin found");
        setLoading(false);
        return;
      }

      setCabin(data);
      setLoading(false);
    };

    fetchCabin();
  }, [id]);

  // ⏳ Loading state
  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading cabin details...
      </p>
    );
  }

  // ❌ Not found
  if (!cabin) {
    return (
      <p className="p-6 text-center text-red-500">
        Cabin not found ❌
      </p>
    );
  }

  return (
    <div>

      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 gap-8">

          {/* Image */}
          <Image
            src={cabin.image_url || "/cabin.jpg"}
            alt={cabin.name}
            width={600}
            height={400}
            className="rounded-xl object-cover"
          />

          {/* Details */}
          <div>

            <h1 className="text-3xl font-bold mb-4">
              {cabin.name}
            </h1>

            <p className="text-gray-600 mb-4">
              {cabin.description}
            </p>

            <p className="text-lg font-semibold mb-2">
              Capacity: {cabin.max_guests} Guests
            </p>

            <p className="text-teal-600 text-xl font-bold mb-6">
              ₹{cabin.price} / night
            </p>

            <Link
              href={`/booking?cabinId=${cabin.id}`}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
            >
              Book Now
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}