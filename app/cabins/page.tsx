"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CabinCard from "@/components/CabinCard";
import { useSearchParams } from "next/navigation";

type Cabin = {
  id: string;
  name: string;
  price: number;
  max_guests: number;
  image_url: string;
  type: string;
};

export default function CabinsPage() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestFilter, setGuestFilter] = useState("all"); // ✅ NEW
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || "";

  useEffect(() => {
    const fetchCabins = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("cabins")
        .select("*");

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setCabins(data || []);
      }

      setLoading(false);
    };

    fetchCabins();
  }, []);

  // Type filter - SAME
  const typeFiltered = selectedType
    ? cabins.filter((c) => c.type === selectedType)
    : cabins;

  // ✅ NEW - Guest filter
  const filteredCabins = typeFiltered.filter((c) => {
    if (guestFilter === "all") return true;
    if (guestFilter === "2-3") return c.max_guests >= 2 && c.max_guests <= 3;
    if (guestFilter === "4-7") return c.max_guests >= 4 && c.max_guests <= 7;
    if (guestFilter === "8-12") return c.max_guests >= 8 && c.max_guests <= 12;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20 text-gray-400">
          Loading cabins...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      {selectedType ? `${selectedType}s` : "Available Cabins"}
    </h1>
    <p className="text-teal-100 text-lg max-w-2xl mx-auto">
      Discover your perfect escape — book a cabin and enjoy nature at its finest.
    </p>
  </div>
</section>

      <section className="max-w-7xl mx-auto px-4 py-10">

        {/* ✅ NEW - Guest Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { label: "All cabins", value: "all" },
            { label: "2–3 guests", value: "2-3" },
            { label: "4–7 guests", value: "4-7" },
            { label: "8–12 guests", value: "8-12" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setGuestFilter(f.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                guestFilter === f.value
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-teal-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-gray-400 text-sm mb-6">
          {filteredCabins.length} {filteredCabins.length === 1 ? "cabin" : "cabins"} available
        </p>

        {filteredCabins.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏚️</p>
            <p className="text-gray-500 font-semibold text-lg">
              No cabins available right now
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Please check back later!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredCabins.map((cabin) => (
            <CabinCard key={cabin.id} cabin={cabin} />
          ))}
        </div>

      </section>
    </div>
  );
}