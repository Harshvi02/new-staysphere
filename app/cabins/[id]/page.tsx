"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
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

type BookedDate = {
  start_date: string;
  end_date: string;
};

export default function CabinDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [cabin, setCabin] = useState<Cabin | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchCabin = async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Supabase Error:", error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      setCabin(data);
      setLoading(false);
    };

    const fetchBookedDates = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("cabin_id", id)
        .eq("status", "confirmed")
        .gte("end_date", today);

      setBookedDates(data || []);
    };

    fetchCabin();
    fetchBookedDates();
  }, [id]);

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading cabin details...
      </p>
    );
  }

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

          <Image
            src={cabin.image_url || "/cabin.jpg"}
            alt={cabin.name}
            width={600}
            height={400}
            className="rounded-xl object-cover"
            unoptimized
          />

          <div>
            <h1 className="text-3xl font-bold mb-4">{cabin.name}</h1>
            <p className="text-gray-600 mb-4">{cabin.description}</p>
            <p className="text-lg font-semibold mb-2">Capacity: {cabin.max_guests} Guests</p>
            <p className="text-teal-600 text-xl font-bold mb-4">₹{cabin.price} / night</p>

            {bookedDates.length > 0 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-700 font-semibold text-sm mb-2">
                  🟡 Partially Booked — These dates are unavailable:
                </p>
                <ul className="space-y-1">
                  {bookedDates.map((b, i) => (
                    <li key={i} className="text-yellow-600 text-xs">
                      📅 {b.start_date} → {b.end_date}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ FIXED: maxGuests added in URL */}
            <button
              onClick={async () => {
                const { data } = await supabase.auth.getUser();
                if (!data.user) {
                  router.push(`/login?redirect=/booking?cabinId=${cabin.id}&maxGuests=${cabin.max_guests}`);
                  return;
                }
                router.push(`/booking?cabinId=${cabin.id}&maxGuests=${cabin.max_guests}`);
              }}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
            >
              Book Now
            </button>

          </div>
        </div>
      </section>
    </div>
  );
}